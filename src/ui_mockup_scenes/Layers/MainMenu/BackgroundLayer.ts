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


export class BackgroundLayer {
	logo: Sprite;
	layer: UILayer;
	bg: Sprite;
	bgCopy: Sprite;
	position: Vec2;
	startText: Label;
	scene: Scene;
	font: string;
	constructor(scene: Scene, position: Vec2, logoOffset: number, font: string) {
		this.scene = scene;
		this.font = font
		this.position = position;
		this.layer = scene.addUILayer(UILayers.BACKGROUND);
		this.bg = scene.add.sprite("background", UILayers.BACKGROUND);
		this.bgCopy = scene.add.sprite("background", UILayers.BACKGROUND);
		this.bg.imageOffset = new Vec2(0, 0);
		this.bgCopy.imageOffset = new Vec2(0, 0);
		this.bg.position.set(-36, -18);
		this.bgCopy.position.set(-this.bg.size.x, -18);

		

		this.logo = scene.add.sprite("logo", UILayers.BACKGROUND);
		this.logo.position.set(position.x, position.y - logoOffset);
		let endScale = new Vec2(this.logo.scale.x, this.logo.scale.y)
		this.logo.scale = new Vec2(0, 0);
		this.logo.tweens.add('scaleIn', Tweens.scaleIn(this.logo.scale, endScale));
		this.logo.tweens.add('slideUpShrink', Tweens.slideUpShrink(endScale, this.logo.position.y, position.y));

		this.startText = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.BACKGROUND, { position: new Vec2(position.x, position.y + 120), text: "Click to Begin!", size: 45 });
        this.startText.textColor = Palette.transparent();
        this.startText.font = this.font;
        this.startText.alpha = 0;

        this.startText.tweens.add('fadeIn', Tweens.fadeIn());
        this.startText.tweens.add('fadeOut', Tweens.fadeOut(this.startText.position.y));
	}

	playSplashScreen(): void {
		this.logo.tweens.play('scaleIn');
        this.startText.tweens.play('fadeIn');

	}
}
