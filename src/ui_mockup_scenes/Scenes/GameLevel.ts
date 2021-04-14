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
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import { UIEvents, UILayers, ButtonNames } from "../Utils/Enums";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import Game from "../../Wolfie2D/Loop/Game";

export default class GameLevel extends Scene {
    center: Vec2 = new Vec2(960,540); //we need to figure out a way to specify this from options
    defaultFont: string = 'Round';
    pauseScreenToggle: boolean = true; 

    //initialize layers 
    primary: Layer; 
    background: Layer; 
    inGameUILayer: InGameUILayer;
    cursorLayer: Layer; 
    cursor2Layer: Layer; 
    pauseScreenLayer: PauseScreenLayer; 

    //initialize sprites
    // cursor: Sprite;
    // cursor2: Sprite;
    reticle: Sprite;
    loadScene(): void {
        this.load.image("temp_cursor", "assets/misc/cursor.png");
        this.load.image("reticle", "assets/misc/reticle.png");
        this.load.image("temp_button", "assets/ui_art/button.png");
        this.load.image("cursor_clicked", "assets/misc/cursor_clicked.png")
    }

    startScene(): void {
        
        this.initializeCursor();


        this.receiver.subscribe(GameEventType.MOUSE_MOVE);
        this.receiver.subscribe(GameEventType.MOUSE_DOWN);
        this.receiver.subscribe(GameEventType.MOUSE_UP);
        this.receiver.subscribe(GameEventType.KEY_DOWN);

    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        this.updateCursorMovement();
        
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

            
            if (event.type === GameEventType.MOUSE_MOVE) {
                this.reticle.visible = true;
                // this.cursor.visible = true;
                this.receiver.unsubscribe(GameEventType.MOUSE_MOVE);
            }

            if(event.type === GameEventType.MOUSE_DOWN) {

                // this.cursor.visible = false;
                // this.cursor2.visible = true;
            }
            
            if(event.type === GameEventType.MOUSE_UP) {
                // this.cursor.visible = true;
                // this.cursor2.visible = false;
            }
            

        }



   
    }

    initializeCursor(): void { 
        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.reticle = this.add.sprite("reticle", UILayers.CURSOR);
        this.reticle.scale = new Vec2(0.8, 0.8);
        // this.cursor.visible = false;
        // this.cursor = this.add.sprite("temp_cursor", UILayers.CURSOR);
        
        // this.cursor.scale = new Vec2(0.8, 0.8)
        // this.cursor.visible = false;

        
        // this.cursor2 = this.add.sprite("cursor_clicked", UILayers.CURSOR);
        // this.cursor2.scale = new Vec2(0.8, 0.8)
        // this.cursor2.visible = false;


    }



    updateCursorMovement(): void {
        let mousePos = Input.getMousePosition();
        this.reticle.position.set(mousePos.x, mousePos.y);
        // this.cursor.position.set(mousePos.x, mousePos.y);
        // this.cursor2.position.set(mousePos.x, mousePos.y);
    }


}