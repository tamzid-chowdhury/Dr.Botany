import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";

export default class EquipSlots {
	slotOne: Sprite;
	slotTwo: Sprite;
	equippedBackdrop: Sprite;
	text: Label;
	textBackdrop: Label;
	centerPos: Vec2;
	type: string;
	scene: Scene;
	xOffset: number;
	yOffset: number;
	constructor(scene: Scene, centerPos: Vec2) {
		this.centerPos = centerPos;
		this.scene = scene;
		this.xOffset = this.centerPos.x / 16;
		this.yOffset = this.centerPos.y / 4;
	}

	updateSlot(slot: number, spriteKey: string): void {
		if(slot === 0) {
			// this.equippedBackdrop = this.scene.add.sprite("ui_square", UILayers.INGAME_UI);
			// this.equippedBackdrop.position.set(this.xOffset, this.yOffset)
			// this.equippedBackdrop.scale = new Vec2(0.6, 0.6);
			// this.equippedBackdrop.alpha = 0.7;
			// this.equippedBackdrop.rotation = -Math.PI / 4;
			this.slotOne = this.scene.add.sprite(`${spriteKey}_icon`, UILayers.INGAME_UI);
			this.slotOne.position.set(this.xOffset, this.yOffset)
		}
		else {
			this.slotTwo = this.scene.add.sprite(`${spriteKey}_icon`, UILayers.INGAME_UI);
			this.slotTwo.position.set(this.xOffset + 24, this.yOffset)
			// this.slotTwo = this.scene.add.sprite(spriteKey, UILayers.INGAME_UI);
			// this.slotTwo.position.set(this.xOffset + (this.centerPos.x / 16), this.yOffset)
			// this.slotTwo.scale = new Vec2(0.5, 0.5);
			// this.slotTwo.rotation = -Math.PI / 4;
		}
	}

}