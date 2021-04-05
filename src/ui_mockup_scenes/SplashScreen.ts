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


export default class SplashScreen extends Scene {
    private logo: Sprite;
    private bg: Sprite;
	private startText: Label;
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


    createLogo(center: Vec2): void {
        this.logo = this.add.sprite("logo", "background");
        this.logo.position.set(center.x, center.y -100);
        // this.logo.scale = new Vec2(0.5, 0.5); 
    }

    createBackground(): void {
        this.bg = this.add.sprite("background", "background");
        this.bg.position.set(25, -18);
    }

	createStartText(center: Vec2): void {
		this.startText = <Label>this.add.uiElement(UIElementType.LABEL, "splashScreen", {position: new Vec2(center.x, center.y + 120), text: "Click to Begin!", size: 48});
        this.startText.textColor = Color.BLACK;
	}

    startScene(): void {

        const center = this.viewport.getCenter();
        this.background = this.addUILayer("background");
        this.splashScreen = this.addUILayer("splashScreen");

        this.createBackground();
        this.createLogo(center);
        this.createStartText(center);

    }


    updateScene(){

    }
}