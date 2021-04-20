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

export default class LevelZero extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    time: number;
    enemyList: Array<AnimatedSprite>  = [];
    enemyNameList: Array<string> = ["orange_mushroom", "slime_wip"];

    // TODO: move mood control into PlantController
    overallMood: number = 0; // -10 to 10 maybe? probably have to play with this
    moodMin: number = -10;
    moodMax: number = 10;
    moodBarTimer: Timer = new Timer(6000, null, false);
    levelZeroReceiver: Receiver = new Receiver();
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_zero", "assets/tilemaps/level_zero/tiled_level_zero.json");
        this.load.spritesheet("temp_enemy", "assets/enemies/temp_enemy.json")

        this.load.spritesheet("orange_mushroom", "assets/enemies/orange_mushroom.json" )
        this.load.spritesheet("slime_wip", "assets/enemies/slime_wip.json" )
    }

    startScene(): void {
        super.startScene()
        // this.moodBarTimer.start();
        this.time = Date.now();
        let tilemapLayers = this.add.tilemap("level_zero");
        for(let layer of tilemapLayers) {
            let obj = layer.getItems()[0];
            if(obj.isCollidable) {
                this.collidables = <OrthogonalTilemap>obj;
            }
        }
        this.tilemapSize = this.collidables.size;

        super.initPlayer(this.collidables.size);
        super.initPlant(this.collidables.size);
        super.initViewport(this.collidables.size);
        super.initGameUI(this.viewport.getHalfSize());
        super.initReticle();
        this.viewport.follow(this.player);
        
        this.levelZeroReceiver.subscribe(InGame_Events.ANGRY_MOOD_REACHED);
        this.levelZeroReceiver.subscribe(InGame_Events.HAPPY_MOOD_REACHED);
        this.subscribeToEvents();
    
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        if(this.moodBarTimer.isPaused()) {
            this.overallMood = 0;
            this.moodBarTimer.reset();
            // reset the effect
        }
        console.log(this.moodBarTimer.toString());
        if(Input.isKeyJustPressed("o")){
            console.log("Mood: -1, Current Mood stat: " + this.overallMood);
            this.overallMood -= 1;
            if (this.overallMood === this.moodMin) {
                this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);
            }
            

        }

        if(Input.isKeyJustPressed("p")){
            console.log("Mood: +1, Current Mood stat: " + this.overallMood);
            this.overallMood += 1;
            if (this.overallMood === this.moodMax) {
                this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);
            }
            

        }

        // console.log(this.moodBarTimer.toString());



        if(Input.isKeyJustPressed("k")){
            for(let enemy of this.enemyList){
                let enemyController = <EnemyController>enemy._ai;
                enemyController.damage(50);
            }
        }

        while(this.levelZeroReceiver.hasNextEvent()) {
            let event = this.levelZeroReceiver.getNextEvent();

            if(event.type === InGame_Events.ANGRY_MOOD_REACHED) {
                this.moodBarTimer.start();
                // this.increaseEnemyStrength();
                console.log(this.overallMood);
                // this.levelZeroReceiver.unsubscribe(InGame_Events.ANGRY_MOOD_REACHED)

            }

            if(event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                // this.increaseEnemySpeed();
                this.moodBarTimer.start();
                console.log(this.overallMood);
                // this.levelZeroReceiver.unsubscribe(InGame_Events.HAPPY_MOOD_REACHED)
            }

            if(event.type === InGame_Events.ADD_TO_MOOD) {
                let type = event.data.get('type');
                let count = event.data.get('count');
                count *= type;
                this.overallMood += count;
                MathUtils.clamp(this.overallMood, this.moodMin, this.moodMax);
                this.emitter.fireEvent(InGame_Events.MOOD_CHANGED, {moodChange: count});
            }


        }

        // We want to randomly select the position, and time and maybe some counter ( max enemies in the map ) currently spawning every 5 seconds
        if (Date.now() - this.time > 5000) {
            let randomInt = Math.floor(Math.random() * this.enemyNameList.length);
            let randomX = Math.floor(Math.random() * (this.tilemapSize.x - 100) + 50);
            let randomY = Math.floor(Math.random() * (this.tilemapSize.y - 100) + 50);
            console.log("15 seconds passed, Spawning new enemy");
            if(this.enemyNameList[randomInt] === "orange_mushroom") {
                let randomScale = Math.random() * (2 - 1) + 1;
                this.addEnemy("orange_mushroom" ,new Vec2(randomX, randomY), {speed : 60 * (1/randomScale), player: this.player, health: 50, type:"Upper"}, 1 );
            }
            else if (this.enemyNameList[randomInt] === "slime_wip") {
                let randomScale = Math.random() * (2 - 0.5) + 0.5;

                this.addEnemy("slime_wip", new Vec2(randomX, randomY), {speed : 50 * (1/randomScale), player: this.player, health: 40, type:"Downer"}, 1.5 )
            }
            this.time = Date.now();
        }
    }
    



    protected subscribeToEvents() {
        this.levelZeroReceiver.subscribe([
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DIED,
            InGame_Events.ADD_TO_MOOD,

        ]);
    }

    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>, scale: number): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x, tilePos.y);
        enemy.scale.set(scale, scale);
        let collisionShape = enemy.size;
        // This has to be touched
        // this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.halfSize.scaled(this.scene.getViewScale())
        enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(((collisionShape.x/2 )- 2) * scale, (collisionShape.y/2 - collisionShape.y/3) * scale)));
        
        enemy.colliderOffset.set(0,(collisionShape.y/3) * scale);
        // play with this // maybe add a condition for each enemy
        
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemies");
        enemy.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
        enemy.setTrigger("projectiles", InGame_Events.PROJECTILE_HIT_ENEMY, null)

        this.enemyList.push(enemy);
    }

    protected increaseEnemySpeed(): void {
        for(let enemy of this.enemyList){
            let enemyController = <EnemyController>enemy._ai;
            enemyController.increaseSpeed();
        }
    }

    protected increaseEnemyStrength(): void {
        let playerController = <PlayerController>this.player._ai; 
        playerController.increaseDamageTaken(10);
    }

}