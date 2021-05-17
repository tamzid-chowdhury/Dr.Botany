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
import Slider from "../../../Wolfie2D/Nodes/UIElements/Slider";
import GameToggle from "../../Classes/GameToggle";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";


export class OptionsLayer extends GameLayer {
	cheatsStrings: Array<string> = 
	[
		"Num Key 1 - Extra Ammo", "Num Key 2 - Infinite Life", 
		"Num Key 3 - Spawn TrashLid" , "Num Key 4 - Spawn PillBottle",
		"Num Key 5 - Skip To Next Level"
	]
	lines: Array<Label> = [];
	center: Vec2;
	toggles: Array<GameToggle> = [];
	constructor(scene: Scene, position: Vec2, font: string) {
		super();
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position;
		this.layer = scene.addUILayer(UILayers.OPTIONS);

		this.center = this.position.clone();
		this.sprite = this.scene.add.sprite('ui_rect', UILayers.OPTIONS);
		this.sprite.position = this.center;
		let finalScale = new Vec2(11,11);
		let startScale = new Vec2(0,0);
		this.sprite.tweens.add('scaleIn', Tweens.scaleIn(startScale , finalScale,  0, 300));
		this.sprite.tweens.add('scaleOut', Tweens.scaleIn(finalScale , startScale,  0, 300));

		this.sprite.position.y += this.sprite.size.y/3;

		const title = "Cheats"
		this.titleLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.OPTIONS, { position: new Vec2(this.center.x, this.center.y - this.sprite.position.y/1.8), text: title });
		const textColor = Palette.black();
		this.titleLabel.textColor = textColor;
		this.titleLabel.fontSize = 48;
		this.titleLabel.font = Fonts.ABBADON_BOLD;
		this.titleLabel.tweens.add('scaleIn', Tweens.scaleInText(this.titleLabel.fontSize, 0, 300));
		this.titleLabel.tweens.add('scaleOut', Tweens.scaleOutText(this.titleLabel.fontSize, 0, 300));

		this.backButton = new BackButton(scene, UILayers.OPTIONS, new Vec2(2,2));
		this.initButtons();

		this.layer.disable();
	}



	initButtons(): void {
		
		let lineOffset = this.sprite.position.y/4;
		const textColor = Palette.black();


		for(let entry of this.cheatsStrings) {
			let line = <Label>this.scene.add.uiElement(UIElementType.LABEL, UILayers.OPTIONS, { position: new Vec2(this.center.x, this.center.y - lineOffset), text: entry });
			lineOffset -= 50;
			line.textColor = textColor;
			line.fontSize = 40;
			line.font = this.font;
			line.scale = new Vec2(0,0);
			line.tweens.add('scaleIn', Tweens.scaleInText(line.fontSize, 0, 300))
			line.tweens.add('scaleOut', Tweens.scaleOutText(line.fontSize, 0, 300))
			this.lines.push(line);
		}

		lineOffset -= 25;
		
	}

	playEntryTweens(): void {
		for(let line of this.lines) {
			line.tweens.play('scaleIn');

		}
		// for(let toggle of this.toggles) {
		// 	toggle.borderSprite.tweens.play('scaleIn');
		// }
		this.sprite.tweens.play('scaleIn');
		this.titleLabel.tweens.play('scaleIn');
		this.backButton.label.active = true;
		this.backButton.label.tweens.play('scaleIn')
	}

	playExitTweens(): void {
		for(let line of this.lines) {
			line.tweens.play('scaleOut');
		}
		// for(let toggle of this.toggles) {
		// 	toggle.borderSprite.tweens.play('scaleOut');
		// }
		this.titleLabel.tweens.play('scaleOut');
		this.sprite.tweens.play('scaleOut');
		this.backButton.label.active = false;
		this.backButton.label.tweens.play('scaleOut');
		this.backButton.sprite.tweens.play('fadeOut');
	}


}