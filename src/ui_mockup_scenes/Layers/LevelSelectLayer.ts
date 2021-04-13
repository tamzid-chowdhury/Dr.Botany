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
import GameButton from "../Classes/GameButton";


export class LevelSelectLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	levelSelectButton: Array<GameButton> = [];
	font: string;
	constructor(scene: Scene, position: Vec2, font: string) {
		this.scene = scene;
		this.font = font;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.LEVEL_SELECT);
		this.layer.setHidden(true);
		this.initButtons();
	}
	disableButtons(): void {
		
	}

	initButtons(): void {
		let levelSelectionArray = [
			"Level 0 : Spring (Tutorial)",
			"Level 1 : Summer",
			"Level 2 : Summer",
			"Level 3 : Fall",
			"Level 4 : Fall",
			"Level 5 : Winter",
			"Level 6 : Winter",
			"Level 7 : Final Boss"
		]
		let xOffset = 200
		let startX = this.position.x - 700;  // this.position is the center
		let startY = this.position.y - xOffset;
		let endX = this.position.x;
		let animationDelay = 0;
		for(let i = 0; i < 4; i++) {
			let sprite = this.scene.add.sprite("temp_button", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(7,3);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[i]}`, size: 24 });
			label.size.set(200, 100);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClick = () => {
				console.log("Clicked")
			}
			

			label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
			label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));


			sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
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
			startY += 130;
			this.levelSelectButton.push(gameButton);
		}
		startX = this.position.x + 300;
		startY = this.position.y - xOffset;
		for(let i = 4; i < levelSelectionArray.length; i++) {
			let sprite = this.scene.add.sprite("temp_button", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(7,3);    // fix this based upon the picture Im drawing
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[i]}`, size: 24 });
			label.size.set(200, 100);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClick = () => {            // This would be assigning the Change Scene method
				console.log("Clicked")
			} 
			

			label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
			label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));


			sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
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
			startY += 130;
			this.levelSelectButton.push(gameButton);
		}
		// for (let name in levelSelectionArray) {
		// 	let sprite = this.scene.add.sprite("temp_button", UILayers.LEVEL_SELECT);
		// 	sprite.position.set(startX, startY);
		// 	sprite.scale = new Vec2(3,3);
		// 	sprite.alpha = 0;

		// 	let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${name}`, size: 24 });
		// 	label.size.set(200, 100);
		// 	label.borderWidth = 0;
		// 	label.borderRadius = 0;
		// 	label.font = this.font;
		// 	label.backgroundColor = Palette.transparent();
		// 	label.backgroundColor.a = 0;
		// 	label.textColor.a = 0;
		// 	label.borderColor = Palette.transparent();
			

		// 	label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
		// 	label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		// 	label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));


		// 	sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
		// 	sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
		// 	sprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
		// 	sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(3.8,3.8), 0, 100));
		// 	sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(3.8,3.8), sprite.scale, 0, 100));

		// 	label.onFirstEnter = () => {
		// 		label.tweens.play('slideUpLeft');
		// 		sprite.tweens.play('slideUpLeft');
		// 		sprite.tweens.play('scaleIn');
		// 	}
		// 	label.onLeave = () => {
		// 		label.tweens.play('slideDownRight');
		// 		sprite.tweens.play('slideDownRight');
		// 		sprite.tweens.play('scaleOut');
		// 	}
		// 	let gameButton = new GameButton(sprite, label);

		// 	animationDelay += 30;
		// 	startY += 100;
		// 	this.levelSelectButton.push(gameButton);
		// }

	}


}