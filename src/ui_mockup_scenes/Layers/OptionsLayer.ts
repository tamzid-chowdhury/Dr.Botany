import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { UIEvents, UILayers, ButtonNames } from "../Utils/Enums";
import * as Palette from "../Utils/Colors";
import * as Tweens from "../Utils/Tweens";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";


export class OptionsLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	// back: Label;
	font: string;
	constructor(scene: Scene, position: Vec2, font: string) {
		this.scene = scene;
		this.font = font;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.OPTIONS);
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
		
		const line1 = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.OPTIONS, { position: new Vec2(center.x, center.y - 200), text: 'options' });
	

		const textColor = Palette.black();
		line1.textColor = textColor;
		line1.fontSize = 40;
		line1.font = this.font;
		

		// let back = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.OPTIONS, { position: new Vec2(startX, startY), text: "Back", size : 24});
		// back.size.set(150, 80);
		// back.borderWidth = 0;
		// back.borderRadius = 0;
		// back.font = this.font;
		// back.backgroundColor = Palette.logoColor();
		
		
		// back.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(back.position.x, back.position.y, animationDelay, xOffset));
		// back.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, back.position.y))
		// back.tweens.add('slideDownRight', Tweens.slideDownRight(endX, back.position.y))
		// back.tweens.add('highlight', Tweens.changeColor(back.backgroundColor, Palette.highlight()))
		// back.tweens.add('unhighlight', Tweens.changeColor(Palette.highlight(), back.backgroundColor))
		// back.onFirstEnter = () => {
		// 	back.tweens.play('slideUpLeft');
		// 	back.tweens.play('highlight');
		// }
		// back.onLeave = () => {
		// 	back.tweens.play('slideDownRight');
		// 	back.tweens.play('unhighlight');
		// }
		// back.onClickEventId = UIEvents.SHOW_MAIN_MENU;
		// this.back = back;
	}


}