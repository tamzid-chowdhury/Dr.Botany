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


export default class HelpScreen extends Scene {
    private logo: Sprite;
    private bg: Sprite;
    private contents: Layer;
    private background: Layer;
	private developerLabel: Label;
	private cheatsLabel: Label;
	private cheatsContentsLabel: Label;
    private about: Layer;
    private logoColor = new Color(204, 152, 114);
	private logoSecondaryColor = new Color(220, 180, 121);
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

	createCheatsLabel(center: Vec2): void {
		let viewCenter = this.viewport.getHalfSize();
		const rect = this.add.graphic(GraphicType.RECT, "contents", {position: new Vec2(center.x-viewCenter.x/1.5, center.y - viewCenter.y/2+200), size: new Vec2(400,400), color: this.logoSecondaryColor});

		this.cheatsLabel =  <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x-viewCenter.x/1.5, center.y - viewCenter.y/2+50), text: "Cheats", size: 24});
        this.cheatsLabel.backgroundColor = this.darkHighlight;
        this.cheatsLabel.borderRadius = 1;
        this.cheatsLabel.padding = new Vec2(90,10);
		this.cheatsLabel.textColor = Color.WHITE;

		const godModeLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x-viewCenter.x/1.5, center.y - viewCenter.y/2+150), text: "God Mode:	on", size: 24});
        godModeLabel.padding = new Vec2(50,40);
		godModeLabel.textColor = Color.WHITE;

		const infiniteAmmoLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x-viewCenter.x/1.5, center.y - viewCenter.y/2+200), text: "Infinite Ammo:	off", size: 24});
        infiniteAmmoLabel.padding = new Vec2(10,40);
		infiniteAmmoLabel.textColor = Color.WHITE;

		const allEquipmentLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x-viewCenter.x/1.5, center.y - viewCenter.y/2+250), text: "Spawn all equipment:	on", size: 24});
        allEquipmentLabel.padding = new Vec2(10,40);
		allEquipmentLabel.textColor = Color.WHITE;
	
		const maxMaterialsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x-viewCenter.x/1.5, center.y - viewCenter.y/2+300), text: "Max Materials:	on", size: 24});
        maxMaterialsLabel.padding = new Vec2(10,40);
		maxMaterialsLabel.textColor = Color.WHITE;

	}

	createAboutLabel(center: Vec2): void {
		let viewCenter = this.viewport.getHalfSize();
		const rect = this.add.graphic(GraphicType.RECT, "contents", {position: new Vec2(center.x, center.y - viewCenter.y/2+200), size: new Vec2(400,400), color: this.logoSecondaryColor});

		const synopsisLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x, center.y - viewCenter.y/2+50), text: "Synopsis/Characters", size: 24});
        synopsisLabel.backgroundColor = this.darkHighlight;
        synopsisLabel.padding = new Vec2(20,10);
        synopsisLabel.borderRadius = 1;
		synopsisLabel.textColor = Color.WHITE;

		const ellipses = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x, center.y - viewCenter.y/2+200), text: "...", size: 24});
		ellipses.textColor = Color.WHITE;

	}

	createDeveloperLabel(center: Vec2): void {

		let viewCenter = this.viewport.getHalfSize();
		const rect = this.add.graphic(GraphicType.RECT, "contents", {position: new Vec2(center.x+viewCenter.x/1.5, center.y - viewCenter.y/2+200), size: new Vec2(400,400), color: this.logoSecondaryColor});

		const developerLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x+viewCenter.x/1.5, center.y - viewCenter.y/2+50), text: "Developers", size: 24});
        developerLabel.backgroundColor = this.darkHighlight;
        developerLabel.padding = new Vec2(20,10);
        developerLabel.borderRadius = 1;
		developerLabel.textColor = Color.WHITE;

		const tamzidLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x+viewCenter.x/1.5, center.y - viewCenter.y/2+150), text: "Tamzid Chowdhury", size: 24});
        tamzidLabel.padding = new Vec2(50,40);
		tamzidLabel.textColor = Color.WHITE;

		const paulLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x+viewCenter.x/1.5, center.y - viewCenter.y/2+200), text: "Paul Han", size: 24});
        paulLabel.padding = new Vec2(10,40);
		paulLabel.textColor = Color.WHITE;

		const charlieLabel = <Label>this.add.uiElement(UIElementType.LABEL, "contents", {position: new Vec2(center.x+viewCenter.x/1.5, center.y - viewCenter.y/2+250), text: "Charlie Monnone", size: 24});
        charlieLabel.padding = new Vec2(10,40);
		charlieLabel.textColor = Color.WHITE;
	
	}

    createBackground(): void {
        this.bg = this.add.sprite("background", "background");
        this.bg.position.set(25, -18);
    }

    startScene(): void {

        const center = this.viewport.getCenter();
        this.background = this.addUILayer("background");
        this.contents = this.addUILayer("contents");
		
        this.createBackground();
        this.createLogo(center);
		this.createDeveloperLabel(center);
		this.createCheatsLabel(center);
		this.createAboutLabel(center)
        // this.createMenuButtons(center);

    }


    updateScene(){
    }
}