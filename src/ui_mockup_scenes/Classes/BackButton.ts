import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";
import * as Tweens from "../Utils/Tweens";
import * as Palette from "../Utils/Colors";
import { Fonts, UIEvents, UILayers } from "../Utils/Enums";
import GameButton from "./GameButton";
import Scene from "../../Wolfie2D/Scene/Scene";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";

export default class BackButton extends GameButton {
	xOffset: number = 30;
	yOffset: number = 300;

	scene: Scene;
	center: Vec2 = new Vec2(window.innerWidth / 2, window.innerHeight / 2);
	constructor(scene: Scene){
		super(scene.add.sprite("temp_button", UILayers.BACKGROUND), <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.BACKGROUND, { position: new Vec2(0, 0), text: "Back", size : 24}));

		let startX = this.center.x - this.xOffset;
		let startY = this.center.y + this.yOffset;
		let endX = this.center.x;
		let animationDelay = 0;
		this.sprite.position = new Vec2(startX, startY);
		this.sprite.scale = new Vec2(3,3);
		this.sprite.alpha = 0;

		this.label.position = this.sprite.position;
		this.label.size.set(200, 100);
		this.label.borderWidth = 0;
		this.label.borderRadius = 0;
		this.label.font = Fonts.ROUND;
		this.label.backgroundColor = Palette.transparent();
		this.label.backgroundColor.a = 0;
		this.label.textColor.a = 0;
		this.label.borderColor = Palette.transparent();
		this.label.onClickEventId = UIEvents.SHOW_MAIN_MENU;

		this.label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, this.xOffset));
		this.label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		this.label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));

		this.sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, this.xOffset));
		this.sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		this.sprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(this.sprite.scale, new Vec2(3.8,3.8), 0, 100));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(3.8,3.8), this.sprite.scale, 0, 100));
	
		this.label.onFirstEnter = () => {
			this.label.tweens.play('slideUpLeft');
			this.sprite.tweens.play('scaleIn');
			this.sprite.tweens.play('slideUpLeft');
		}
		this.label.onLeave = () => {
			this.sprite.tweens.play('slideDownRight');
			this.sprite.tweens.play('scaleOut');
			this.label.tweens.play('slideDownRight');
		}
	
	}

	reposition(windowCenter: Vec2): void {
		this.sprite.position = windowCenter;
		this.label.position = windowCenter;
		this.sprite.position.y += this.yOffset;
		this.label.position = this.sprite.position;
	}
}