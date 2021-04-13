import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UIEvents, UILayers, ButtonNames } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";
import * as Tweens from "../../Utils/Tweens";
import UIElement from "../../../Wolfie2D/Nodes/UIElement";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../Wolfie2D/Scene/Layer";


export class ControlsLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	font: string
	constructor(scene: Scene, position: Vec2, font: string) {
		this.scene = scene;
		this.font = font;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.CONTROLS);
		this.layer.setHidden(true);
		this.initButtons();
	}

	initButtons(): void {
		let center = this.position.clone();
		let xOffset = 30
		let startX = this.position.x - xOffset;
		let startY = this.position.y + 300;
		let endX = this.position.x;
		let animationDelay = 0;
		const text1 = "W - Move Up";
		const text2 = "A - Move Left";
		const text3 = "S - Move Down";
		const text4 = "D - Move Right";
		const text5 = "E - Pick up Items";
		const text6 = "Q, Mouse Wheel - Equipment Change";
		const text7 = "Right Mouse Button - Block";
		const text8 = "Left Mouse Button - Attack";
		const line1 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y - 200), text: text1 });
		const line2 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y - 150), text: text2 });
		const line3 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y - 100), text: text3 });
		const line4 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y - 50), text: text4 });
		const line5 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y), text: text5 });
		const line6 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y + 50), text: text6 });
		const line7 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y + 100), text: text7 });
		const line8 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.CONTROLS, { position: new Vec2(center.x, center.y + 150), text: text8 });

		const textColor = Palette.black();
		line1.textColor = textColor;
		line1.fontSize = 40;
		line1.font = this.font;
		line2.textColor = textColor;
		line2.fontSize = 40;
		line2.font = this.font;
		line3.textColor = textColor;
		line3.fontSize = 40;
		line3.font = this.font;
		line4.textColor = textColor;
		line4.fontSize = 40;
		line4.font = this.font;
		line5.textColor = textColor;
		line5.fontSize = 40;
		line5.font = this.font;
		line6.textColor = textColor;
		line6.fontSize = 40;
		line6.font = this.font;
		line7.textColor = textColor;
		line7.fontSize = 40;
		line7.font = this.font;
		line8.textColor = textColor;
		line8.fontSize = 40;
		line8.font = this.font;

	}


}