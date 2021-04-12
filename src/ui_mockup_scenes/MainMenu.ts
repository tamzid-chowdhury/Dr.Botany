import QuadTree from "../Wolfie2D/DataTypes/QuadTree";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import UIElement from "../Wolfie2D/Nodes/UIElement";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import { UIEvents, UILayers, ButtonNames, WindowEvents } from "./Utils/Enums";
import * as Tweens from "./Utils/Tweens";
import * as Palette from "./Utils/Colors";
import UILayer from "../Wolfie2D/Scene/Layers/UILayer";
import { MainMenuLayer } from "./Layers/MainMenuLayer";
import { BackgroundLayer } from "./Layers/BackgroundLayer";
import { ControlsLayer } from "./Layers/ControlsLayer";
import { HelpLayer } from "./Layers/HelpLayer";
import { LevelSelectLayer } from "./Layers/LevelSelectLayer";
import { OptionsLayer } from "./Layers/OptionsLayer";
import MathUtils from "../Wolfie2D/Utils/MathUtils";
import { GameEventType } from "../Wolfie2D/Events/GameEventType";

export default class MainMenu extends Scene {
    mainMenuLayer: MainMenuLayer;
    backgroundLayer: BackgroundLayer;
    controlsLayer: ControlsLayer;
    helpLayer: HelpLayer;
    levelSelectLayer: LevelSelectLayer;
    optionsLayer: OptionsLayer;
    cursorLayer: Layer;
    private dropShadow: UIElement;
    cursor: Sprite;
    cursor2: AnimatedSprite;

    center: Vec2 = this.viewport.getCenter();
    zoomLevel: number;
    scrollSpeed: number = 100;
    viewPortWidth: number = this.viewport.getHalfSize().x * 2;



    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
        this.load.image("temp_cursor", "assets/cursor.png");
        this.load.spritesheet("cursor_clicked", "assets/spritesheets/cursor_click.json");
    }

    setDropShadow(pos: Vec2) {
        this.dropShadow.visible = true;
        this.dropShadow.position.set(pos.x, pos.y);
    }

    setDetectDocumentClick(toggle: boolean): void {
        
        if (toggle) document.onclick = () => { this.emitter.fireEvent(UIEvents.TRANSITION_SPLASH_SCREEN); }
        else document.onclick = () => { };
    }

    startScene(): void {
        window.onresize = (e: UIEvent) => {this.emitter.fireEvent(WindowEvents.RESIZED, {eventObject: e})}
        this.backgroundLayer = new BackgroundLayer(this, this.center, this.viewport.getHalfSize().y / 10);
        this.mainMenuLayer = new MainMenuLayer(this, this.center);
        this.controlsLayer = new ControlsLayer(this, this.center);
        this.helpLayer = new HelpLayer(this, this.center);
        this.levelSelectLayer = new LevelSelectLayer(this, this.center);
        this.optionsLayer = new OptionsLayer(this, this.center);

        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.cursor = this.add.sprite("temp_cursor", UILayers.CURSOR);
        
        let mousePos = Input.getMousePosition();
        this.cursor.scale = new Vec2(0.8, 0.8)
        // this.cursor.rotation = 3.14
        this.cursor.visible = false;
        
        this.backgroundLayer.playSplashScreen();
        this.setDetectDocumentClick(true);


        // Subscribe to all events once we nail down the exact events needed we could probably replace this 
        // loop with this.receiver.subscribe(...) calls
        for (let events in UIEvents) {
            let event: UIEvents = UIEvents[events as keyof typeof UIEvents];
            this.receiver.subscribe(event);
        }
        this.receiver.subscribe(GameEventType.MOUSE_MOVE);
        this.receiver.subscribe(WindowEvents.RESIZED);
        


        // this.receiver.subscribe(UIEvents.PLAY_GAME);
        // this.receiver.subscribe(UIEvents.CONTROLS);
        // this.receiver.subscribe(UIEvents.HIDE_LAYER);
        // this.receiver.subscribe(UIEvents.ABOUT);
        // this.receiver.subscribe(UIEvents.MENU)
        // this.receiver.subscribe(UIEvents.TRANSITION_SPLASH_SCREEN)
        // this.receiver.subscribe(UIEvents.SHOW_MAIN_MENU)

    }


    setVisibleLayer(layerName: string): void {
        this.uiLayers.forEach((key: string) => {
            // don't want to hide the background cause it has the logo, and putting it on a reg. layer breaks tween
            if (key !== layerName && key !== UILayers.BACKGROUND && key !== UILayers.CURSOR) {
                this.uiLayers.get(key).setHidden(true);
            }
            else if (key === layerName) {
                this.uiLayers.get(key).setHidden(false);
            }
        });

    }

    updateScene(deltaT: number) {
        let mousePos = Input.getMousePosition();
        this.cursor.position.set(mousePos.x, mousePos.y);
        
        // idea for scrolling:
        // make 2 copies of the bg image, line them up on after the other
        // scroll both of them
        // after one of the images is fully out of view, reset its position
        // or if joe fiex webgl, this probably is easier to do with a shader

        // another possibility: write the shader in a webgl environment and make a 
        // gif out of it

        this.backgroundLayer.bg.position.x += this.scrollSpeed * deltaT;
        this.backgroundLayer.bgCopy.position.x += this.scrollSpeed * deltaT;
        if(this.backgroundLayer.bg.position.x > this.backgroundLayer.bg.size.x) {
            this.backgroundLayer.bg.position.x = -this.backgroundLayer.bg.size.x/2;

        }

        if(this.backgroundLayer.bgCopy.position.x > this.backgroundLayer.bg.size.x) {
            this.backgroundLayer.bgCopy.position.x = -this.backgroundLayer.bg.size.x/2;

        }
 
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            // initially hide the mouse until user input, cursor isnt seen in upper corner 
            if (event.type === GameEventType.MOUSE_MOVE) {
                this.cursor.visible = true;
                this.receiver.unsubscribe(GameEventType.MOUSE_MOVE);
            }

            if(event.type === WindowEvents.RESIZED) {
                // should reposition ui elements
            }

            if (event.type === UIEvents.CLICKED_START) {
                console.log('start')
                // this.sceneManager.changeScene(LevelZero, {});
            }

            if (event.type === UIEvents.CLICKED_LEVEL_SELECT) {
                this.setVisibleLayer(UILayers.LEVEL_SELECT)
                this.levelSelectLayer.back.tweens.play('slideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_CONTROLS) {
                this.setVisibleLayer(UILayers.CONTROLS)
                this.controlsLayer.back.tweens.play('slideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_OPTIONS) {
                this.setVisibleLayer(UILayers.OPTIONS)
                this.optionsLayer.back.tweens.play('slideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_HELP) {
                this.setVisibleLayer(UILayers.HELP)
                this.helpLayer.back.tweens.play('slideXFadeIn')

            }

            if (event.type == UIEvents.SHOW_MAIN_MENU) {
                this.setVisibleLayer(UILayers.MAIN_MENU)
            }

            // distinguishes between the first time the main menu is shown, button tweens wont play after
            if (event.type == UIEvents.FIRST_RENDER) {
                this.setVisibleLayer(UILayers.MAIN_MENU)

                for (let button of this.mainMenuLayer.menuButtons) {
                    button.tweens.play('slideXFadeIn')
                }
            }

            if (event.type === UIEvents.TRANSITION_SPLASH_SCREEN) {
                this.setDetectDocumentClick(false);
                this.backgroundLayer.startText.tweens.play('fadeOut')
                this.backgroundLayer.logo.tweens.play('slideUpShrink');

            }
        }
    }
}