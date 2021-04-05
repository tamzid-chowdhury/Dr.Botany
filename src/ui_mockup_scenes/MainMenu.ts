import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../Wolfie2D/Nodes/UIElement";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";


export default class MainMenu extends Scene {
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

    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
    }
    setDropShadow(pos: Vec2) {
        this.dropShadow.position.set(pos.x + 5, pos.y+5);
	}


    createMenuButtons(center: Vec2): void {
        let startX = center.x;
        let startY = center.y-100;
        this.dropShadow = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: ''});
        this.dropShadow.borderWidth = 0;
        this.dropShadow.size.set(200, 50);
        this.dropShadow.backgroundColor = this.dropColor;


        const start = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Start", size: 24});
        start.size.set(200, 50);
        start.borderWidth = 0;
        start.backgroundColor = this.highlight;
        start.borderColor = this.highlight;
        start.onEnter = () => this.setDropShadow(start.position);

        startY += 100;


        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Controls", size: 24});
        controls.size.set(200, 50);
        controls.borderWidth = 0;
        controls.backgroundColor = this.darkHighlight;
        controls.borderColor = this.darkHighlight;
        controls.onEnter = () => this.setDropShadow(controls.position);

        startY += 100;


        const options = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Options", size: 24});
        options.size.set(200, 50);
        options.borderWidth = 0;
        options.backgroundColor = this.darkHighlight;
        options.borderColor = this.darkHighlight;
        options.onEnter = () => this.setDropShadow(options.position);
    
        startY += 100;


        const credits = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Credits", size: 24});
        credits.size.set(200, 50);
        credits.borderWidth = 0;
        credits.backgroundColor = this.darkHighlight;
        credits.borderColor = this.darkHighlight;
        credits.onEnter = () => this.setDropShadow(credits.position);

        startY += 100;

        const quit = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(startX, startY), text: "Quit", size: 24});
        quit.size.set(200, 50);
        quit.borderWidth = 0;
        quit.backgroundColor = this.darkHighlight;
        quit.borderColor = this.darkHighlight;
        quit.onEnter = () => this.setDropShadow(quit.position);

    
    }

    createLogo(center: Vec2): void {
        this.logo = this.add.sprite("logo", "background");
        this.logo.position.set(center.x, center.y / 3);
        this.logo.scale = new Vec2(0.5, 0.5); 
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
        this.createMenuButtons(center);


        this.receiver.subscribe("begin");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");

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