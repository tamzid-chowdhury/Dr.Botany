import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import { UIEvents, UILayers, WindowEvents } from "./Utils/Enums";
import { MainMenuLayer } from "./Layers/MainMenu/MainMenuLayer";
import { BackgroundLayer } from "./Layers/MainMenu/BackgroundLayer";
import { ControlsLayer } from "./Layers/MainMenu/ControlsLayer";
import { HelpLayer } from "./Layers/MainMenu/HelpLayer";
import { LevelSelectLayer } from "./Layers/MainMenu/LevelSelectLayer";
import { SpringLevelLayer } from "./Layers/MainMenu/SpringLevelLayer";
import { SummerLevelLayer } from "./Layers/MainMenu/SummerLevelLayer";
import { FallLevelLayer } from "./Layers/MainMenu/FallLevelLayer";
import { WinterLevelLayer } from "./Layers/MainMenu/WinterLevelLayer";
import { OptionsLayer } from "./Layers/MainMenu/OptionsLayer";
import { GameEventType } from "../Wolfie2D/Events/GameEventType";
import LevelZero from "./Scenes/LevelZero";
import GameButton from "./Classes/GameButton";
import BackButton from "./Classes/BackButton";
import InGameUI from "./Layers/InGameUI/InGameUILayer";

export default class MainMenu extends Scene {
    mainMenuLayer: MainMenuLayer;
    backgroundLayer: BackgroundLayer;
    controlsLayer: ControlsLayer;
    helpLayer: HelpLayer;
    levelSelectLayer: LevelSelectLayer;
    springLevelLayer: SpringLevelLayer;
    summerLevelLayer: SummerLevelLayer;
    fallLevelLayer: FallLevelLayer;
    winterLevelLayer: WinterLevelLayer;
    optionsLayer: OptionsLayer;
    cursorLayer: Layer;
    cursorLayer2: Layer;

    cursor: Sprite;
    cursor2: Sprite;

    center: Vec2 = this.viewport.getCenter();
    zoomLevel: number;
    scrollSpeed: number = 100;
    defaultFont: string = 'Round';
    viewPortWidth: number = this.viewport.getHalfSize().x * 2;

    backButton: BackButton;
    selectLevelBack: GameButton;



    loadScene(): void {
        this.load.image("logo", "assets/misc/logo.png");
        this.load.image("background", "assets/misc/canvas.png");
        this.load.image("temp_cursor", "assets/misc/cursor.png");
        this.load.image("temp_button", "assets/ui_art/button.png");
        this.load.image("cursor_clicked", "assets/misc/cursor_clicked.png");
        this.load.image("spring", "assets/LevelSelectionButtons/spring.png");
        this.load.image("summer", "assets/LevelSelectionButtons/summer.png");
        this.load.image("autumn", "assets/LevelSelectionButtons/autumn.png");
        this.load.image("winter", "assets/LevelSelectionButtons/winter.png");
        this.load.audio("temp_music", "assets/music/temp.mp3");
        this.load.audio("button", "assets/sfx/button_sfx.wav");
    }

    unloadScene(): void {
        this.load.keepAudio("button");
    }

    setDetectDocumentClick(toggle: boolean): void {
        
        if (toggle) document.onclick = () => { this.emitter.fireEvent(UIEvents.TRANSITION_SPLASH_SCREEN); }
        else document.onclick = () => { };
    }


