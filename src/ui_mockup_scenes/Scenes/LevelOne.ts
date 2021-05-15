import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIEvents, UILayers, ButtonNames, InGame_Events, InGame_GUI_Events } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";
import EnemyController from "../Enemies/EnemyController";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Receiver from "../../Wolfie2D/Events/Receiver";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Timer from "../../Wolfie2D/Timing/Timer";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import AnimatedDialog from "../Classes/AnimatedDialog";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import MainMenu from "../MainMenu";
import { Physics, PhysicsGroups } from "../Utils/PhysicsOptions";

export default class LevelOne extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    time: number;
    enemyList: Array<AnimatedSprite> = [];


    testLabel: AnimatedDialog;

    // TODO: move mood control into PlantController
    overallMood: number = 0; // -10 to 10 maybe? probably have to play with this
    mood: string = "normal";
    moodMin: number = -10;
    moodMax: number = 10;
    moodBarTimer: Timer = new Timer(6000, null, false);
    levelZeroReceiver: Receiver = new Receiver();

    overdrawTiles: Array<Sprite> = [];
    runTest: boolean;
    pauseExecution: boolean = false;
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_one", "assets/tilemaps/tutorialLevel/level1.json");
        this.load.image("box_top", "assets/misc/test_box.png")
        this.load.spritesheet("temp_enemy", "assets/enemies/temp_enemy.json")
        this.load.object("equipmentData", "assets/data/equipmentData.json");
        this.load.spritesheet("orange_mushroom", "assets/enemies/orange_mushroom.json")
        this.load.spritesheet("green_slime", "assets/enemies/slime_wip.json")
        this.load.audio("background_music", "assets/music/in_game_music.mp3")
    }

    unloadScene(): void {
        this.levelZeroReceiver.destroy();
    }

    startScene(): void {
        super.startScene()
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "background_music", loop: true, holdReference: true });
        
        // this.moodBarTimer.start();
        this.time = Date.now();
        let tilemapLayers = this.add.tilemap("level_one");
        for (let layer of tilemapLayers) {
            let obj = layer.getItems()[0];
            if (obj.isCollidable) {
                this.collidables = <OrthogonalTilemap>obj;
            }
        }
        this.tilemapSize = this.collidables.size;

        super.initPlayer(this.collidables.size);
        super.initPlant(this.collidables.size);
        super.initViewport(this.collidables.size);
        super.initGameUI(this.viewport.getHalfSize());
        super.initPauseMenu(this.viewport.getHalfSize());
        super.initGameOverScreen(this.viewport.getHalfSize());
        this.viewport.follow(this.player);

        this.levelZeroReceiver.subscribe(InGame_Events.ANGRY_MOOD_REACHED);
        this.levelZeroReceiver.subscribe(InGame_Events.HAPPY_MOOD_REACHED);
        this.subscribeToEvents();
        for(let i = 0; i < 3; i++) {
            this.overdrawTiles.push(this.add.sprite('box_top', 'primary'));
            this.overdrawTiles[i].visible = false;
        }
        this.testLabel = new AnimatedDialog("I am a test string", this.player.position.clone(), this);

        this.addEnemy("orange_mushroom", new Vec2(500, 500), { speed: 20, player: this.player, health: 40, type: "Downer" }, 1.5);


    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        if(!this.testLabel.finished && this.runTest) {
            this.testLabel.incrementText();
        }

        if (this.moodBarTimer.isStopped() && this.moodBarTimer.hasRun()) {
            this.moodBarTimer.reset();


            // this.resetHappyEffect();


            this.resetAngryEffect();

            this.mood = "normal";
        }
        
        if (Input.isKeyJustPressed("t")) {

            this.runTest = true;


        }


 

        if (Input.isKeyJustPressed("l")) {
            this.addEnemy("green_slime", new Vec2(this.tilemapSize.x/2, this.tilemapSize.y/2), { speed: 50 , player: this.player, health: 40, type: "Downer" }, 1.5)
        }

        if (Input.isKeyJustPressed("m")) {
            this.addEnemy("orange_mushroom", new Vec2(this.tilemapSize.x/2, this.tilemapSize.y/2), { speed: 80 , player: this.player, health: 40, type: "Upper" }, 1)
        }





        // NOTE: Disabling this for now as it crashes if an enemy has died
        // if (Input.isKeyJustPressed("k")) {
        //     for (let enemy of this.enemyList) {
        //         if(enemy) {
        //             let enemyController = <EnemyController>enemy._ai;
        //             enemyController.damage(50);
        //         }

        //     }
        // }

        while (this.levelZeroReceiver.hasNextEvent()) {
            let event = this.levelZeroReceiver.getNextEvent();


            if (event.type === InGame_Events.ANGRY_MOOD_REACHED) {
                this.mood = "angry";
                if (this.moodBarTimer.isActive() === false) {
                    this.moodBarTimer.start();
                    this.increaseEnemyStrength();
                }

                // this.levelZeroReceiver.unsubscribe(InGame_Events.ANGRY_MOOD_REACHED)

            }

            if (event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                this.mood = "happy";
                if (this.moodBarTimer.isActive() === false) {
                    this.moodBarTimer.start();
                    console.log("Happy mood reached, have to implement faster enemies' speed behavior")
                    // this.increaseEnemySpeed(); // increase speed buggy 
                }
                // this.levelZeroReceiver.unsubscribe(InGame_Events.HAPPY_MOOD_REACHED)
            }

            if (event.type === InGame_Events.UPDATE_MOOD) {
                let type = event.data.get('type');
                let count = event.data.get('count');
                count *= type;
                this.overallMood += count;
                MathUtils.clamp(this.overallMood, this.moodMin, this.moodMax);
                this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, { moodChange: count });
                if (this.overallMood <= this.moodMin) {
                    this.overallMood = 0;
                    this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);
                }
                if (this.overallMood >= this.moodMax) {
                    this.overallMood = 0;
                    this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);
                }
            }

            if(event.type === InGame_Events.TOGGLE_PAUSE) {
                this.pauseExecution = true;
            }

            if (event.type === UIEvents.CLICKED_RESTART) {
                let sceneOptions = {
                    physics: Physics
                }
                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music" });
                this.sceneManager.changeToScene(LevelOne, {}, sceneOptions);
            }
            


        }


        // We want to randomly select the position, and time and maybe some counter ( max enemies in the map ) currently spawning every 5 seconds

        // We just need to use enemyList correctly when destroyed, unshift the arrays 

        // if(this.enemyList.length > this.maxEnemyNumber) {
        //     if (Date.now() - this.time > 5000) {
        //         let randomInt = Math.floor(Math.random() * this.enemyNameList.length);
        //         let randomX = Math.floor(Math.random() * (this.tilemapSize.x - 100) + 50);
        //         let randomY = Math.floor(Math.random() * (this.tilemapSize.y - 100) + 50);
        //         console.log("5 seconds passed, Spawning new enemy");
        //         if (this.enemyNameList[randomInt] === "orange_mushroom") {
        //             let randomScale = Math.random() * (2 - 1) + 1;
        //             this.addEnemy("orange_mushroom", new Vec2(randomX, randomY), { speed: 90 * (1 / randomScale), player: this.player, health: 50, type: "Upper" }, 1);
        //         }
        //         else if (this.enemyNameList[randomInt] === "slime_wip") {
        //             let randomScale = Math.random() * (2 - 0.5) + 0.5;
    
        //             this.addEnemy("slime_wip", new Vec2(randomX, randomY), { speed: 80 * (1 / randomScale), player: this.player, health: 40, type: "Downer" }, 1.5)
        //         }
        //         this.time = Date.now();

        

    }




    protected subscribeToEvents() {
        this.levelZeroReceiver.subscribe([
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DIED,
            InGame_Events.UPDATE_MOOD,
            InGame_Events.DRAW_OVERLAP_TILE,
            InGame_Events.TOGGLE_PAUSE,
            UIEvents.CLICKED_RESTART

        ]);
    }

    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>, scale: number): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x, tilePos.y);
        enemy.scale.set(scale, scale);
        let collisionShape = enemy.size;
        // This has to be touched
        // this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.halfSize.scaled(this.scene.getViewScale())
        enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(((collisionShape.x / 2) - 2) * scale, (collisionShape.y / 2 - collisionShape.y / 3) * scale)));

        enemy.colliderOffset.set(0, (collisionShape.y / 3) * scale);
        // play with this // maybe add a condition for each enemy

        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup(PhysicsGroups.ENEMY);
        enemy.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
        enemy.setTrigger("projectiles", InGame_Events.PROJECTILE_HIT_ENEMY, null)

        this.enemyList.push(enemy);
    }
    // TODO: make it so that new created enemies have doubled speed, because when the timer is done, newly created enemies with normal speed gets slower than normal
    protected increaseEnemySpeed(): void {
        for (let enemy of this.enemyList) {
            let enemyController = <EnemyController>enemy._ai;
            enemyController.increaseSpeed();
        }
    }

    protected increaseEnemyStrength(): void {
        let playerController = <PlayerController>this.player._ai;
        playerController.increaseDamageTaken(10);
    }

    protected resetAngryEffect(): void {
        let playerController = <PlayerController>this.player._ai;
        playerController.increaseDamageTaken(5);
    }

    protected resetHappyEffect(): void {
        for (let enemy of this.enemyList) {
            let enemyController = <EnemyController>enemy._ai;
            enemyController.decreaseSpeed();
        }
    }

}