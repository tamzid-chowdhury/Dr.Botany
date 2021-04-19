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

export default class LevelZero extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    time: number;
    testMaterial: Sprite;
    enemyList: Array<AnimatedSprite>  = [];
    //shouldMaterialMove: boolean = false;
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_zero", "assets/tilemaps/level_zero/tiled_level_zero.json");
        this.load.spritesheet("temp_enemy", "assets/enemies/temp_enemy.json")
        this.load.image("box", "assets/misc/test_box.png")
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

        // this.testMaterial = this.add.sprite("green_orb", 'primary');
        // this.testMaterial.position = new Vec2(100, 100); 
        // this.testMaterial.scale.set(0.6, 0.6);
        

        this.addEnemy("orange_mushroom", new Vec2(300, 300), {speed : 30, player: this.player, health: 50, type:"Upper"}, 1)
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
        


        this.subscribeToEvents();
    
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);

        if(Input.isKeyJustPressed("m")){
            this.testMaterial.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 2)));
            this.testMaterial.setGroup("materials");
            this.testMaterial.position = new Vec2(50, 50)
            this.shouldMaterialMove = true;
            this.testMaterial.visible = true;

        }


        if(this.shouldMaterialMove) {
            let playerPos = this.player.position;
            let materialPos = this.testMaterial.position
            let dirToPlayer = materialPos.dirTo(playerPos);
            this.testMaterial._velocity = dirToPlayer;
            let dist = materialPos.distanceSqTo(playerPos);
            let speedSq = Math.pow(1000, 2);

            if(Math.abs(materialPos.x - playerPos.x) < (this.player.size.x / 4)) { 
                this.shouldMaterialMove = false; 
                this.testMaterial._velocity.x = 0;
                this.testMaterial.position.x = this.player.position.x;

            } 
            if(Math.abs(materialPos.y - playerPos.y) < (this.player.size.y / 4) ) { 
                this.shouldMaterialMove = false; 
                this.testMaterial._velocity.y = 0;
                this.testMaterial.position.y = this.player.position.y;
            } 

            if(!this.shouldMaterialMove) {
                this.testMaterial.visible = false;
                this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_UPPER_COUNT)
            }

            this.testMaterial._velocity.normalize();
            this.testMaterial._velocity.mult(new Vec2(speedSq / dist, speedSq / dist));
            this.testMaterial.move(this.testMaterial._velocity.scaled(deltaT));
        }

        if(Input.isKeyJustPressed("k")){
            for(let enemy of this.enemyList){
                let enemyController = <EnemyController>enemy._ai;
                enemyController.damage(50);
            }
        }

        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            switch (event.type) {
                case InGame_Events.PLAYER_ENEMY_COLLISION:
                    

            
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
        this.receiver.subscribe([
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DIED
        ]);
    }

    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>, scale: number): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x, tilePos.y);
        enemy.scale.set(scale, scale);
        let collisionShape = enemy.size;
        // This has to be touched
        // this.inRelativeCoordinates(this.collisionShape.center), this.collisionShape.halfSize.scaled(this.scene.getViewScale())
        enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2((collisionShape.x/2) * scale, (collisionShape.y/2 - collisionShape.y/3) * scale)));
        
        enemy.colliderOffset.set(0,(collisionShape.y/3) * scale);
        // play with this // maybe add a condition for each enemy
        
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemies");
        enemy.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
        enemy.setTrigger("projectiles", InGame_Events.PROJECTILE_HIT_ENEMY, null)

        this.enemyList.push(enemy);
    }



}