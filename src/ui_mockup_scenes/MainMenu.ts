import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import { Scenes, UIEvents, UILayers, WindowEvents } from "./Utils/Enums";
import { MainMenuLayer } from "./Layers/MainMenu/MainMenuLayer";
import { BackgroundLayer } from "./Layers/MainMenu/BackgroundLayer";
import { ControlsLayer } from "./Layers/MainMenu/ControlsLayer";
import { HelpLayer } from "./Layers/MainMenu/HelpLayer";
import { LevelSelectLayer } from "./Layers/MainMenu/LevelSelectLayer";
import { OptionsLayer } from "./Layers/MainMenu/OptionsLayer";
import { GameEventType } from "../Wolfie2D/Events/GameEventType";
import LevelZero from "./Scenes/LevelZero";
import GameButton from "./Classes/GameButton";
import * as Tweens from "./Utils/Tweens"
import { Physics } from "./Utils/PhysicsOptions"
import Level_Fall_one from "./Scenes/Level_Fall_One";
import Level_Winter_One from "./Scenes/Level_Winter_One";
import Level_Winter_Two from "./Scenes/Level_Winter_Two";

export default class MainMenu extends Scene {
    mainMenuLayer: MainMenuLayer;
    backgroundLayer: BackgroundLayer;
    controlsLayer: ControlsLayer;
    helpLayer: HelpLayer;
    optionsLayer: OptionsLayer;
    levelSelectLayer: LevelSelectLayer;

    cursorLayer: Layer;
    cursorLayer2: Layer;

    cursor: Sprite;
    cursor2: Sprite;

    center: Vec2;
    scrollSpeed: number = 100;
    defaultFont: string = 'Abbadon Bold';
    viewPortWidth: number = this.viewport.getHalfSize().x * 2;
    viewPortHeight: number = this.viewport.getHalfSize().y * 2;

    selectLevelBack: GameButton;
    currentLayer: string = '';
    screenWipe: Sprite;
    toggleEvents: number = 0;
    nextLevel: string;

    loadScene(): void {
        this.load.image("logo", "assets/misc/logo.png");
        this.load.image("background", "assets/misc/canvas.png");
        this.load.image("ui_rect", "assets/ui_art/ui_rect_wip_v2.png");
        this.load.image("temp_cursor", "assets/misc/cursor.png");
        this.load.image("temp_button", "assets/ui_art/button.png");
        this.load.image("cursor_clicked", "assets/misc/cursor_clicked.png");
        this.load.image("spring", "assets/LevelSelectionButtons/spring.png");
        this.load.image("summer", "assets/LevelSelectionButtons/summer.png");
        this.load.image("autumn", "assets/LevelSelectionButtons/autumn.png");
        this.load.image("winter", "assets/LevelSelectionButtons/winter.png");
        this.load.audio("temp_music", "assets/music/temp.mp3");
        this.load.audio("button", "assets/sfx/button_sfx.wav");
        this.load.image("screen_wipe", "assets/misc/screen_wipe.png");
        this.load.image("toggle_box", "assets/ui_art/toggle_box.png");
        this.load.image("toggle_box_fill", "assets/ui_art/toggle_box_fill.png");
    }

    unloadScene(): void {
        this.load.keepAudio("button");
        this.load.keepImage("screen_wipe");
        this.load.keepImage("ui_rect");
        this.load.keepImage("temp_cursor");
        this.load.keepImage("cursor_clicked");
        this.load.keepImage("temp_button");
    }

    setDetectDocumentClick(toggle: boolean): void {

        if (toggle) document.onclick = () => { this.emitter.fireEvent(UIEvents.TRANSITION_SPLASH_SCREEN); }
        else document.onclick = () => { };
    }


