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
import { Fonts } from '../Utils/Enums';
import BackButton from "../Classes/BackButton";
import GameLayer from "../Classes/GameLayer";
export default class LevelCompletionScreenLayer extends GameLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	overlay: Sprite;
	menuButtons: Array<GameButton> = [];  // restart level ? or back to main menu?
	font: string;
	hidden: boolean = true;
	restartLabel: Label;
	backToMainMenuLabel: Label;
	gameOverButtonNames: Array<ButtonPositions> = [];
	
	// resumeButton: ;
	// quitButton: ;
	constructor(scene: Scene, position: Vec2) {
		super();
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position.clone();
		this.layer = scene.addUILayer(UILayers.LEVEL_COMPLETION_SCREEN);
		this.layer.setHidden(this.hidden);
		this.overlay = scene.add.sprite("screen_wipe", UILayers.LEVEL_COMPLETION_SCREEN);
		this.overlay.alpha = 0.5;

		this.initButtons(scene);

	}


	initButtons(scene: Scene): void {
		let center = this.position.clone();
		this.sprite = this.scene.add.sprite('ui_rect', UILayers.LEVEL_COMPLETION_SCREEN);
		
		this.sprite.position = center;
		let finalScale = new Vec2(2, 2);
		let startScale = new Vec2(0, 0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale, finalScale, 0, 300));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale, startScale, 0, 300));

		this.sprite.position.y -= this.sprite.size.y / 2;

		const title = "Level Completed!"
		this.titleLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_COMPLETION_SCREEN, { position: new Vec2(center.x, this.sprite.position.y - this.sprite.size.y / 1.3), text: title });
		const textColor = Palette.black();

		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));

		this.gameOverButtonNames.push({name: 'Next Level', position: new Vec2(center.x , this.sprite.position.y - this.sprite.size.y/4), eventId: UIEvents.TRANSITION_LEVEL});
		this.gameOverButtonNames.push({name: 'Quit', position: new Vec2(center.x , this.sprite.position.y + this.sprite.size.y/4), eventId: UIEvents.CLICKED_QUIT});



		for(let entry of this.gameOverButtonNames) {
			let { name, position, eventId } = entry;
			let sprite = scene.add.sprite("temp_button", UILayers.LEVEL_COMPLETION_SCREEN);
			sprite.position = position;

			let startScale = new Vec2(0,0);
			let finalScale = new Vec2(1.0,0.8);
			let label = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.LEVEL_COMPLETION_SCREEN, { position: new Vec2(position.x, position.y), text: name.toLocaleUpperCase() });
			label.textColor = textColor;
			label.fontSize = 40;
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
		this.layer.disable();
	}



	playEntryTweens(): void {
		this.layer.enable();
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