    startScene(): void {
        // this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key : "temp_music", loop: true, holdReference: true});
        window.onresize = (e: UIEvent) => {this.emitter.fireEvent(WindowEvents.RESIZED, {eventObject: e})};
        this.backgroundLayer = new BackgroundLayer(this, this.center, this.viewport.getHalfSize().y / 10, this.defaultFont);
        this.mainMenuLayer = new MainMenuLayer(this, this.center, this.defaultFont);
        this.controlsLayer = new ControlsLayer(this, this.center, this.defaultFont);
        this.helpLayer = new HelpLayer(this, this.center, this.defaultFont);
        this.levelSelectLayer = new LevelSelectLayer(this, this.center, this.defaultFont);
        // This is all levels layers
        this.springLevelLayer = new SpringLevelLayer(this, this.center, this.defaultFont);
        this.summerLevelLayer = new SummerLevelLayer(this, this.center, this.defaultFont);
        this.fallLevelLayer = new FallLevelLayer(this, this.center, this.defaultFont);
        this.winterLevelLayer = new WinterLevelLayer(this, this.center, this.defaultFont);

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
        

        this.backButton = new BackButton(this);
        // this.backButton = this.initBackButton();

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
        let mousePos = Input.getGlobalMousePosition();
        this.cursor.position.set(mousePos.x, mousePos.y);
        this.cursor2.position.set(mousePos.x, mousePos.y);
        
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
                this.backgroundLayer.initLogo();

                this.backButton.reposition(new Vec2(window.innerWidth / 2, window.innerHeight / 2))
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
                // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "temp_music"});
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                let sceneOptions = {
                    physics: {
                        groupNames: ["ground", "player", "enemies", "materials", "projectiles", "deposits"],
                        collisions:
                        [
                            /*
                                Init the next scene with physics collisions:

                                            ground  player  enemy   materials   equipment
                                ground        No       --      --     --            --
                                player        Yes      No      --     --            --
                                enemy         Yes      No      No     --            No
                                materials     Yes       No      No     No           No
                                equipment     Yes       No      No     No           No

                                Each layer becomes a number. In this case, 4 bits matter for each

                                ground: self - 0001, collisions - 0110
                                player: self - 0010, collisions - 1001
                                enemy:  self - 0100, collisions - 0001
                                coin:   self - 1000, collisions - 0010
                            */
                            // [0, 1, 1, 1, 1],
                            // [1, 0, 0, 0, 0],
                            // [1, 0, 0, 0, 0],
                            // [1, 0, 0, 0, 0],
                            // [1, 0, 0, 0, 0]

                            // TODO: figure out if commented out matrix is correct or not for materials/equipment
                            [0, 1, 1, 0, 1, 0],
                            [1, 0, 0, 1, 0, 0],
                            [1, 0, 1, 0, 0, 0],
                            [0, 1, 0, 0, 0, 0],
                            [1, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0]
                        ]
                    }
                }
                this.sceneManager.changeToScene(LevelZero, {}, sceneOptions);
            }

            if (event.type === UIEvents.CLICKED_LEVEL_SELECT) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});

                this.setVisibleLayer(UILayers.LEVEL_SELECT)
                this.levelSelectLayer.enbleButtons();
                // these three methods should go away as we assign each levels to buttons
                this.summerLevelLayer.disableButtons();
                this.fallLevelLayer.disableButtons();
                this.winterLevelLayer.disableButtons();
                this.backButton.label.active = true;
                this.backButton.label.visible = true;
                this.backButton.sprite.visible = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
                
            }
            if (event.type === UIEvents.CLICKED_SPRING) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.SPRING_LEVELS);
                this.springLevelLayer.enbleButtons();
                this.levelSelectLayer.disableButtons();

                this.backButton.label.active = false;
                this.backButton.label.visible = false;
                this.backButton.sprite.visible = false;
            }

            if (event.type === UIEvents.CLICKED_SUMMER) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.SUMMER_LEVELS);
                this.summerLevelLayer.enbleButtons();
                this.levelSelectLayer.disableButtons();
                this.backButton.label.active = false;
                this.backButton.label.visible = false;
                this.backButton.sprite.visible = false;
            }

            if (event.type === UIEvents.CLICKED_FALL) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.FALL_LEVELS);
                this.fallLevelLayer.enbleButtons();
                this.levelSelectLayer.disableButtons();
                
                this.backButton.label.active = false;
                this.backButton.label.visible = false;
                this.backButton.sprite.visible = false;
            }

            if (event.type === UIEvents.CLICKED_WINTER) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.WINTER_LEVELS);
                this.winterLevelLayer.enbleButtons();
                this.levelSelectLayer.disableButtons();
                
                this.backButton.label.active = false;
                this.backButton.label.visible = false;
                this.backButton.sprite.visible = false;
            }

            if (event.type === UIEvents.CLICKED_CONTROLS) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.CONTROLS)
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_OPTIONS) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.OPTIONS)
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type === UIEvents.CLICKED_HELP) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "button", loop: false, holdReference: true});
                this.setVisibleLayer(UILayers.HELP)
                this.backButton.label.active = true;
                this.backButton.label.tweens.play('slideXFadeIn')
                this.backButton.sprite.tweens.play('spriteSlideXFadeIn')
            }

            if (event.type == UIEvents.SHOW_MAIN_MENU) {
                this.setVisibleLayer(UILayers.MAIN_MENU);
                this.levelSelectLayer.disableButtons();
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
                this.backgroundLayer.startText.tweens.play('fadeOut');
                this.backgroundLayer.logo.tweens.play('slideUpShrink');

            }
        }
    }
}