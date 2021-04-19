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

export default class LevelZero extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    time: number;
    enemyList: Array<AnimatedSprite>  = [];

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
        

        // this.addEnemy("orange_mushroom", new Vec2(300, 300), {speed : 30, player: this.player, health: 50, type:"Upper"}, 1)
        // this.addEnemy("orange_mushroom", new Vec2(200, 300), {speed : 20, player: this.player, health: 50, type:"Upper"}, 1)
        // this.addEnemy("orange_mushroom", new Vec2(310, 300), {speed : 25, player: this.player, health: 50, type:"Upper"}, 1)
        // this.addEnemy("orange_mushroom", new Vec2(340, 300), {speed : 60, player: this.player, health: 50, type:"Upper"}, 1)
        // this.addEnemy("orange_mushroom", new Vec2(400, 300), {speed : 40, player: this.player, health: 50, type:"Upper"}, 1)
        // this.addEnemy("orange_mushroom", new Vec2(305, 300), {speed : 40, player: this.player, health: 50, type:"Upper"}, 1)
        // this.addEnemy("slime_wip", new Vec2(193, 440), {speed : 25, player: this.player, health: 50, type:"Downer"}, 1.5)
        // this.addEnemy("slime_wip", new Vec2(100, 220), {speed : 40, player: this.player, health: 50, type:"Downer"}, 0.5)
        // this.addEnemy("slime_wip", new Vec2(80, 198), {speed : 45, player: this.player, health: 50, type:"Downer"}, 2)
        // this.addEnemy("slime_wip", new Vec2(225, 156), {speed : 40, player: this.player, health: 50, type:"Downer"}, 1)
        // this.addEnemy("slime_wip", new Vec2(500, 333), {speed : 30, player: this.player, health: 50, type:"Downer"}, 1)
        // this.addEnemy("slime_wip", new Vec2(405, 201), {speed : 35, player: this.player, health: 50, type:"Downer"}, 1)
        // enemies options : speed, health, attackRange (this could probably be replaced with enemy types),

        this.levelZeroReceiver.subscribe(InGame_Events.ANGRY_MOOD_REACHED);
        this.levelZeroReceiver.subscribe(InGame_Events.HAPPY_MOOD_REACHED);
        this.subscribeToEvents();
    
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);

        if(Input.isKeyJustPressed("o")){
            console.log("yo");
            this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);

        }

        if(Input.isKeyJustPressed("p")){
            console.log("yurr");
            this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);

        }



        if(Input.isKeyJustPressed("k")){
            for(let enemy of this.enemyList){
                let enemyController = <EnemyController>enemy._ai;
                enemyController.damage(50);
            }
        }

        while(this.levelZeroReceiver.hasNextEvent()) {
            let event = this.levelZeroReceiver.getNextEvent();

            if(event.type === InGame_Events.ANGRY_MOOD_REACHED) {
                this.increaseEnemyStrength();
                this.levelZeroReceiver.unsubscribe(InGame_Events.ANGRY_MOOD_REACHED)

            }

            if(event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                this.increaseEnemySpeed();
                this.levelZeroReceiver.unsubscribe(InGame_Events.HAPPY_MOOD_REACHED)
            }

            if(event.type === InGame_Events.ON_DOWNER) {
                console.log(':(')
            }

            if(event.type === InGame_Events.ON_UPPER) {
                console.log(':)')
            }


        }

        // We want to randomly select the position, and time and maybe some counter ( max enemies in the map ) currently spawning every 15 seconds
        // if (Date.now() - this.time > 15000) {
        //     console.log("15 seconds passed");
        //     // addEnemy - params:(SpriteKey, Position, aiOptions, scale)
        //     this.addEnemy("temp_enemy", new Vec2(300, 300), {  health : 5, player: this.player }, 1);
        //     this.time = Date.now();
        // }

    }
    



    protected subscribeToEvents() {
        this.levelZeroReceiver.subscribe([
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DIED,
            InGame_Events.ON_DOWNER,
            InGame_Events.ON_UPPER
        ]);
    }

    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>, scale: number): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x, tilePos.y);
        enemy.scale.set(scale, scale);
        let collisionShape = enemy.size;
        // This has to be touched
        // this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.halfSize.scaled(this.scene.getViewScale())
        enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(((collisionShape.x/2) - 2) * scale, (collisionShape.y/2 - collisionShape.y/3) * scale)));
        
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
        playerController.increaseDamageTaken(2);
    }

}