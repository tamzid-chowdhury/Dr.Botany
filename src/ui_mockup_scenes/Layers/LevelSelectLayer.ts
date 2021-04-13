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
	}
	enbleButtons(): void {
		this.initButtons();
		for (let button of this.levelSelectButton) {
			button.label.tweens.play('slideXFadeIn')
			button.sprite.tweens.play('spriteSlideXFadeIn')
		}
	}

	disbleButtons(): void {
		for (let button of this.levelSelectButton) {
			button.label.visible = false;
			button.sprite.visible = false;
		}
		this.levelSelectButton = [];
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
		let startX = this.position.x - 600;  // this.position is the center
		let startY = this.position.y - 230;
		let endX = this.position.x;
		let animationDelay = 0;

		// LEVEL 0 (TUTORIAL SPRING)
		{
			let sprite = this.scene.add.sprite("spring", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[0]}`, size: 24 });
			label.size.set(430, 134);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClickEventId = UIEvents.CLICKED_START;


			label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
			label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));


			sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
			sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			sprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(1.6, 1.0), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1.6, 1.0), sprite.scale, 0, 100));

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
			startY += 150;
			this.levelSelectButton.push(gameButton);
		}

		// LEVEL 1 and LEVEL 2 (SUMMER)
		for (let i = 1; i < 3; i++) {
			let sprite = this.scene.add.sprite("spring", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[i]}`, size: 24 });
			label.size.set(430, 134);
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
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(1.6, 1.0), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1.6, 1.0), sprite.scale, 0, 100));

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
			startY += 150;
			this.levelSelectButton.push(gameButton);
		}

		{
			// LEVEL 3 : FALL 
			let sprite = this.scene.add.sprite("spring", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[3]}`, size: 24 });
			label.size.set(430, 134);
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
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(1.6, 1.0), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1.6, 1.0), sprite.scale, 0, 100));

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
			startY += 150;
			this.levelSelectButton.push(gameButton);
		}
		// New Column for LEVEL 4 : FALL
		startX = this.position.x + 200;
		startY = this.position.y - 230;
		{
			let sprite = this.scene.add.sprite("spring", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[4]}`, size: 24 });
			label.size.set(430, 134);
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
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(1.6, 1.0), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1.6, 1.0), sprite.scale, 0, 100));

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
			startY += 150;
			this.levelSelectButton.push(gameButton);
		}
		// LEVEL 5 and LEVEL 6 (WINTER)
		for (let i = 5; i < 7; i++) {
			let sprite = this.scene.add.sprite("spring", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[i]}`, size: 24 });
			label.size.set(430, 134);
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
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(1.6, 1.0), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1.6, 1.0), sprite.scale, 0, 100));

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
			startY += 150;
			this.levelSelectButton.push(gameButton);
		}

		{
			// LEVEL 7 : FINAL BOSS 
			let sprite = this.scene.add.sprite("spring", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[7]}`, size: 24 });
			label.size.set(430, 134);
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
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(1.6, 1.0), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1.6, 1.0), sprite.scale, 0, 100));

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
			startY += 150;
			this.levelSelectButton.push(gameButton);
		}
	}
}