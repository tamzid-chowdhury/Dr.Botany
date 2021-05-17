import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";

export default class Moodbar {
	sprite: Sprite;
	indicator: Sprite;
	happyindicator: Sprite;
	angryindicator: Sprite;
	text: Label;
	textBackdrop: Label;
	centerPos: Vec2;
    scene: Scene;
	scale: Vec2 = new Vec2(0.5,0.5);
	windowSize: Vec2 = new Vec2(window.innerWidth, window.innerHeight);
	xOffset: number; 
	yOffset: number; 

	constructor(scene: Scene, centerPos: Vec2) {
		this.centerPos = centerPos;
        this.scene = scene;
		this.sprite = scene.add.sprite("moodbar", UILayers.INGAME_UI)
		this.happyindicator = scene.add.sprite("happy_moodbar_indicator", UILayers.INGAME_UI);
		this.angryindicator = scene.add.sprite("angry_moodbar_indicator", UILayers.INGAME_UI);
		this.indicator = scene.add.sprite("moodbar_indicator", UILayers.INGAME_UI);
        this.xOffset =  this.centerPos.x;
        this.yOffset =  2*this.centerPos.y - 2*this.sprite.size.y ;
        this.sprite.position.set(this.xOffset, this.yOffset)
		this.indicator.position.set(this.xOffset, this.yOffset)
		this.happyindicator.position.set(this.xOffset, this.yOffset)
		this.angryindicator.position.set(this.xOffset, this.yOffset)

        this.sprite.scale = this.scale;
		this.indicator.scale = new Vec2(0.6,0.6);
		this.happyindicator.scale = new Vec2(0.6,0.6);
		this.angryindicator.scale = new Vec2(0.6,0.6);

	}

    updatePos(width: number, height: number): void {
        // let zoom = document.body.clientWidth + "px x " + document.body.clientHeight + "px";
        // console.log()
    }

	updateText(): void {
		// TODO: when player health changes, text has to update
	}
}