import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
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
	constructor(scene: Scene, layer: string = UILayers.BACKGROUND, scale: Vec2 = new Vec2(3,3)){
		super(scene.add.sprite("temp_button", layer), <Label>scene.add.uiElement(UIElementType.LABEL, layer, { position: new Vec2(0, 0), text: "Back", size : 24}));

		let startY = this.center.y + this.yOffset;
		let endX = this.center.x;
		this.sprite.position = new Vec2(endX, startY);
		this.sprite.scale = scale;
		this.sprite.alpha = 0;

		this.label.position = this.sprite.position;
		this.label.size.set((this.sprite.size.x * scale.x) - 16, (this.sprite.size.y * scale.y) - 16);
		this.label.borderWidth = 0;
		this.label.setVAlign('bottom');
		this.label.borderRadius = 0;
		this.label.font = Fonts.ABBADON_BOLD;
		this.label.fontSize = 48;
		this.label.backgroundColor = Palette.transparent();
		this.label.borderColor = Palette.transparent();
		this.label.onClickEventId = UIEvents.TRANSITION_SCREEN;
		

		
		this.label.tweens.add('scaleIn', Tweens.scaleInText(this.label.fontSize, 0, 300))
		this.label.tweens.add('scaleOut', Tweens.scaleOutText(this.label.fontSize, 0, 300))
		this.label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		this.label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
		this.sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		this.sprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));


		this.sprite.tweens.add('fadeIn', Tweens.spriteFadeIn(100));
		this.sprite.tweens.add('fadeOut', Tweens.spriteFadeOut(100));
	


		this.label.onFirstEnter = () => {
			this.label.tweens.play('slideUpLeft');
			this.sprite.tweens.play('fadeIn');
			this.sprite.tweens.play('slideUpLeft');
		}
		this.label.onLeave = () => {
			this.sprite.tweens.play('slideDownRight');
			this.sprite.tweens.play('fadeOut');
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