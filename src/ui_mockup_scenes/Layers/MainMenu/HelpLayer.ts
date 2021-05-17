import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";
import * as Tweens from "../../Utils/Tweens";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import BackButton from "../../Classes/BackButton";
import GameLayer from "../../Classes/GameLayer";


export class HelpLayer extends GameLayer {

	helpText: Array<string> = 
	[	
		"In Dr. Botany you have two goals per level: stay alive and feed your plant.",
		"Enemies will try to attack you and your plant.", "If you take enough damage it's game over.", 
		"Your plant will never die, but it will lose growth if it takes damage.",
		"Defend yourself, and feed the materials they drop to your plant.",
		"Be warned though, your plant is tempermental;", "what you feed it could have consequences that both help and harm you."

	]
	lines: Array<Label> = [];

	constructor(scene: Scene, position: Vec2, font: string) {
		super();
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.HELP);
		// this.layer.setHidden(true);
		this.initButtons();
		this.backButton = new BackButton(scene, UILayers.HELP, new Vec2(2,2));
		this.layer.disable();
	}

	initButtons(): void {
		let center = this.position.clone();
		this.sprite = this.scene.add.sprite('ui_rect', UILayers.HELP);
		this.sprite.position = center;
		let finalScale = new Vec2(11,11);
		let startScale = new Vec2(0,0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale , finalScale,  0, 300));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale , startScale,  0, 300));

		this.sprite.position.y += this.sprite.size.y/3;

		const title = "Help"
		this.titleLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.HELP, { position: new Vec2(center.x, center.y - this.sprite.position.y/1.8), text: title });
		const textColor = Palette.black();
		let lineOffset = this.sprite.position.y/4;

		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));

		for(let entry of this.helpText) {
			let line = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.HELP, { position: new Vec2(center.x, center.y - lineOffset), text: entry });
			lineOffset -= 58;
			line.textColor = textColor;
			line.fontSize = 40;
			line.font = this.font;
			line.scale = new Vec2(0,0);
			line.tweens.add('scaleIn', Tweens.scaleInText(line.fontSize, 0, 300))
			line.tweens.add('scaleOut', Tweens.scaleOutText(line.fontSize, 0, 300))
			this.lines.push(line);
		}

		lineOffset -= 30;
		
	}

	playEntryTweens(): void {
		for(let line of this.lines) {
			line.tweens.play('scaleIn');
		}
		this.titleLabel.tweens.play('scaleIn');
		this.sprite.tweens.play('scaleIn');
		this.backButton.label.active = true;
		this.backButton.label.tweens.play('scaleIn')
	}

	playExitTweens(): void {
		for(let line of this.lines) {
			line.tweens.play('scaleOut');
		}
		this.titleLabel.tweens.play('scaleOut');
		this.sprite.tweens.play('scaleOut');
		this.backButton.label.active = false;
		this.backButton.label.tweens.play('scaleOut');
		this.backButton.sprite.tweens.play('fadeOut');
	}

}