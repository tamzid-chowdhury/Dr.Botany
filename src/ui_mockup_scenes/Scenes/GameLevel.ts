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
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import { UIEvents, UILayers, ButtonNames, InGameUILayers, WindowEvents, InGame_Events } from "../Utils/Enums";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import Game from "../../Wolfie2D/Loop/Game";
import EnemyController from "../Enemies/EnemyController"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";


export default class GameLevel extends Scene {
    center: Vec2; //we need to figure out a way to specify this from options
    defaultFont: string = 'Round';
    screenCenter: Vec2; 
    pauseScreenToggle: boolean = true; 

    //initialize layers 
    primary: Layer; 
    background: Layer; 
    inGameUILayer: InGameUILayer;
    cursorLayer: Layer; 
    pauseScreenLayer: PauseScreenLayer; 

    reticle: Sprite;

    player: Sprite;
    shadow: Sprite;
    defaultEquip: Sprite;
    shadowOffset: Vec2 = new Vec2(0, 4);
    playerLookDirection: Vec2;

    loadScene(): void {
        this.load.image("temp_cursor", "assets/misc/cursor.png");
        this.load.image("reticle", "assets/misc/reticle.png");
        this.load.image("temp_button", "assets/ui_art/button.png");
        this.load.image("ui_square", "assets/ui_art/ui_square.png");
        this.load.image("ui_circle", "assets/ui_art/ui_circle.png");
        this.load.image("cursor_clicked", "assets/misc/cursor_clicked.png")
        this.load.image("healthbar", "assets/ui_art/health_bar_wip.png")
        this.load.image("growthbar", "assets/ui_art/growth_bar_wip.png")
        this.load.image("moodbar", "assets/ui_art/mood_bar_wip.png")

        this.load.image("player", "assets/dr_botany_wip.png");
        this.load.image("shadow", "assets/shadow_sprite.png");
        this.load.image("shovel", "assets/shovel.png");
    }

    startScene(): void {
        this.center = this.viewport.getCenter();
        this.receiver.subscribe(GameEventType.MOUSE_DOWN);
        // this.receiver.subscribe(WindowEvents.RESIZED);
        this.receiver.subscribe(GameEventType.MOUSE_UP);
        this.receiver.subscribe(GameEventType.KEY_DOWN);
        this.receiver.subscribe(InGame_Events.LEVEL_LOADED);
        this.addLayer("primary", 10);
        this.addLayer("secondary", 9);

    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        // update reticle position
        let mousePos = Input.getMousePosition();
        let rotateTo = Input.getGlobalMousePosition();
        this.reticle.position.set(mousePos.x, mousePos.y);
        
        if(Input.isKeyJustPressed("p")){
            if(this.pauseScreenLayer !== undefined) {
                if(this.pauseScreenToggle){
                    for (let button of this.pauseScreenLayer.menuButtons) {
                        //button.label.tweens.play('slideXFadeIn')
                        //button.sprite.tweens.play('spriteSlideXFadeIn')
                        button.label.textColor.a = 1; 
                    }
                    this.pauseScreenToggle = false; 
                }
                else{
                    for (let button of this.pauseScreenLayer.menuButtons) {
                        //button.label.tweens.play('slideXFadeOut')
                        //button.sprite.tweens.play('spriteSlideXFadeOut')
                        button.label.textColor.a = 0; 
                    }
                    this.pauseScreenToggle = true; 
                }
            }
            

        }


        this.shadow.position = this.player.position.clone();
        this.shadow.position.y += this.shadowOffset.y;

        this.defaultEquip.position = this.player.position.clone();

        this.playerLookDirection = this.defaultEquip.position.dirTo(rotateTo);

        if(mousePos.x > this.defaultEquip.position.x) {
            this.defaultEquip.rotation = Vec2.UP.angleToCCW(this.playerLookDirection);

            this.defaultEquip.position.add(new Vec2(2,-4));
			this.defaultEquip.invertX = false;
            this.defaultEquip.rotation += 3.14 / 2;

		}
		else {
            this.defaultEquip.rotation = -Vec2.DOWN.angleToCCW(this.playerLookDirection);
            this.defaultEquip.rotation -= 3.14 / 2;
            this.defaultEquip.position.add(new Vec2(-2,-4));
			this.defaultEquip.invertX = true;

		}
        



        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            if(event.type === GameEventType.MOUSE_DOWN) {

            }

            if(event.type === WindowEvents.RESIZED) {
            }

            if(event.type === InGame_Events.LEVEL_LOADED) {
                this.screenCenter = this.viewport.getHalfSize();
            }

        }
    }

    initPlayer(mapSize: Vec2): void {
        this.shadow = this.add.sprite("shadow", "secondary");
        this.shadow.position.set(mapSize.x/2,mapSize.y/2+ this.shadowOffset.y);
        this.shadow.scale = new Vec2(0.7, 0.7);

        this.defaultEquip = this.add.sprite("shovel", "secondary");
        this.defaultEquip.position.set(mapSize.x/2,mapSize.y/2);
        this.defaultEquip.rotation = 3.14 / 4;

        this.player = this.add.sprite("player", "primary");
        this.player.scale = new Vec2(1.5, 1.5);
        this.player.position.set(mapSize.x/2,mapSize.y/2);

        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 2)));
        this.player.colliderOffset.set(0, 10);
        this.player.addAI(PlayerController, {tilemap: "Main", speed: 150,});

        // Add triggers on colliding with coins or coinBlocks
        this.player.setGroup("player");
    }

    initInventory(): void {

    }

    initEquipment(): void {

    }

    initGameUI(halfsize: Vec2): void { 
        this.inGameUILayer = new InGameUILayer(this, halfsize, this.defaultFont, this.viewport);

    }

    initViewport(mapSize: Vec2): void {
        let origin = this.viewport.getOrigin();
        this.viewport.setBounds(origin.x, origin.y, mapSize.x, mapSize.y+24);
        // NOTE: Viewport can only see 1/4 of full 1920x1080p canvas
        this.viewport.setSize(480, 270);
    }

    initReticle(): void { 
        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.reticle = this.add.sprite("reticle", UILayers.CURSOR);
        this.reticle.scale = new Vec2(0.8, 0.8);

    }
}