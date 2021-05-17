import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIEvents,InGame_Events, Scenes } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Timer from "../../Wolfie2D/Timing/Timer";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GrowthManager from "../GameSystems/GrowthManager";
import * as Tweens from "../Utils/Tweens";
import ScriptedSequence from "../Classes/ScriptedSequence";
import { Physics } from "../Utils/PhysicsOptions";
import Level_Spring_One from "./Level_Spring_One";
import MainMenu from "../MainMenu";

export default class LevelZero extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    maxEnemyNumber: number = 10;
    levelHasStarted: boolean = false;
    introSequence: ScriptedSequence;
    currentLevel: string = Scenes.LEVEL_ZERO;

    moodEffectTimer: Timer = new Timer(10000, null, false);
    moodBarTimer: Timer = new Timer(6000, null, false);
    levelZeroReceiver: Receiver = new Receiver();

    pauseExecution: boolean = false;
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_zero", "assets/tilemaps/SpringLevel/tutorialLevel.json");
        this.load.object("tutorialScript", "assets/data/tutorialLevelScript.json")
        this.load.audio("background_music", "assets/music/in_game_music.mp3")
        this.load.audio("plant_voice_sfx", "assets/sfx/plant_voice_sfx.wav")
    }

    startScene(): void {
        super.startScene()
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "background_music", loop: true, holdReference: true });
        let tilemapLayers = this.add.tilemap("level_zero");
        for (let layer of tilemapLayers) {
            let obj = layer.getItems()[0];
            if (obj.isCollidable) {
                this.collidables = <OrthogonalTilemap>obj;
            }
        }
        this.tilemapSize = this.collidables.size;
        super.initPlant(this.collidables.size);
        this.plant.animation.playIfNotAlready("EH", true);
        super.initPlayer(this.collidables.size);
        super.initViewport(this.collidables.size);
        super.initGameUI(this.viewport.getHalfSize());
        super.initPauseMenu(this.viewport.getHalfSize());
        super.initGameOverScreen(this.viewport.getHalfSize());
        super.initLevelCompletionScreen(this.viewport.getHalfSize());
        super.initSpawnerTimer(4000);
        this.viewport.follow(this.player);
        this.levelZeroReceiver.subscribe(InGame_Events.ANGRY_MOOD_REACHED);
        this.levelZeroReceiver.subscribe(InGame_Events.HAPPY_MOOD_REACHED);
        this.subscribeToEvents();
        let tutorialScript = this.load.getObject("tutorialScript");
        this.introSequence = new ScriptedSequence(this, tutorialScript, new Vec2(this.plant.position.x, this.plant.position.y - 32));
        this.supportManager.addHealthPacks(10);
        this.supportManager.addAmmoPacks(10);
        this.growthManager = new GrowthManager(this, 18);
        this.spawnerTimer.start();
        this.nextLevel = Scenes.LEVEL_SPRING_ONE;
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
        this.growthManager.update(deltaT);
        if(this.levelHasStarted) {

            if (this.pauseExecution && this.spawnerTimer.isActive() && !this.completionStatus) {
                this.spawnerTimer.pause();
                // console.log(this.spawnerTimer.toString());
            }
            else if (!this.pauseExecution && this.spawnerTimer.isPaused() && !this.completionStatus) {
                this.spawnerTimer.continue();
            }
            if (this.spawnerTimer.isStopped() && this.maxEnemyNumber >= this.enemyManager.activePool.length && !this.pauseExecution) {
                this.spawnerTimer.reset();
                this.spawnerTimer.start();
                this.enemyManager.spawnEnemy(this.player, this.plant);
            }
            if (this.completionStatus && !this.finalWaveCleared && this.enemyManager.activePool.length === 0) {
                this.spawnerTimer.pause();
                // Change the number of final wave enemies for each level
                this.finalWave(5);
                this.finalWaveCleared = true;

            }

        }
        else if (!this.pauseExecution && !this.introSequence.hasStarted) {
            this.introSequence.begin();
        }
        else if (!this.pauseExecution && this.introSequence.isRunning && !this.introSequence.hasFinished) {
            this.introSequence.advance();
        }
        else if (this.introSequence.hasFinished) {
            this.levelHasStarted = true;
            this.equipmentManager.spawnEquipment("PillBottle", new Vec2(this.plant.position.x, this.plant.position.y + 32))
        }
        else if (this.pauseExecution && this.moodEffectTimer.isActive()) {
            this.moodEffectTimer.pause();
        }
        else if (!this.pauseExecution && this.moodEffectTimer.isPaused()) {
            this.moodEffectTimer.continue();
        }

        if(this.moodEffectTimer.isStopped() && this.moodEffectTimer.hasRun()) {

            this.moodEffectTimer.reset();
            this.plant.animation.play("EH");
            this.moodManager.resetEffect(this, this.player.position);
        }
       



        while (this.levelZeroReceiver.hasNextEvent()) {
            let event = this.levelZeroReceiver.getNextEvent();
            if (event.type === InGame_Events.ANGRY_MOOD_REACHED) {
                this.moodEffectTimer.start();
                this.plant.animation.play("ANGRY", true);
                this.moodManager.applyEffect(this,"downer", Math.floor(Math.random() * this.moodManager.prototypesAngry.length), this.player.position);
                
            }
            if (event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                this.moodEffectTimer.start();
                this.plant.animation.play("HAPPY", true);
                this.moodManager.applyEffect(this,"upper", Math.floor(Math.random() * this.moodManager.prototypesHappy.length), this.player.position);
                
            }
            if (event.type === UIEvents.CLICKED_RESTART) {
                this.nextLevel = this.currentLevel;

                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.screenWipe.tweens.add("levelTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL));
                this.screenWipe.tweens.play("levelTransition");
            }

            if (event.type === UIEvents.TRANSITION_LEVEL) {
                let sceneOptions = {
                    physics: Physics
                }
                switch (this.nextLevel) {
                    case Scenes.MAIN_MENU:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        this.sceneManager.changeToScene(MainMenu, {});
                        break;
                    case this.currentLevel:
                            this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                            this.sceneManager.changeToScene(LevelZero, {}, sceneOptions);
                        break;
                    default:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        this.sceneManager.changeToScene(Level_Spring_One, {}, sceneOptions);
                    }
            }

        }


    }

    protected subscribeToEvents() {
        this.levelZeroReceiver.subscribe([
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DIED,
            InGame_Events.UPDATE_MOOD,
            InGame_Events.TOGGLE_PAUSE,
            UIEvents.TRANSITION_LEVEL,
            UIEvents.CLICKED_RESTART
        ]);
    }

    unloadScene(): void {
        super.unloadScene();
        this.levelZeroReceiver.destroy();
        this.load.keepAudio("background_music");
    }
}