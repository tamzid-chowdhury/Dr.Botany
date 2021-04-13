import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../Wolfie2D/Nodes/UIElement";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import Slider from "../Wolfie2D/Nodes/UIElements/Slider";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";

export default class default_scene extends Scene {
    private logo: Sprite;
    private bg: Sprite;
    private mainMenu: Layer;
    private splashScreen: Layer;
    private background: Layer;
    private about: Layer;
    private logoColor = new Color(204, 152, 114);
    // private highlight = new Color(168, 201, 153);
    private highlight = new Color(76, 175, 80)
    private dropColor = new Color(80, 82, 80);
    private darkHighlight = new Color(140, 100, 81);
    // private darkHighlight = new Color(45, 46, 45);
	private dropShadow: UIElement;
    private dropShadow2: UIElement;

    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
    }
    setDropShadow(pos: Vec2) {
        this.dropShadow.position.set(pos.x + 5, pos.y + 5);
	}

    setDropShadow2(pos: Vec2) {
        this.dropShadow2.position.set(pos.x + 5, pos.y + 5);
    }

    createLogo(center: Vec2): void {
        this.logo = this.add.sprite("logo", "background");
        this.logo.scale = new Vec2(0.5, 0.5);
        this.logo.position.set(center.x, center.y / 4);
    }


    createLevelSelectionButtons(center: Vec2): void {
        let startX = center.x-400;
        let startY = center.y-250;
        this.dropShadow = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: ''});
        this.dropShadow.borderWidth = 0;
        this.dropShadow.size.set(500, 50);
        this.dropShadow.backgroundColor = this.dropColor;

        this.dropShadow2 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: ''});
        this.dropShadow2.borderWidth = 0;
        this.dropShadow2.size.set(200, 50);
        this.dropShadow2.backgroundColor = this.dropColor;


        const level0 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 0 : Spring (Tutorial)", size: 24});
        level0.size.set(500, 50);
        level0.borderWidth = 0;
        
        level0.backgroundColor = this.darkHighlight;
        level0.borderColor = this.darkHighlight;
        level0.onEnter = () => this.setDropShadow(level0.position);

        startY += 100;


        const level1 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 1 : Summer", size: 24});
        level1.size.set(500, 50);
        level1.borderWidth = 0;
        level1.backgroundColor = this.darkHighlight;
        level1.borderColor = this.darkHighlight;
        level1.onEnter = () => this.setDropShadow(level1.position);

        startY += 100;


        const level2 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 2 : Summer", size: 24});
        level2.size.set(500, 50);
        level2.borderWidth = 0;
        level2.backgroundColor = this.darkHighlight;
        level2.borderColor = this.darkHighlight;
        level2.onEnter = () => this.setDropShadow(level2.position);
    
        startY += 100;


        const level3 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 3 : Fall", size: 24});
        level3.size.set(500, 50);
        level3.borderWidth = 0;
        level3.backgroundColor = this.darkHighlight;
        level3.borderColor = this.darkHighlight;
        level3.onEnter = () => this.setDropShadow(level3.position);

        startY = center.y -250;
        startX = center.x + 400;

        const level4 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 4 : Fall", size: 24});
        level4.size.set(500, 50);
        level4.borderWidth = 0;
        level4.backgroundColor = this.darkHighlight;
        level4.borderColor = this.darkHighlight;
        level4.onEnter = () => this.setDropShadow(level4.position);

        startY += 100;

        const level5 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 5 : Winter", size: 24});
        level5.size.set(500, 50);
        level5.borderWidth = 0;
        level5.backgroundColor = this.darkHighlight;
        level5.borderColor = this.darkHighlight;
        level5.onEnter = () => this.setDropShadow(level5.position);
    
        startY += 100;

        const level6 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 6 : Winter", size: 24});
        level6.size.set(500, 50);
        level6.borderWidth = 0;
        level6.backgroundColor = this.darkHighlight;
        level6.borderColor = this.darkHighlight;
        level6.onEnter = () => this.setDropShadow(level6.position);

        startY += 100;

        const level7 = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Level 7 : Final Boss", size: 24});
        level7.size.set(500, 50);
        level7.borderWidth = 0;
        level7.backgroundColor = this.darkHighlight;
        level7.borderColor = this.darkHighlight;
        level7.onEnter = () => this.setDropShadow(level7.position);

        startX = center.x;
        startY = center.y +200;


        const back = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Back", size: 24});
        back.size.set(200, 50);
        back.borderWidth = 0;
        back.backgroundColor = this.darkHighlight;
        back.borderColor = this.darkHighlight;
        back.onEnter = () => this.setDropShadow2(back.position);
    }


    createBackground(): void {
        this.bg = this.add.sprite("background", "background");
        this.bg.position.set(25, -18);
    }

    startScene(): void {

        const center = this.viewport.getCenter();
        this.background = this.addUILayer("background");
        this.mainMenu = this.addUILayer("mainMenu");
        this.splashScreen = this.addUILayer("splashScreen");

        this.createBackground();
        this.createLogo(center);
        this.createLevelSelectionButtons(center);


        // this.receiver.subscribe("begin");
        // this.receiver.subscribe("about");
        // this.receiver.subscribe("menu");

    }


    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();


            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
            }
        }
    }
}