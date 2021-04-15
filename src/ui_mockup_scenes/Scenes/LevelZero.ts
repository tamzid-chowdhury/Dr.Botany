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
import { UIEvents, UILayers, ButtonNames } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";
import PauseScreenLayer from "../Layers/PauseScreenLayer";

export default class LevelZero extends GameLevel {
    private player: Sprite;
    private shadow: Sprite;
    private defaultEquip: Sprite;
    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    shadowOffset: Vec2 = new Vec2(0, 4);
    time: number;
    loadScene(): void {
        super.loadScene();
        this.load.image("player", "assets/dr_botany_wip.png");
        this.load.image("shadow", "assets/shadow_sprite.png");
        this.load.image("shovel", "assets/shovel.png");
        this.load.tilemap("level_zero", "assets/tilemaps/level_zero/tiled_level_zero.json");

        this.load.image("itemslot1", "assets/ui_art/itemslot1.png")
        this.load.image("itemslot2", "assets/ui_art/itemslot2.png")
        this.load.image("itemslot3", "assets/ui_art/itemslot3.png")

        this.load.image("weaponslot1", "assets/ui_art/weaponslot1.png")
        this.load.image("weaponslot2", "assets/ui_art/weaponslot2.png")

        this.load.image("shovel", "assets/shovel.png")
        this.load.spritesheet("temp_enemy", "assets/enemies/temp_enemy.json")
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
        // this.collidables = <OrthogonalTilemap>tilemapLayers[4].getItems()[0];
        this.tilemapSize = this.collidables.size;
        let origin = this.viewport.getOrigin();
        this.viewport.setBounds(origin.x, origin.y, this.tilemapSize.x, this.tilemapSize.y+16);
        // NOTE: Viewport can only see 1/4 of full 1920x1080p canvas
        this.viewport.setSize(480, 270);

        this.addLayer("primary", 10);
        this.addLayer("secondary", 9);
        this.initPlayer();


        this.viewport.follow(this.player);

        super.initGameUI(this.viewport.getHalfSize());
        super.initReticle();
        this.addEnemy("temp_enemy", new Vec2(300, 300), { mushroom: true, health : 5, player: this.player }, 2);
        
        
        
        
        
    
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        this.shadow.position = this.player.position.clone();
        this.shadow.position.y += this.shadowOffset.y;

        this.defaultEquip.position = this.player.position.clone();

        let mousePos = Input.getGlobalMousePosition()
        this.lookDirection = this.defaultEquip.position.dirTo(mousePos);

        if(mousePos.x > this.defaultEquip.position.x) {
            this.defaultEquip.rotation = Vec2.UP.angleToCCW(this.lookDirection);

            this.defaultEquip.position.add(new Vec2(2,-4));
			this.defaultEquip.invertX = false;
            this.defaultEquip.rotation += 3.14 / 2;

		}
		else {
            this.defaultEquip.rotation = -Vec2.DOWN.angleToCCW(this.lookDirection);
            this.defaultEquip.rotation -= 3.14 / 2;
            this.defaultEquip.position.add(new Vec2(-2,-4));
			this.defaultEquip.invertX = true;

		}

        // We want to randomly select the position, and time and maybe some counter ( max enemies in the map ) currently spawning every 15 seconds
        if (Date.now() - this.time > 15000) {
            console.log("15 seconds passed");
            // addEnemy - params:(SpriteKey, Position, aiOptions, scale)
            this.addEnemy("temp_enemy", new Vec2(300, 300), { mushroom: true, health : 5, player: this.player }, 2);
            this.time = Date.now();
        }

    }
    

    initPlayer(): void {
        // Create the inventory
        // let inventory = new InventoryManager(this, 2, "inventorySlot", new Vec2(16, 16), 4);
        // let startingWeapon = this.createWeapon("knife");
        // inventory.addItem(startingWeapon);

        // Create the player
        // this.player = this.add.animatedSprite("player", "primary");
        this.shadow = this.add.sprite("shadow", "secondary");
        this.shadow.position.set(this.tilemapSize.x/2,this.tilemapSize.y/2+ this.shadowOffset.y);
        this.shadow.scale = new Vec2(0.7, 0.7);

        this.defaultEquip = this.add.sprite("shovel", "secondary");
        this.defaultEquip.position.set(this.tilemapSize.x/2,this.tilemapSize.y/2);
        this.defaultEquip.rotation = 3.14 / 4;

        this.player = this.add.sprite("player", "primary");
        this.player.scale = new Vec2(1.5, 1.5);
        this.player.position.set(this.tilemapSize.x/2,this.tilemapSize.y/2);

        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 2)));
        this.player.colliderOffset.set(0, 10);
        this.player.addAI(PlayerController, {tilemap: "Main", speed: 150,});

        // Add triggers on colliding with coins or coinBlocks
        this.player.setGroup("player");
    }


}