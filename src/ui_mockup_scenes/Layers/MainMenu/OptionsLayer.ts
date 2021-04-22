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


export class OptionsLayer extends GameLayer {
	constructor(scene: Scene, position: Vec2, font: string) {
		super();
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.OPTIONS);
		this.initButtons();
		this.backButton = new BackButton(scene, UILayers.OPTIONS, new Vec2(2,2));
		this.layer.disable();
	}

	initButtons(): void {
		let center = this.position.clone();
		this.sprite = this.scene.add.sprite('ui_rect', UILayers.OPTIONS);
		this.sprite.position = center;
		let finalScale = new Vec2(11,11);
		let startScale = new Vec2(0,0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(new Vec2(0,0) , new Vec2(11,11),  0, 200));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(11,11) , new Vec2(0,0),  0, 200));

		this.sprite.position.y += this.sprite.size.y/3;
		// this.sprite.scale = finalScale
		const title = "Options"
		this.titleLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.OPTIONS, { position: new Vec2(center.x, center.y - this.sprite.position.y/1.8), text: title });
		const textColor = Palette.black();
		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 200));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 200));
		
	}

	playEntryTweens(): void {
		this.sprite.tweens.play('scaleIn');
		this.titleLabel.tweens.play('scaleIn');
		this.backButton.label.active = true;
		this.backButton.label.tweens.play('scaleIn')
	}

	playExitTweens(): void {
		this.titleLabel.tweens.play('scaleOut');
		this.sprite.tweens.play('scaleOut');
		this.backButton.label.active = false;
		this.backButton.label.tweens.play('scaleOut');
	}


}