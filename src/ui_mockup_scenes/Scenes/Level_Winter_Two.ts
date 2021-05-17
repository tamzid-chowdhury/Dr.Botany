import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIEvents, UILayers, ButtonNames, InGame_Events, InGame_GUI_Events, Scenes } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PlayerController from "../Controllers/PlayerController";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Timer from "../../Wolfie2D/Timing/Timer";
import AnimatedDialog from "../Classes/AnimatedDialog";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GrowthManager from "../GameSystems/GrowthManager";
import * as Tweens from "../Utils/Tweens";
import { Physics } from "../Utils/PhysicsOptions";
import MainMenu from "../MainMenu";

export default class Level_Winter_Two extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    time: number;
    // This should be a variable to each level I guess? 
    maxEnemyNumber: number = 10;
    
    currentLevel: string = Scenes.LEVEL_WINTER_TWO;


    // // TODO: move mood control into PlantController
    // overallMood: number = 0; // -10 to 10 maybe? probably have to play with this
    // mood: string = "normal";
    // moodMin: number = -10;
    // moodMax: number = 10;
    moodBarTimer: Timer = new Timer(6000, null, false);
    levelZeroReceiver: Receiver = new Receiver();

    overdrawTiles: Array<Sprite> = [];
    runTest: boolean;
    pauseExecution: boolean = false;
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_winter_two", "assets/tilemaps/WinterLevels/WinterLevel2.json");

        this.load.audio("background_music", "assets/music/fall_music.mp3")
    }


    startScene(): void {
        super.startScene()
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "background_music", loop: true, holdReference: true });

        // this.moodBarTimer.start();
        this.time = Date.now();
        let tilemapLayers = this.add.tilemap("level_winter_two");
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



        //we initialized supportmanager in gamelevel but it starts with 0 healthpacks and 0 ammopacks 
        //we use addHealthPacks and addAmmoPacks to add how many we want for each level. in tutorial level will have 5 each
        this.supportManager.addHealthPacks(5);
        this.supportManager.addAmmoPacks(5);

        this.growthManager = new GrowthManager(this);
        this.spawnerTimer.start();

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
        this.growthManager.update(deltaT);
        // Spawner System, we might need a spawnerManager.ts, this seems to work fine tho
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (this.pauseExecution && this.spawnerTimer.isActive() && !this.completionStatus) {
            this.spawnerTimer.pause();
            // console.log(this.spawnerTimer.toString());
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
            // THIS is completion of the level you declare
            this.nextLevel = Scenes.LEVEL_FALL_ONE;
        }
        // if (this.finalWaveCleared && this.enemyManager.activePool.length === 0) {
        //     this.emitter.fireEvent(InGame_Events.LEVEL_COMPLETED);
        // }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        if (this.moodBarTimer.isStopped() && this.moodBarTimer.hasRun()) {
            this.moodBarTimer.reset();


            // this.resetHappyEffect();


            this.resetAngryEffect();

            // this.mood = "normal";
        }



        // if (Input.isKeyJustPressed("o")) {

        //     this.overallMood -= 1;
        //     console.log("Mood: -1, Current Mood stat: " + this.overallMood);
        //     // this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, {moodChange: -1});
        //     if (this.overallMood <= this.moodMin) {
        //         this.overallMood = 0;
        //         this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);
        //     }


        // }

        // if (Input.isKeyJustPressed("p")) {

        //     this.overallMood += 1;
        //     console.log("Mood: +1, Current Mood stat: " + this.overallMood);
        //     // this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, {moodChange: 1});
        //     if (this.overallMood >= this.moodMax) {
        //         this.overallMood = 0;
        //         this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);
        //     }


        // }

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
                //this.mood = "angry";
                if (this.moodBarTimer.isActive() === false) {
                    this.moodBarTimer.start();
                    this.increaseEnemyStrength();
                }


            }

            if (event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                //this.mood = "happy";
                if (this.moodBarTimer.isActive() === false) {
                    this.moodBarTimer.start();
                    // console.log("Happy mood reached, have to implement faster enemies' speed behavior")
                    // this.increaseEnemySpeed(); // increase speed buggy 
                }
            }

            // We gotta check this with each levels
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
                            this.sceneManager.changeToScene(Level_Winter_Two, {}, sceneOptions);
                        break;
                    default:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        this.sceneManager.changeToScene(MainMenu, {});
                    }
            }


        }


    }

    protected subscribeToEvents() {
        this.levelZeroReceiver.subscribe([
            InGame_Events.TOGGLE_PAUSE,
            UIEvents.CLICKED_RESTART,
            InGame_Events.LEVEL_COMPLETED,
            UIEvents.TRANSITION_LEVEL
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