    startScene(): void {
        this.viewport.setZoomLevel(1);
        this.center = new Vec2(this.viewport.getCanvasSize().x / 2, this.viewport.getCanvasSize().y / 2);

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "temp_music", loop: true, holdReference: true });
        window.onresize = (e: UIEvent) => { this.emitter.fireEvent(WindowEvents.RESIZED, { eventObject: e }) };

        this.backgroundLayer = new BackgroundLayer(this, this.center, this.viewport.getHalfSize().y / 10, this.defaultFont);
        this.mainMenuLayer = new MainMenuLayer(this, this.center, this.defaultFont);
        this.optionsLayer = new OptionsLayer(this, this.center, this.defaultFont);
        this.controlsLayer = new ControlsLayer(this, this.center, this.defaultFont);
        this.helpLayer = new HelpLayer(this, this.center, this.defaultFont);

        this.levelSelectLayer = new LevelSelectLayer(this, this.center, this.defaultFont);

        this.viewport.setCenter(this.center);


        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.cursor = this.add.sprite("temp_cursor", UILayers.CURSOR);

        this.cursor.scale = new Vec2(0.8, 0.8)
        this.cursor.visible = false;


        this.cursor2 = this.add.sprite("cursor_clicked", UILayers.CURSOR);
        this.cursor2.scale = new Vec2(0.8, 0.8)
        this.cursor2.visible = false;


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
        this.receiver.subscribe(UIEvents.CLICKED_TOGGLE);
        this.receiver.subscribe(UIEvents.TRANSITION_LEVEL_MAIN);


    }

    setVisibleLayer(layerName: string): void {
        if (this.currentLayer) {
            this.uiLayers.get(this.currentLayer).disable();

        }
        this.currentLayer = layerName;
        this.uiLayers.get(layerName).enable();
    }

    updateScene(deltaT: number) {
        let mousePos = Input.getGlobalMousePosition();
        this.cursor.position.set(mousePos.x, mousePos.y);
        this.cursor2.position.set(mousePos.x, mousePos.y);

        this.backgroundLayer.bg.position.x += this.scrollSpeed * deltaT;
        this.backgroundLayer.bgCopy.position.x += this.scrollSpeed * deltaT;
        if (this.backgroundLayer.bg.position.x > this.backgroundLayer.bg.size.x) {
            this.backgroundLayer.bg.position.x = -this.backgroundLayer.bg.size.x / 2;

        }

        if (this.backgroundLayer.bgCopy.position.x > this.backgroundLayer.bg.size.x) {
            this.backgroundLayer.bgCopy.position.x = -this.backgroundLayer.bg.size.x / 2;

        }

        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            // initially hide the mouse until user input, cursor isnt seen in upper corner 
            if (event.type === GameEventType.MOUSE_MOVE) {
                this.cursor.visible = true;
                this.receiver.unsubscribe(GameEventType.MOUSE_MOVE);
            }

            if (event.type === WindowEvents.RESIZED) {
                this.backgroundLayer.initLogo();

            }

            // This stupid fucking label sends 2 events per click so this dumb bit of code is necessary
            if (event.type === UIEvents.CLICKED_TOGGLE) {
                this.toggleEvents++;
                if (this.toggleEvents % 2 === 0) {
                    let id = event.data.get('id');
                    for (let toggle of this.optionsLayer.toggles) {
                        if (id === toggle.invisibleLabel.id) {
                            toggle.toggleFill();
                        }
                    }
                }


            }

            if (event.type === GameEventType.MOUSE_DOWN) {
                this.cursor.visible = false;
                this.cursor2.visible = true;
            }
            if (event.type === GameEventType.MOUSE_UP) {
                this.cursor.visible = true;
                this.cursor2.visible = false;
            }

            if (event.type === UIEvents.CLICKED_START) {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "button", loop: false, holdReference: true });
                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "temp_music" });


                this.screenWipe = this.add.sprite("screen_wipe", UILayers.CURSOR);
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.nextLevel = Scenes.LEVEL_ZERO;
                this.screenWipe.tweens.add("levelZeroTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL_MAIN));
                this.screenWipe.tweens.play("levelZeroTransition");
            }
            if (event.type === UIEvents.CLICKED_LEVEL_SELECT) {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "button", loop: false, holdReference: true });
                this.levelSelectLayer.playEntryTweens();
                this.setVisibleLayer(UILayers.LEVEL_SELECT);
            }
            if (event.type === UIEvents.CLICKED_SPRING) {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "temp_music" });

                this.nextLevel = Scenes.LEVEL_ZERO;
                this.screenWipe = this.add.sprite("screen_wipe", UILayers.CURSOR);
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.screenWipe.tweens.add("levelZeroTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL_MAIN));
                this.screenWipe.tweens.play("levelZeroTransition");

            }

            if (event.type === UIEvents.CLICKED_SUMMER) {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "temp_music" });
                this.nextLevel = Scenes.LEVEL_SUMMER_ONE;
                this.screenWipe = this.add.sprite("screen_wipe", UILayers.CURSOR);
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.screenWipe.tweens.add("levelZeroTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL_MAIN));
                this.screenWipe.tweens.play("levelZeroTransition");

            }

            if (event.type === UIEvents.CLICKED_FALL) {

                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "temp_music" });

                this.nextLevel = Scenes.LEVEL_FALL_ONE;
                this.screenWipe = this.add.sprite("screen_wipe", UILayers.CURSOR);
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.screenWipe.tweens.add("levelZeroTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL_MAIN));
                this.screenWipe.tweens.play("levelZeroTransition");
            }

            if (event.type === UIEvents.CLICKED_WINTER) {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "temp_music" });

                this.nextLevel = Scenes.LEVEL_WINTER_ONE;
                this.screenWipe = this.add.sprite("screen_wipe", UILayers.CURSOR);
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2, 1)
                this.screenWipe.position.set(2 * this.screenWipe.size.x, this.screenWipe.size.y / 2);
                this.screenWipe.tweens.add("levelZeroTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL_MAIN));
                this.screenWipe.tweens.play("levelZeroTransition");

            }
            if (event.type === UIEvents.TRANSITION_LEVEL_MAIN) {
                let sceneOptions = {
                    physics: Physics
                }
                switch (this.nextLevel) {
                    case Scenes.LEVEL_ZERO:
                        
                        this.sceneManager.changeToScene(LevelZero, {}, sceneOptions);
                        break;
                    case Scenes.LEVEL_SUMMER_ONE:
                        // change LevelZero to your own * first one
                        
                        this.sceneManager.changeToScene(LevelZero, {}, sceneOptions);
                        break;

                    case Scenes.LEVEL_FALL_ONE:
                        
                        this.sceneManager.changeToScene(Level_Fall_one, {}, sceneOptions);
                        break;

                    case Scenes.LEVEL_WINTER_ONE:
                        // change LevelZero to your own * first one
                        
                        this.sceneManager.changeToScene(Level_Winter_One, {}, sceneOptions);
                        break;

                    default:
                        break;
                }

            }

            if (event.type === UIEvents.CLICKED_CONTROLS) {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "button", loop: false, holdReference: true });
                this.controlsLayer.playEntryTweens();
                this.setVisibleLayer(UILayers.CONTROLS);
            }

            if (event.type === UIEvents.CLICKED_OPTIONS) {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "button", loop: false, holdReference: true });
                this.optionsLayer.playEntryTweens();
                this.setVisibleLayer(UILayers.OPTIONS);
            }

            if (event.type === UIEvents.CLICKED_HELP) {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "button", loop: false, holdReference: true });
                this.helpLayer.playEntryTweens();
                this.setVisibleLayer(UILayers.HELP);
            }

            if (event.type == UIEvents.SHOW_MAIN_MENU) {
                this.setVisibleLayer(UILayers.MAIN_MENU);
            }

            // distinguishes between the first time the main menu is shown, button tweens wont play after
            if (event.type == UIEvents.FIRST_RENDER) {
                this.setVisibleLayer(UILayers.MAIN_MENU)

                for (let button of this.mainMenuLayer.menuButtons) {
                    button.label.tweens.play('slideXFadeIn')
                    button.sprite.tweens.play('spriteSlideXFadeIn')
                }
            }

            if (event.type === UIEvents.TRANSITION_SCREEN) {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "button", loop: false, holdReference: true });
                switch (this.currentLayer) {
                    case (UILayers.CONTROLS):
                        this.controlsLayer.playExitTweens()
                        break;
                    case (UILayers.OPTIONS):
                        this.optionsLayer.playExitTweens()
                        break;
                    case (UILayers.HELP):
                        this.helpLayer.playExitTweens()
                        break;
                    case (UILayers.LEVEL_SELECT):
                        this.levelSelectLayer.playExitTweens()
                        break;
                    default:
                        break;
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