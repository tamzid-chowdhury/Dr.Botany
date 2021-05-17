import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIEvents, UILayers, ButtonNames, InGame_Events, InGame_GUI_Events, Scenes } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../Controllers/PlayerController";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Timer from "../../Wolfie2D/Timing/Timer";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GrowthManager from "../GameSystems/GrowthManager";
import * as Tweens from "../Utils/Tweens";
import ScriptedSequence from "../Classes/ScriptedSequence"
export default class LevelZero extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    maxEnemyNumber: number = 10;
    levelHasStarted: boolean = false;


    introSequence: ScriptedSequence;

    // // TODO: move mood control into PlantController
    // overallMood: number = 0; // -10 to 10 maybe? probably have to play with this
    // mood: string = "normal";
    // moodMin: number = -10;
    // moodMax: number = 10;
    moodEffectTimer: Timer = new Timer(10000, null, false);
    moodEffect : boolean = false;
    levelZeroReceiver: Receiver = new Receiver();

    overdrawTiles: Array<Sprite> = [];
    runTest: boolean;
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

        // this.moodBarTimer.start();
        let tilemapLayers = this.add.tilemap("level_zero");
        for (let layer of tilemapLayers) {
            let obj = layer.getItems()[0];
            if (obj.isCollidable) {
                this.collidables = <OrthogonalTilemap>obj;
            }
        }
        // this.collidables.active = true;

        this.tilemapSize = this.collidables.size;


        //INITIALIZE PLANT BEFORE PLAYER WHEN MAKING YOUR LEVELS 
        super.initPlant(this.collidables.size);
        super.initPlayer(this.collidables.size);
        super.initViewport(this.collidables.size);
        super.initGameUI(this.viewport.getHalfSize());
        super.initPauseMenu(this.viewport.getHalfSize());
        super.initGameOverScreen(this.viewport.getHalfSize());
        super.initLevelCompletionScreen(this.viewport.getHalfSize());
        ///////////////////////////////// For each level
        super.initSpawnerTimer(3000);
        /////////////////////////////////
        this.viewport.follow(this.player);

        this.levelZeroReceiver.subscribe(InGame_Events.ANGRY_MOOD_REACHED);
        this.levelZeroReceiver.subscribe(InGame_Events.HAPPY_MOOD_REACHED);
        this.subscribeToEvents();


        let tutorialScript = this.load.getObject("tutorialScript");
        this.introSequence = new ScriptedSequence(this, tutorialScript, new Vec2(this.plant.position.x, this.plant.position.y - 32));




        //we initialized supportmanager in gamelevel but it starts with 0 healthpacks and 0 ammopacks 
        //we use addHealthPacks and addAmmoPacks to add how many we want for each level. in tutorial level will have 5 each
        this.supportManager.addHealthPacks(10);
        this.supportManager.addAmmoPacks(10);

        this.growthManager = new GrowthManager(this);
        this.spawnerTimer.start();

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
        this.growthManager.update(deltaT);

        if(this.levelHasStarted) {
            // Spawner System, we might need a spawnerManager.ts, this seems to work fine tho
            ////////////////////////////////////////////////////////////////////////////////////////////////
            if (this.pauseExecution && this.spawnerTimer.isActive() && !this.completionStatus) {
                this.spawnerTimer.pause();
                console.log(this.spawnerTimer.toString());
            }
            else if (!this.pauseExecution && this.spawnerTimer.isPaused() && !this.completionStatus) {
                this.spawnerTimer.continue();
            }
            if (this.spawnerTimer.isStopped() && this.maxEnemyNumber >= this.enemyManager.activePool.length && !this.pauseExecution) {
                this.spawnerTimer.start();
                this.enemyManager.spawnEnemy(this.player, this.plant);
                // console.log("SPAWNED ENEMY, Current Active Enemies: ", this.enemyManager.activePool.length);
            }
            if (this.completionStatus && !this.finalWaveCleared && this.enemyManager.activePool.length === 0) {
                this.spawnerTimer.pause();
                this.finalWave(10);
                this.finalWaveCleared = true;
                this.nextLevel = Scenes.LEVEL_FALL_ONE;
            }
            // if (this.finalWaveCleared && this.enemyManager.activePool.length === 0) {
            //     this.emitter.fireEvent(InGame_Events.LEVEL_COMPLETED);
            // }

            ///////////////////////////////////////////////////////////////////////////////////////////

        }
        else if(!this.pauseExecution && !this.introSequence.hasStarted) {
            this.introSequence.begin();
        }
        else if(!this.pauseExecution && this.introSequence.isRunning && !this.introSequence.hasFinished) {
            this.introSequence.advance();
        } 
        else if(this.introSequence.hasFinished) {
            this.levelHasStarted = true;
            this.equipmentManager.spawnEquipment("PillBottle", new Vec2(this.plant.position.x, this.plant.position.y + 32))

        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Mood timer stuff
        /////////////////////////////////////////////////////////////////////
        if(this.moodEffectTimer.isStopped() && this.moodEffectTimer.hasRun()) {
            this.moodEffectTimer.reset();
            this.moodEffect = false;
            console.log("here");
            this.moodManager.resetEffect(this.player, this.enemyManager.activePool , 1);
        }
        /////////////////////////////////////////////////////////////////////
       



        

        if (Input.isKeyJustPressed("n")) {
            this.enemyManager.spawnEnemy(this.player, this.plant);
        }

        if (Input.isKeyJustPressed("m")) {
            this.equipmentManager.spawnEquipment("TrashLid", new Vec2(300, 300))
        }

        if (Input.isKeyJustPressed("l")) {
            this.equipmentManager.spawnEquipment("PillBottle", new Vec2(300, 400))
        }

        while (this.levelZeroReceiver.hasNextEvent()) {
            let event = this.levelZeroReceiver.getNextEvent();


            if (event.type === InGame_Events.ANGRY_MOOD_REACHED) {
                this.moodEffect = true;
                this.moodEffectTimer.start();
                this.moodManager.applyEffect(this.player, this.enemyManager.activePool, 1);
            }

            if (event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                this.moodEffect = true;
                this.moodEffectTimer.start();
                this.moodManager.applyEffect(this.player, this.enemyManager.activePool, 1);
            }

            // We gotta check this with each levels
            if (event.type === UIEvents.CLICKED_RESTART) {
                this.nextLevel = Scenes.LEVEL_ZERO;
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.screenWipe.tweens.add("levelTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL));
                this.screenWipe.tweens.play("levelTransition");
            }



            }
        }


    

    protected subscribeToEvents() {
        this.levelZeroReceiver.subscribe([
            UIEvents.CLICKED_RESTART,
            InGame_Events.ANGRY_MOOD_REACHED,
            InGame_Events.HAPPY_MOOD_REACHED

        ]);
    }

    unloadScene(): void {
        super.unloadScene();
        // TODO: pass managers, player controller to next level 
        this.levelZeroReceiver.destroy();
    }




    protected increaseEnemyStrength(): void {
        let playerController = <PlayerController>this.player._ai;
        playerController.increaseDamageTaken(2);
    }

    protected resetAngryEffect(): void {
        let playerController = <PlayerController>this.player._ai;
        playerController.increaseDamageTaken(1);
    }



}