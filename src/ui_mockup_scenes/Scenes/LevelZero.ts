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
import InGameUILayer from "../Layers/InGameUILayer"
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
    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    cameraPoint: Label;
    shadowOffset: Vec2 = new Vec2(0, 4);
    loadScene(): void {
        super.loadScene();
        this.load.image("player", "assets/dr_botany_wip.png");
        this.load.image("shadow", "assets/shadow_sprite.png");
        this.load.tilemap("level_zero", "assets/tilemaps/level_zero/tiled_level_zero.json");

        this.load.image("itemslot1", "assets/ui_art/itemslot1.png")
        this.load.image("itemslot2", "assets/ui_art/itemslot2.png")
        this.load.image("itemslot3", "assets/ui_art/itemslot3.png")

        this.load.image("weaponslot1", "assets/ui_art/weaponslot1.png")
        this.load.image("weaponslot2", "assets/ui_art/weaponslot2.png")
        this.load.image("healthbar", "assets/ui_art/health_bar_wip.png")
        this.load.image("shovel", "assets/shovel.png")
    }

    startScene(): void {
        super.startScene()
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
        this.viewport.setBounds(origin.x, origin.y, this.tilemapSize.x, this.tilemapSize.y);
        // NOTE: Viewport can only see 1/4 of full 1920x1080p canvas
        this.viewport.setSize(480, 270);
        this.addLayer("primary", 10);
        this.addLayer("secondary", 9);
        this.initializePlayer();

		// this.cameraPoint = <Label>this.add.uiElement(UIElementType.LABEL, UILayers.CURSOR, { position: new Vec2(this.tilemapSize.x/2,this.tilemapSize.y/2), text: '' });
        // this.cameraPoint.visible = false;

        // this.viewport.follow(this.cameraPoint);
        this.viewport.follow(this.player);
        this.viewport.setSmoothingFactor(10);


        this.initializeGameUI()
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        // let cameraPos = this.player.position.clone();
        // // cameraPos.x += Input.getMousePosition().x/this.viewport.getHalfSize().x;
        // // cameraPos.add(this.player.position);
        this.shadow.position = this.player.position.clone();
        this.shadow.position.y += this.shadowOffset.y
        // this.cameraPoint.position = cameraPos;

    }

    initializePlayer(): void {
        // Create the inventory
        // let inventory = new InventoryManager(this, 2, "inventorySlot", new Vec2(16, 16), 4);
        // let startingWeapon = this.createWeapon("knife");
        // inventory.addItem(startingWeapon);

        // Create the player
        // this.player = this.add.animatedSprite("player", "primary");
        this.shadow = this.add.sprite("shadow", "secondary");
        this.shadow.position.set(this.tilemapSize.x/2,this.tilemapSize.y/2+ this.shadowOffset.y);
        this.shadow.scale = new Vec2(0.7, 0.7);

        this.player = this.add.sprite("player", "primary");
        this.player.scale = new Vec2(1.5, 1.5);
        this.player.position.set(this.tilemapSize.x/2,this.tilemapSize.y/2);

        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 2)));
        this.player.colliderOffset.set(2, 10);
        this.player.addAI(PlayerController, {tilemap: "Main", speed: 100,});

        // Add triggers on colliding with coins or coinBlocks
        this.player.setGroup("player");
    }

    initializeGameUI(): void { 
        let viewport = this.viewport;
        let center = new Vec2(this.tilemapSize.x/2,this.tilemapSize.y/2)


        this.inGameUILayer = new InGameUILayer(this,center,this.defaultFont, viewport);
        // this.pauseScreenLayer = new PauseScreenLayer(this,center,this.defaultFont);
        // console.log(this.pauseScreenLayer)

    }
}