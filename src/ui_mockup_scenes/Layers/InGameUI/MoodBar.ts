import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";

export default class Growthbar {
	sprite: Sprite;
	text: Label;
	textBackdrop: Label;
	centerPos: Vec2;
    scene: Scene;
    windowSize: Vec2 = new Vec2(window.innerWidth, window.innerHeight);

	constructor(scene: Scene, centerPos: Vec2) {
		this.centerPos = centerPos;
        this.scene = scene;
		this.sprite = scene.add.sprite("moodbar", UILayers.INGAME_UI)
        let xOffset =  this.centerPos.x;
        let yOffset =  2*this.centerPos.y - 2*this.sprite.size.y ;
        this.sprite.position.set(xOffset, yOffset)

        this.sprite.scale = new Vec2(0.5,0.5);

	}

    updatePos(width: number, height: number): void {
        // let zoom = document.body.clientWidth + "px x " + document.body.clientHeight + "px";
        // console.log()
    }

	updateText(): void {
		// TODO: when player health changes, text has to update
	}
}