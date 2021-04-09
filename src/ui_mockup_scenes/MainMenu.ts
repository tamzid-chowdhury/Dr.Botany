import QuadTree from "../Wolfie2D/DataTypes/QuadTree";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../Wolfie2D/Nodes/UIElement";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";
import { UIEvents, ButtonNames } from "./DrBotanyEnums";
import * as Tweens from "./DrBotanyTweens";

export default class MainMenu extends Scene {
    private logo: Sprite;
    private bg: Sprite;
    private startText: Label;
    private mainMenuLayer: Layer;
    private splashScreenLayer: Layer;
    private backgroundLayer: Layer;
    private controlsLayer: Layer;

    private logoColor = new Color(204, 152, 114);
    // private highlight = new Color(168, 201, 153);
    private highlight = new Color(76, 175, 80)
    private dropColor = new Color(80, 82, 80);
    private darkHighlight = new Color(140, 100, 81);
    // private darkHighlight = new Color(45, 46, 45);
    private dropShadow: UIElement;

    private menuButtons: Array<UIElement> = [];
    center: Vec2;

    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
    }

    setDropShadow(pos: Vec2) {
        this.dropShadow.position.set(pos.x + 5, pos.y + 5);
    }

    initLogo(): void {
        this.logo = this.add.sprite("logo", "backgroundLayer");
        this.logo.position.set(this.center.x, this.center.y - this.viewport.getHalfSize().y / 10);
        let endScale = new Vec2(this.logo.scale.x, this.logo.scale.y)
        this.logo.scale = new Vec2(0, 0);

        this.logo.tweens.add('scaleIn', Tweens.scaleIn(this.logo.scale, endScale));
        this.logo.tweens.add('slideUpShrink', Tweens.slideUpShrink(endScale, this.logo.position.y, this.center.y));
    }

    initBackground(): void {
        this.bg = this.add.sprite("background", "backgroundLayer");
        this.bg.position.set(25, -18);
    }

    initStartText(): void {
        this.startText = <Label>this.add.uiElement(UIElementType.LABEL, "splashScreenLayer", { position: new Vec2(this.center.x, this.center.y + 120), text: "Click to Begin!", size: 64 });
        this.startText.textColor = new Color(0, 0, 0, 0);
        this.startText.font = "PixelSimple";
        this.startText.alpha = 0;

        this.startText.tweens.add('fadeIn', Tweens.fadeIn());
        this.startText.tweens.add('fadeOut', Tweens.fadeOut(this.startText.position.y));
    }

    playSplashScreen(): void {
        this.logo.tweens.play('scaleIn');
        this.startText.tweens.play('fadeIn');
    }

    initDetectDocClick(): void {
        document.onclick = () => { this.emitter.fireEvent(UIEvents.TRANSITION_SPLASH_SCREEN); }
    }

    initMainMenuButtons(): void {
        this.mainMenuLayer.setHidden(true);
        let xOffset = 200
        let startX = this.center.x - xOffset;
        let startY = this.center.y - xOffset;
        let endX = this.center.x;
        let animationDelay = 0;
        // this.dropShadow = this.add.uiElement(UIElementType.LABEL, "mainMenuLayer", {position: new Vec2(startX, startY), text: ''});
        // this.dropShadow.borderWidth = 0;
        // this.dropShadow.size.set(200, 50);
        // this.dropShadow.backgroundColor = this.dropColor;

        for (let name in ButtonNames) {
            let myName: ButtonNames = ButtonNames[name as keyof typeof ButtonNames];
            let label = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenuLayer", { position: new Vec2(startX, startY), text: `${myName}`, size: 24 });
            label.size.set(200, 100);
            label.borderWidth = 0;
            label.borderRadius = 0;
            label.font = "PixelSimple";
            label.backgroundColor = new Color(204, 152, 114);
            label.backgroundColor.a = 0;
            label.textColor.a = 0;
            label.borderColor = Color.TRANSPARENT;
            label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(label.position.x, animationDelay, xOffset));
            label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, label.position.y))
            label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, label.position.y))
            label.tweens.add('highlight', Tweens.changeColor(label.backgroundColor, this.highlight))
            label.tweens.add('unhighlight', Tweens.changeColor(this.highlight, label.backgroundColor))
            label.onFirstEnter = () => {
                label.tweens.play('slideUpLeft');
                label.tweens.play('highlight');
            }
            label.onLeave = () => {
                label.tweens.play('slideDownRight');
                label.tweens.play('unhighlight');
            }
            animationDelay += 30;
            startY += 100;
            this.menuButtons.push(label)
            // label.onClickEventId = "CONTROLS";
            // Need to assign onClickEvent to each button properly
        }

    }

    removeDetectDocClick(): void { document.onclick = () => { } }

    // createControls(center: Vec2): void {

    //     let xOffset = 200
    //     let startX = this.center.x ;
    //     let startY = this.center.y + 300;
    //     let endX = this.center.x;
    //     let animationDelay = 0;
    //     this.mainMenuLayer.setHidden(true);
    //     const text1 = "W - Move Up";
    //     const text2 = "A - Move Left";
    //     const text3 = "S - Move Down";
    //     const text4 = "D - Move Right";
    //     const text5 = "E - Pick up Items";
    //     const text6 = "Q, Mouse Wheel - Equipment Change";
    //     const text7 = "Right Mouse Button - Block";
    //     const text8 = "Left Mouse Button - Attack";
    //     const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y - 200), text: text1 });
    //     const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y - 150), text: text2 });
    //     const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y - 100), text: text3 });
    //     const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y - 50), text: text4 });
    //     const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y), text: text5 });
    //     const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y + 50), text: text6 });
    //     const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y + 100), text: text7 });
    //     const line8 = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(center.x, center.y + 150), text: text8 });

    //     line1.textColor = Color.BLACK;
    //     line1.fontSize = 40;
    //     line1.font = "PixelSimple";
    //     line2.textColor = Color.BLACK;
    //     line2.fontSize = 40;
    //     line2.font = "PixelSimple";
    //     line3.textColor = Color.BLACK;
    //     line3.fontSize = 40;
    //     line3.font = "PixelSimple";
    //     line4.textColor = Color.BLACK;
    //     line4.fontSize = 40;
    //     line4.font = "PixelSimple";
    //     line5.textColor = Color.BLACK;
    //     line5.fontSize = 40;
    //     line5.font = "PixelSimple";
    //     line6.textColor = Color.BLACK;
    //     line6.fontSize = 40;
    //     line6.font = "PixelSimple";
    //     line7.textColor = Color.BLACK;
    //     line7.fontSize = 40;
    //     line7.font = "PixelSimple";
    //     line8.textColor = Color.BLACK;
    //     line8.fontSize = 40;
    //     line8.font = "PixelSimple";

    //     let back = <Label>this.add.uiElement(UIElementType.LABEL, "controlsLayer", { position: new Vec2(startX, startY), text: "Back", size : 24});
    //     back.size.set(150, 80);
    //     back.borderWidth = 0;
    //     back.borderRadius = 0;
    //     back.font = "PixelSimple";
    //     back.backgroundColor = new Color(204, 152, 114);
        
        
    //     back.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(back.position.x, animationDelay, xOffset));
    //     back.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, back.position.y))
    //     back.tweens.add('slideDownRight', Tweens.slideDownRight(endX, back.position.y))
    //     back.tweens.add('highlight', Tweens.changeColor(back.backgroundColor, this.highlight))
    //     back.tweens.add('unhighlight', Tweens.changeColor(this.highlight, back.backgroundColor))
    //     back.onFirstEnter = () => {
    //         back.tweens.play('slideUpLeft');
    //         back.tweens.play('highlight');
    //     }
    //     back.onLeave = () => {
    //         back.tweens.play('slideDownRight');
    //         back.tweens.play('unhighlight');
    //     }
    //     back.onClickEventId = "SHOW_MAIN_MENU"
    // }

    startScene(): void {
        this.initDetectDocClick();
        this.center = this.viewport.getCenter();

        this.backgroundLayer = this.addUILayer("backgroundLayer");
        this.mainMenuLayer = this.addUILayer("mainMenuLayer");
        this.splashScreenLayer = this.addUILayer("splashScreenLayer");
        this.controlsLayer = this.addUILayer("controlsLayer");
        this.controlsLayer.setHidden(true);



        this.initBackground();
        this.initLogo();
        this.initMainMenuButtons();

        this.initStartText();
        this.playSplashScreen();
        
        // Creating Controls scene
        // this.createControls(this.center); 



        this.receiver.subscribe(UIEvents.PLAY_GAME);
        this.receiver.subscribe(UIEvents.CONTROLS);
        this.receiver.subscribe(UIEvents.HIDE_LAYER);
        this.receiver.subscribe(UIEvents.ABOUT);
        this.receiver.subscribe(UIEvents.MENU)
        this.receiver.subscribe(UIEvents.TRANSITION_SPLASH_SCREEN)
        this.receiver.subscribe(UIEvents.HIDE_SPLASH_SCREEN)
        this.receiver.subscribe(UIEvents.SHOW_MAIN_MENU)


    }


    updateScene() {
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();


            if (event.type === UIEvents.PLAY_GAME) {
                // this.sceneManager.changeScene(LevelZero, {});
            }

            if (event.type === UIEvents.CONTROLS) {
                this.controlsLayer.setHidden(false);
                this.mainMenuLayer.setHidden(true);
            }

            if (event.type === UIEvents.ABOUT) {
                // this.about.setHidden(false);
                // this.mainMenu.setHidden(true);
            }

            if (event.type == UIEvents.HIDE_SPLASH_SCREEN) {
                this.splashScreenLayer.setHidden(true);
            }

            if (event.type == UIEvents.SHOW_MAIN_MENU) {
                console.log('showing main menu')
                this.mainMenuLayer.setHidden(false);
                for (let button of this.menuButtons) {
                    button.tweens.play('slideXFadeIn')
                }
                // this.controlsLayer.setHidden(true);  *******************need some control for this / or setHidden every layer to true

                // this.menuButtons[0].tweens.play('slideXFadeIn');
            }

            if (event.type === UIEvents.TRANSITION_SPLASH_SCREEN) {
                this.removeDetectDocClick();
                this.startText.tweens.play('fadeOut')
                this.logo.tweens.play('slideUpShrink');

                // now copy over buttons from  MainMenu.ts
                // have them tween in slightly staggered
                // this.mainMenu.setHidden(false);
                // this.controls.setHidden(true);
                // this.about.setHidden(true);
            }
        }
    }
}