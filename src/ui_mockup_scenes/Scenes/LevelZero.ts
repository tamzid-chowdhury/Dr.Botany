import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import InGameUILayer from "../Layers/InGameUI/InGameUILayer"
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import { UIEvents, UILayers, ButtonNames, InGame_Events } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";
import EnemyController from "../Enemies/EnemyController";
import PauseScreenLayer from "../Layers/PauseScreenLayer";

export default class LevelZero extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    time: number;
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_zero", "assets/tilemaps/level_zero/tiled_level_zero.json");
        this.load.image("shovel", "assets/shovel.png")
        this.load.spritesheet("temp_enemy", "assets/enemies/temp_enemy.json")
        this.load.spritesheet("orange_mushroom", "assets/enemies/orange_mushroom.json" )
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
        super.initViewport(this.collidables.size);
        super.initGameUI(this.viewport.getHalfSize());
        super.initReticle();
        this.viewport.follow(this.player);

        // this.addEnemy("temp_enemy", new Vec2(350, 350), {  health : 5, player: this.player }, 1);
        this.addEnemy("orange_mushroom", new Vec2(300, 300), {speed : 30, player: this.player}, 0.5)
        // enemies options : speed, health, attackRange (this could probably be replaced with enemy types),
        
        this.subscribeToEvents();
    
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        // this.shadow.position = this.player.position.clone();
        // this.shadow.position.y += this.shadowOffset.y;

        // this.defaultEquip.position = this.player.position.clone();

        // let mousePos = Input.getGlobalMousePosition()
        // this.lookDirection = this.defaultEquip.position.dirTo(mousePos);

        // if(mousePos.x > this.defaultEquip.position.x) {
        //     this.defaultEquip.rotation = Vec2.UP.angleToCCW(this.lookDirection);

        //     this.defaultEquip.position.add(new Vec2(2,-4));
		// 	this.defaultEquip.invertX = false;
        //     this.defaultEquip.rotation += 3.14 / 2;

		// }
		// else {
        //     this.defaultEquip.rotation = -Vec2.DOWN.angleToCCW(this.lookDirection);
        //     this.defaultEquip.rotation -= 3.14 / 2;
        //     this.defaultEquip.position.add(new Vec2(-2,-4));
		// 	this.defaultEquip.invertX = true;

		// }

        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            switch (event.type) {
                case InGame_Events.PLAYER_ENEMY_COLLISION:
                    console.log("Enemy Hit Player");

            
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

        // This has to be touched
        enemy.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
        enemy.colliderOffset.set(0,10);
        // play with this // maybe add a condition for each enemy
        
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemy");
        enemy.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
    }



}