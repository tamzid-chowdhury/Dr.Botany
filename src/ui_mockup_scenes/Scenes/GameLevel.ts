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
import { UIEvents, UILayers, ButtonNames, InGameUILayers, WindowEvents  } from "../Utils/Enums";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import Game from "../../Wolfie2D/Loop/Game";
import EnemyController from "../Enemies/EnemyController"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";


export default class GameLevel extends Scene {
    center: Vec2; //we need to figure out a way to specify this from options
    defaultFont: string = 'Round';

    pauseScreenToggle: boolean = true; 

    //initialize layers 
    primary: Layer; 
    background: Layer; 
    inGameUILayer: InGameUILayer;
    cursorLayer: Layer; 
    pauseScreenLayer: PauseScreenLayer; 

    reticle: Sprite;
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
    }

    startScene(): void {
        this.center = this.viewport.getCenter();
        this.receiver.subscribe(GameEventType.MOUSE_DOWN);
        // this.receiver.subscribe(WindowEvents.RESIZED);
        this.receiver.subscribe(GameEventType.MOUSE_UP);
        this.receiver.subscribe(GameEventType.KEY_DOWN);

        

    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        // update reticle position
        let mousePos = Input.getMousePosition();
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

        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            if(event.type === GameEventType.MOUSE_DOWN) {

            }

            if(event.type === WindowEvents.RESIZED) {
            }

        }
    }

    initInventory(): void {

    }

    initEquipment(): void {

    }

    initGameUI(halfsize: Vec2): void { 
        let viewport = this.viewport;
        let center = halfsize
        this.inGameUILayer = new InGameUILayer(this, center, this.defaultFont, viewport);

    }

    

    initReticle(): void { 
        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.reticle = this.add.sprite("reticle", UILayers.CURSOR);
        this.reticle.scale = new Vec2(0.8, 0.8);

    }


    protected addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>, scale: number): void {
        let enemy = this.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x, tilePos.y);
        enemy.scale.set(scale, scale);
        enemy.addPhysics(new AABB(Vec2.ZERO), new Vec2(50, 50));
        enemy.colliderOffset.set(0,18);
        // play with this // maybe add a condition for each enemy
        
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemy");
        // enemy.setTrigger("player", HW4_Events.PLAYER_HIT_ENEMY, null);
    }

}