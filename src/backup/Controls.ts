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
	

    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
    }
    setDropShadow(pos: Vec2) {
        this.dropShadow.position.set(pos.x + 5, pos.y + 5);
	}
    

    createLogo(center: Vec2): void {
        this.logo = this.add.sprite("logo", "background");
        this.logo.scale = new Vec2(0.5, 0.5);
        this.logo.position.set(center.x, center.y / 4);
    }


    createControlsLabels(center: Vec2): void {
        this.dropShadow = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 300), text: ''});
        this.dropShadow.borderWidth = 0;
        this.dropShadow.size.set(200, 50);
        this.dropShadow.backgroundColor = this.dropColor;
        // const text11 = "WASD - keys for movements";
        // const text22 = "E - keys to pick up an item from the ground";
        // const text33 = "Q - keys to drop the current item on the ground";
        // const text44 = "Left Mouse Click - to use the currently equipped item";
        // const text55 = "1 and 2 - keys to equip an inventory item";
        const text1 = "W - Move Up";
        const text2 = "A - Move Left";
        const text3 = "S - Move Down";
        const text4 = "D - Move Right";
        const text5 = "E - Pick up Items";
        const text6 = "Q, Mouse Wheel - Equipment Change";
        const text7 = "Right Mouse Button - Block";
        const text8 = "Left Mouse Button - Attack";
        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 200), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 150), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 50), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y + 50), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: text7});
        const line8 = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y + 150), text: text8});

        line1.textColor = Color.BLACK;
        line1.fontSize = 40;
        line2.textColor = Color.BLACK;
        line2.fontSize = 40;
        line3.textColor = Color.BLACK;
        line3.fontSize = 40;
        line4.textColor = Color.BLACK;
        line4.fontSize = 40;
        line5.textColor = Color.BLACK;
        line5.fontSize = 40;
        line6.textColor = Color.BLACK;
        line6.fontSize = 40;
        line7.textColor = Color.BLACK;
        line7.fontSize = 40;
        line8.textColor = Color.BLACK;
        line8.fontSize = 40;


        const back = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 0;
        back.borderColor = this.darkHighlight;
        back.backgroundColor = this.darkHighlight;
        back.onEnter = () => this.setDropShadow(back.position);
        
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
        this.createControlsLabels(center);


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