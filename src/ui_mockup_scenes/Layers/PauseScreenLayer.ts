import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../Wolfie2D/Scene/Scene";
import { UILayers, ButtonNames, PauseButtonNames } from "../Utils/Enums";
import * as Palette from "../Utils/Colors";
import * as Tweens from "../Utils/Tweens";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import GameButton from "../Classes/GameButton";
import {Fonts} from '../Utils/Enums';
export default class PauseScreenLayer {
	layer: UILayer;
	position: Vec2;
	scene: Scene;
	overlay: Sprite;
	menuButtons: Array<GameButton> = [];
	font: string;
	hidden: boolean = true;
	constructor(scene: Scene, position: Vec2) {
		this.scene = scene;
		this.font = Fonts.ABBADON_LIGHT;
		this.position = position.clone();
		this.layer = scene.addUILayer(UILayers.PAUSE_SCREEN);
		this.layer.setHidden(this.hidden);
		this.overlay = scene.add.sprite("screen_wipe", UILayers.PAUSE_SCREEN);
		this.overlay.alpha = 0.5;

		this.initButtons();
		
	}


	initButtons(): void {
		
	}

	toggle(): void {
		this.hidden = !this.hidden;
		this.layer.setHidden(this.hidden);
	}

}