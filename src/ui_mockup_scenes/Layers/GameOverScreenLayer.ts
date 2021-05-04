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
import GameButton from "../Classes/GameButton";
import { Fonts } from '../Utils/Enums';
import BackButton from "../Classes/BackButton";
import GameLayer from "../Classes/GameLayer";
export default class GameOverScreenLayer extends GameLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	overlay: Sprite;
	menuButtons: Array<GameButton> = [];  // restart level ? or back to main menu?
	font: string;
	hidden: boolean = true;
	restartLabel: Label;
	backToMainMenuLabel: Label;
	buttonSprite: Sprite;
	
	// resumeButton: ;
	// quitButton: ;
	constructor(scene: Scene, position: Vec2) {
		super();
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position.clone();
		this.layer = scene.addUILayer(UILayers.GAMEOVER_SCREEN);
		this.layer.setHidden(this.hidden);
		this.overlay = scene.add.sprite("screen_wipe", UILayers.GAMEOVER_SCREEN);
		this.overlay.alpha = 0.5;

		this.initButtons();

	}


	initButtons(): void {
		let center = this.position.clone();
		this.sprite = this.scene.add.sprite('ui_rect', UILayers.GAMEOVER_SCREEN);
		
		this.sprite.position = center;
		let finalScale = new Vec2(2, 2);
		let startScale = new Vec2(0, 0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale, finalScale, 0, 300));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale, startScale, 0, 300));

		this.sprite.position.y -= this.sprite.size.y / 2;

		const title = "Game Over"
		this.titleLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.GAMEOVER_SCREEN, { position: new Vec2(center.x, this.sprite.position.y - this.sprite.size.y / 1.3), text: title });
		const textColor = Palette.black();

		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));


		this.buttonSprite = this.scene.add.sprite('temp_button', UILayers.GAMEOVER_SCREEN);
		this.buttonSprite.visible = false;
		this.buttonSprite.tweens.add('scaleIn', Tweens.scaleIn(new Vec2(0, 0), new Vec2(1.5, 1)));
		this.buttonSprite.position.set(center.x - this.sprite.size.x / 2, this.sprite.position.y + this.sprite.size.y / 3);

		const restartLevel = "Restart"
		this.restartLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.GAMEOVER_SCREEN,
			{ position: new Vec2(center.x - this.sprite.size.x / 2, this.sprite.position.y + this.sprite.size.y / 3), text: restartLevel });

		this.restartLabel.textColor = Palette.black();
		this.restartLabel.size.set(85, 30);
		this.restartLabel.fontSize = 48;
		this.restartLabel.font = Fonts.ABBADON_LIGHT;
		this.restartLabel.tweens.add('scaleIn', Tweens.scaleInText(this.restartLabel.fontSize, 0, 300));
		this.restartLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.restartLabel.fontSize, 0, 300));
		this.restartLabel.onClickEventId = UIEvents.CLICKED_RESTART;
		


		const backToMainMenu = "To Main Menu"
		this.backToMainMenuLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.GAMEOVER_SCREEN,
			{ position: new Vec2(center.x + this.sprite.size.x / 2, this.sprite.position.y + this.sprite.size.y / 3), text: backToMainMenu });
		this.backToMainMenuLabel.size.set(85, 30);

		this.backToMainMenuLabel.textColor = Palette.black();
		this.backToMainMenuLabel.fontSize = 48;
		this.backToMainMenuLabel.font = Fonts.ABBADON_LIGHT;
		this.backToMainMenuLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.backToMainMenuLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));
		this.backToMainMenuLabel.onClickEventId = UIEvents.CLICKED_QUIT;


	}



	playEntryTweens(): void {
		this.hidden = !this.hidden;
		this.layer.setHidden(this.hidden);
		this.titleLabel.tweens.play('scaleIn');

		this.restartLabel.tweens.play('scaleIn');
		this.buttonSprite.tweens.play('scaleIn')
		this.backToMainMenuLabel.tweens.play('scaleIn');
		this.sprite.tweens.play('scaleIn');

	}

	playExitTweens(): void {
		this.hidden = !this.hidden;
		this.titleLabel.tweens.play('scaleOut');
		this.restartLabel.tweens.play('scaleOut');
		this.backToMainMenuLabel.tweens.play('scaleOut');
		this.sprite.tweens.play('scaleOut');
	}

}