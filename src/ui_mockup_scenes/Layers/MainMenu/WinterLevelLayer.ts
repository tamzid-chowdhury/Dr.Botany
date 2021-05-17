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
import GameButton from "../../Classes/GameButton";



export class WinterLevelLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	levelSelectButton: Array<GameButton> = [];
	font: string;
	constructor(scene: Scene, position: Vec2, font: string) {
		this.scene = scene;
		this.font = font;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.WINTER_LEVELS);
		this.layer.setHidden(true);
	}
	enbleButtons(): void {
		this.initButtons();
		for (let button of this.levelSelectButton) {
			button.label.tweens.play('slideXFadeIn')
			button.sprite.tweens.play('spriteSlideXFadeIn')
		}
	}

	disableButtons(): void {
		for (let button of this.levelSelectButton) {
			button.label.visible = false;
			button.sprite.visible = false;
		}
		this.levelSelectButton = [];
	}

	initButtons(): void {
		let levelSelectionArray = [
			"Level 5",
            "Level 6",
            "Back"
		]
		let xOffset = 200
		let startX = this.position.x - 200;  // this.position is the center
		let startY = this.position.y - 100;
		let endX = this.position.x;
		let animationDelay = 0;
		{
			let sprite = this.scene.add.sprite("winter", UILayers.WINTER_LEVELS);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.WINTER_LEVELS, { position: new Vec2(startX, startY), text: `${levelSelectionArray[0]}`, size: 24 });
			label.size.set(430, 134);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClick = () => {
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
			startY += 200;
			this.levelSelectButton.push(gameButton);
		}
        {
			let sprite = this.scene.add.sprite("winter", UILayers.WINTER_LEVELS);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(1.4, 0.8);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.WINTER_LEVELS, { position: new Vec2(startX, startY), text: `${levelSelectionArray[1]}`, size: 24 });
			label.size.set(430, 134);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClick = () => {
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
			startY = this.position.y + 300;
			this.levelSelectButton.push(gameButton);
		}
        {
            let sprite = this.scene.add.sprite("temp_button", UILayers.WINTER_LEVELS);
			sprite.position.set(startX, startY);
			sprite.scale = new Vec2(3, 3);
			sprite.alpha = 0;

			let label = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.WINTER_LEVELS, { position: new Vec2(startX, startY), text: `${levelSelectionArray[2]}`, size: 24 });
			label.size.set(430, 134);
			label.borderWidth = 0;
			label.borderRadius = 0;
			label.font = this.font;
			label.backgroundColor = Palette.transparent();
			label.backgroundColor.a = 0;
			label.textColor.a = 0;
			label.borderColor = Palette.transparent();
			label.onClickEventId = UIEvents.CLICKED_LEVEL_SELECT;


			label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(startX, startY, animationDelay, xOffset));
			label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));


			sprite.tweens.add('spriteSlideXFadeIn', Tweens.spriteSlideXFadeIn(startX, startY, animationDelay, xOffset));
			sprite.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, startY));
			sprite.tweens.add('slideDownRight', Tweens.slideDownRight(endX, startY));
			sprite.tweens.add('scaleIn', Tweens.scaleIn(sprite.scale, new Vec2(3.8, 3.8), 0, 100));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(3.8, 3.8), sprite.scale, 0, 100));

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
		
	}
}