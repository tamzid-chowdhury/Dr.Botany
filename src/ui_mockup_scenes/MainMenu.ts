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
import LevelZero from "./Scenes/LevelZero";
import GameButton from "./Classes/GameButton";
import Game from "../Wolfie2D/Loop/Game";

export default class MainMenu extends Scene {
    mainMenuLayer: MainMenuLayer;
    backgroundLayer: BackgroundLayer;
    controlsLayer: ControlsLayer;
    helpLayer: HelpLayer;
    levelSelectLayer: LevelSelectLayer;
    optionsLayer: OptionsLayer;
    cursorLayer: Layer;
    cursorLayer2: Layer;
    private dropShadow: UIElement;
    cursor: Sprite;
    cursor2: Sprite;

    center: Vec2 = this.viewport.getCenter();
    zoomLevel: number;
    scrollSpeed: number = 100;
    defaultFont: string = 'Round';
    viewPortWidth: number = this.viewport.getHalfSize().x * 2;

    backButton: GameButton;



    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
        this.load.image("temp_cursor", "assets/cursor.png");
        this.load.image("temp_button", "assets/temp_button.png");
        this.load.image("cursor_clicked", "assets/cursor_clicked.png")
        this.load.image("spring", "assets/LevelSelectionButtons/spring.png")
    }

    setDropShadow(pos: Vec2) {
        this.dropShadow.visible = true;
        this.dropShadow.position.set(pos.x, pos.y);
    }

    setDetectDocumentClick(toggle: boolean): void {
        
        if (toggle) document.onclick = () => { this.emitter.fireEvent(UIEvents.TRANSITION_SPLASH_SCREEN); }
        else document.onclick = () => { };
    }

    initBackButton(): GameButton {
        let center = this.center.clone();
		let xOffset = 30
		let startX = center.x - xOffset;
		let startY = center.y + 300;
		let endX = center.x;
		let animationDelay = 0;
        let backSprite = this.add.sprite("temp_button", UILayers.BACKGROUND);
        backSprite.position = new Vec2(startX, startY)
        backSprite.scale = new Vec2(3,3);
        backSprite.alpha = 0;

        let backLabel = <Label>this.add.uiElement(UIElementType.LABEL, UILayers.BACKGROUND, { position: new Vec2(startX, startY), text: "Back", size : 24});
		backLabel.size.set(200, 100);
		backLabel.borderWidth = 0;
		backLabel.borderRadius = 0;
		backLabel.font = this.defaultFont;
        backLabel.backgroundColor = Palette.transparent();
        backLabel.backgroundColor.a = 0;
        backLabel.textColor.a = 0;
        backLabel.borderColor = Palette.transparent();
		backLabel.onClickEventId = UIEvents.SHOW_MAIN_MENU;
		
		
		backLabel.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
		backLabel.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		backLabel.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));

        backSprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
		backSprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		backSprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
        backSprite.tweens.add('scaleIn', Tweens.scaleIn(backSprite.scale, new Vec2(3.8,3.8), 0, 100));
        backSprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(3.8,3.8), backSprite.scale, 0, 100));

        backLabel.onFirstEnter = () => {
			backLabel.tweens.play('slideUpLeft');
            backSprite.tweens.play('scaleIn');
            backSprite.tweens.play('slideUpLeft');
		}
		backLabel.onLeave = () => {
			backSprite.tweens.play('slideDownRight');
			backLabel.tweens.play('slideDownRight');
            backSprite.tweens.play('scaleOut');
		}

        return new GameButton(backSprite, backLabel);
    }

    startScene(): void {
        window.onresize = (e: UIEvent) => {this.emitter.fireEvent(WindowEvents.RESIZED, {eventObject: e})}
        this.backgroundLayer = new BackgroundLayer(this, this.center, this.viewport.getHalfSize().y / 10, this.defaultFont);
        this.mainMenuLayer = new MainMenuLayer(this, this.center, this.defaultFont);
        this.controlsLayer = new ControlsLayer(this, this.center, this.defaultFont);
        this.helpLayer = new HelpLayer(this, this.center, this.defaultFont);
        this.levelSelectLayer = new LevelSelectLayer(this, this.center, this.defaultFont);
        this.optionsLayer = new OptionsLayer(this, this.center, this.defaultFont);

        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.cursor = this.add.sprite("temp_cursor", UILayers.CURSOR);
        
        let mousePos = Input.getMousePosition();
        this.cursor.scale = new Vec2(0.8, 0.8)
        // this.cursor.rotation = 3.14
        this.cursor.visible = false;

        
        this.cursor2 = this.add.sprite("cursor_clicked", UILayers.CURSOR);
        this.cursor2.scale = new Vec2(0.8, 0.8)
        this.cursor2.visible = false;
        
        this.backButton = this.initBackButton();

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
        this.receiver.subscribe(GameEventType.MOUSE_DOWN);
        this.receiver.subscribe(GameEventType.MOUSE_UP);
        



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
        this.cursor2.position.set(mousePos.x, mousePos.y);
        
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

            if(event.type === GameEventType.MOUSE_DOWN) {
                this.cursor.visible = false;
                this.cursor2.visible = true;
            }
            if(event.type === GameEventType.MOUSE_UP) {
                this.cursor.visible = true;
                this.cursor2.visible = false;
            }

            if (event.type === UIEvents.CLICKED_START) {
                this.sceneManager.changeToScene(LevelZero, {});
            }

            if (event.type === UIEvents.CLICKED_LEVEL_SELECT) {
                this.setVisibleLayer(UILayers.LEVEL_SELECT)
                for (let button of this.levelSelectLayer.levelSelectButton) {
                    button.label.tweens.play('slideXFadeIn')
                    button.sprite.tweens.play('spriteSlideXFadeIn')
                }
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_CONTROLS) {
                this.setVisibleLayer(UILayers.CONTROLS)
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_OPTIONS) {
                this.setVisibleLayer(UILayers.OPTIONS)
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_HELP) {
                this.setVisibleLayer(UILayers.HELP)
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type == UIEvents.SHOW_MAIN_MENU) {
                this.setVisibleLayer(UILayers.MAIN_MENU);
                this.backButton.label.active = false;
                this.backButton.label.textColor.a = 0;
                this.backButton.sprite.alpha = 0;
            }

            // distinguishes between the first time the main menu is shown, button tweens wont play after
            if (event.type == UIEvents.FIRST_RENDER) {
                this.setVisibleLayer(UILayers.MAIN_MENU)

                for (let button of this.mainMenuLayer.menuButtons) {
                    button.label.tweens.play('slideXFadeIn')
                    button.sprite.tweens.play('spriteSlideXFadeIn')
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