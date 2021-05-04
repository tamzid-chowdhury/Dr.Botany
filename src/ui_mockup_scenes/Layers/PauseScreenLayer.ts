import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { UILayers, ButtonNames, PauseButtonNames, InGame_Events, UIEvents } from "../Utils/Enums";
import * as Palette from "../Utils/Colors";
import * as Tweens from "../Utils/Tweens";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import GameButton, {ButtonPositions} from "../Classes/GameButton";
import {Fonts} from '../Utils/Enums';
import BackButton from "../Classes/BackButton";
import GameLayer from "../Classes/GameLayer";
export default class PauseScreenLayer extends GameLayer{
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	overlay: Sprite;
	menuButtons: Array<GameButton> = [];
	font: string;
	hidden: boolean = true;
	pauseButtonNames: Array<ButtonPositions> = [];
	constructor(scene: Scene, position: Vec2) {
		super();
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position.clone();
		this.layer = scene.addUILayer(UILayers.PAUSE_SCREEN);
		this.layer.setHidden(this.hidden);
		this.overlay = scene.add.sprite("screen_wipe", UILayers.PAUSE_SCREEN);
		this.overlay.alpha = 0.5;

		this.initButtons(scene);
		
	}


	initButtons(scene: Scene): void {
		let center = this.position.clone();
		this.sprite = scene.add.sprite('ui_rect', UILayers.PAUSE_SCREEN);
		this.sprite.position = center;
		let finalScale = new Vec2(2,2);
		let startScale = new Vec2(0,0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale , finalScale,  0, 300));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale , startScale,  0, 300));

		this.sprite.position.y -= this.sprite.size.y/2;

		const title = "Paused"
		this.titleLabel = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.PAUSE_SCREEN, { position: new Vec2(center.x, this.sprite.position.y - this.sprite.size.y/1.3), text: title });
		const textColor = Palette.black();

		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300, InGame_Events.TOGGLE_PAUSE_TRANSITION));
		
		this.pauseButtonNames.push({name: 'Resume', position: new Vec2(center.x , this.sprite.position.y - this.sprite.size.y/4), eventId: UIEvents.CLICKED_RESUME});
		this.pauseButtonNames.push({name: 'Quit', position: new Vec2(center.x , this.sprite.position.y + this.sprite.size.y/4), eventId: UIEvents.CLICKED_QUIT});



		for(let entry of this.pauseButtonNames) {
			let { name, position, eventId } = entry;
			let sprite = scene.add.sprite("temp_button", UILayers.PAUSE_SCREEN);
			sprite.position = position;

			let startScale = new Vec2(0,0);
			let finalScale = new Vec2(0.8,0.8);
			let label = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.PAUSE_SCREEN, { position: new Vec2(position.x, position.y), text: name.toLocaleUpperCase() });
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
			sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale , finalScale,  0, 300));
			sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale , startScale,  0, 300));


			label.onFirstEnter = () => {
				label.tweens.play('slideUpLeft');
				sprite.tweens.play('slideUpLeft');
			}
			label.onLeave = () => {
				sprite.tweens.play('slideDownRight');
				label.tweens.play('slideDownRight');
			}
			this.menuButtons.push(new GameButton(sprite, label));
		}
		
	}



	playEntryTweens(): void {
		this.hidden = !this.hidden;
		this.layer.setHidden(this.hidden);
		this.titleLabel.tweens.play('scaleIn');
		this.sprite.tweens.play('scaleIn');
		for(let button of this.menuButtons) {
			button.sprite.tweens.play('scaleIn');
			button.label.tweens.play('scaleIn');
		}

	}

	playExitTweens(): void {
		this.hidden = !this.hidden;
		this.titleLabel.tweens.play('scaleOut');
		this.sprite.tweens.play('scaleOut');
		for(let button of this.menuButtons) {
			button.sprite.tweens.play('scaleOut');
			button.label.tweens.play('scaleOut');

		}
	}

}