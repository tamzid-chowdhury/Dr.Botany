import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UIEvents, UILayers, ButtonNames, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";
import * as Tweens from "../../Utils/Tweens";
import UIElement from "../../../Wolfie2D/Nodes/UIElement";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../../Wolfie2D/Scene/Layer";
import GameButton from "../../Classes/GameButton";
import GameLayer from "../../Classes/GameLayer";
import BackButton from "../../Classes/BackButton";

interface ButtonPositions {
	name: string;
	position: Vec2;
	eventId: string;
  }


export class LevelSelectLayer extends GameLayer{
	levelSelectButton: Array<GameButton> = [];
	levelSpriteNames: Array<ButtonPositions> = [] 
	
	constructor(scene: Scene, position: Vec2, font: string) {
		super()
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.LEVEL_SELECT);
		this.initButtons();
		this.backButton = new BackButton(scene, UILayers.LEVEL_SELECT, new Vec2(2,2));
		this.layer.disable();

	}

	initButtons(): void {
		let center = this.position.clone();

		this.sprite = this.scene.add.sprite('ui_rect', UILayers.LEVEL_SELECT);
		this.sprite.position = center;
		let finalScale = new Vec2(11,11);
		let startScale = new Vec2(0,0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale , finalScale,  0, 300));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale , startScale,  0, 300));
		this.sprite.position.y += this.sprite.size.y/3;

		this.levelSpriteNames.push({name: 'spring', position: new Vec2(center.x - (3*this.sprite.size.x * this.sprite.scale.x), center.y - (this.sprite.size.y * this.sprite.scale.y)), eventId: UIEvents.CLICKED_SPRING});
		this.levelSpriteNames.push({name: 'summer', position: new Vec2(center.x + (3*this.sprite.size.x * this.sprite.scale.x), center.y - (this.sprite.size.y * this.sprite.scale.y)), eventId: UIEvents.CLICKED_SUMMER});
		this.levelSpriteNames.push({name: 'autumn', position: new Vec2(center.x - (3*this.sprite.size.x * this.sprite.scale.x), center.y + (3*this.sprite.size.y * this.sprite.scale.y)), eventId: UIEvents.CLICKED_FALL});
		this.levelSpriteNames.push({name: 'winter', position: new Vec2(center.x + (3*this.sprite.size.x * this.sprite.scale.x), center.y + (3*this.sprite.size.y * this.sprite.scale.y)), eventId: UIEvents.CLICKED_WINTER});

		const title = "Level Select"
		this.titleLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(center.x, center.y - this.sprite.position.y/1.8), text: title });
		const textColor = Palette.black();
		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));


		for(let entry of this.levelSpriteNames) {
			let { name, position, eventId } = entry;
			let sprite = this.scene.add.sprite(name, UILayers.LEVEL_SELECT);
			sprite.position = position;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(position.x, position.y), text: name.toLocaleUpperCase() });
			label.textColor = textColor;
			label.fontSize = 48;
			label.size.set((sprite.size.x * sprite.scale.x) - sprite.size.x/4, (sprite.size.y * sprite.scale.y) - sprite.size.y/4)
			label.font = Fonts.ABBADON_LIGHT;
			label.onClickEventId = eventId;
		
			label.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
			label.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));
			label.tweens.add('slideUpLeft', Tweens.slideUpLeft(position.x, position.y));
			label.tweens.add('slideDownRight', Tweens.slideDownRight(position.x, position.y));

			sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(position.x, position.y));
			sprite.tweens.add('slideDownRight', Tweens.slideDownRight(position.x, position.y));
			sprite.tweens.add('fadeIn', Tweens.spriteFadeIn(300));
			sprite.tweens.add('fadeOut', Tweens.spriteFadeOut(300));


			label.onFirstEnter = () => {
				label.tweens.play('slideUpLeft');
				sprite.tweens.play('slideUpLeft');
			}
			label.onLeave = () => {
				sprite.tweens.play('slideDownRight');
				label.tweens.play('slideDownRight');
			}
			this.levelSelectButton.push(new GameButton(sprite, label));
		}

	}

	playEntryTweens(): void {
		for(let button of this.levelSelectButton) {
			button.sprite.tweens.play('fadeIn');
			button.label.tweens.play('scaleIn');
		}
		this.titleLabel.tweens.play('scaleIn');
		this.sprite.tweens.play('scaleIn');
		this.backButton.label.active = true;
		this.backButton.label.tweens.play('scaleIn');
	}

	playExitTweens(): void {
		for(let button of this.levelSelectButton) {
			button.sprite.tweens.play('fadeOut');
			button.label.tweens.play('scaleOut');
		}
		this.titleLabel.tweens.play('scaleOut');
		this.sprite.tweens.play('scaleOut');
		this.backButton.label.active = false;
		this.backButton.label.tweens.play('scaleOut');
	}


	/*
	initButtons(): void {
		let levelSelectionArray = [

		]
		let xOffset = 200
		let startX = this.position.x - 600;  // this.position is the center
		let startY = this.position.y - 130;
		let endX = this.position.x;
		let animationDelay = 0;

		
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
			label.onClickEventId = UIEvents.CLICKED_SPRING;


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
			startY += 200;
			this.levelSelectButton.push(gameButton);
		}
		{
			
			let sprite = this.scene.add.sprite("summer", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[1]}`, size: 24 });
			label.size.set(430, 134);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClickEventId = UIEvents.CLICKED_SUMMER;


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
		
		startX = this.position.x + 200;
		startY = this.position.y - 130;
		{
			let sprite = this.scene.add.sprite("autumn", UILayers.LEVEL_SELECT);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_SELECT, { position: new Vec2(startX, startY), text: `${levelSelectionArray[2]}`, size: 24 });
			label.size.set(430, 134);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClickEventId = UIEvents.CLICKED_FALL;


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
			startY += 200;
			this.levelSelectButton.push(gameButton);
		}
		{
			
			let sprite = this.scene.add.sprite("winter", UILayers.LEVEL_SELECT);
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
			label.onClickEventId = UIEvents.CLICKED_WINTER;


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
*/
}