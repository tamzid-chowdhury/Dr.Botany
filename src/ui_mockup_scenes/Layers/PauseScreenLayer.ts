import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { UILayers, ButtonNames, PauseButtonNames } from "../Utils/Enums";
import * as Palette from "../Utils/Colors";
import * as Tweens from "../Utils/Tweens";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import GameButton from "../Classes/GameButton";

export default class PauseScreenLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	menuButtons: Array<GameButton> = [];
	font: string;
	constructor(scene: Scene, position: Vec2, font: string) {
		this.scene = scene;
		this.font = font;
		this.position = position.clone();
		this.layer = scene.addUILayer(UILayers.PAUSE_SCREEN);
		this.layer.setHidden(true);
		this.initButtons();
		
	}


	initButtons(): void {
		let xOffset = 200
		let startX = this.position.x - xOffset;
		let startY = this.position.y - xOffset;
		let endX = this.position.x;
		let animationDelay = 0;
		for (let name in PauseButtonNames) {
			let myName: PauseButtonNames = PauseButtonNames[name as keyof typeof PauseButtonNames];

			let sprite = this.scene.add.sprite("temp_button", UILayers.PAUSE_SCREEN);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(3,3);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.PAUSE_SCREEN, { position: new Vec2(startX, startY), text: `${myName}`, size: 24 });
			label.size.set(180, 100);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClickEventId = 'CLICKED_' + name;

			label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
			label.tweens.add('slideXFadeOut', Tweens.slideXFadeOut(startX, startY, animationDelay, xOffset));
			label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));

			

			sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
			sprite.tweens.add('spriteSlideXFadeOut', Tweens.spriteSlideXFadeOut(startX, startY, animationDelay, xOffset));
			sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			sprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(3.8,3.8), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(3.8,3.8), sprite.scale, 0, 100));

			label.onFirstEnter = () => {
				label.tweens.play('slideUpLeft');
				sprite.tweens.play('slideUpLeft');
				sprite.tweens.play('scaleIn');
			}
			label.onLeave = () => {
				label.tweens.play('slideDownRight');
				sprite.tweens.play('slideDownRight');
				sprite.tweens.play('scaleOut');
			}


			let gameButton = new GameButton(sprite, label);

			animationDelay += 30;
			startY += 100;
			this.menuButtons.push(gameButton);
		}
	}
}