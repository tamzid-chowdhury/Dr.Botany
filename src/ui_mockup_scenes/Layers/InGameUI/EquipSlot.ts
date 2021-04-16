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
	text: Label;
	textBackdrop: Label;
	centerPos: Vec2;
	type: string;

	constructor(scene: Scene, centerPos: Vec2) {
		this.centerPos = centerPos;
		this.slotOne = scene.add.sprite("ui_square", UILayers.INGAME_UI)
        let xOffset =  this.slotOne.size.x / 3;
        let yOffset =  this.centerPos.y / 3;
        this.slotOne.position.set(xOffset, yOffset)
        this.slotOne.scale = new Vec2(0.6, 0.6);

		yOffset += this.centerPos.y / 6;

		this.slotTwo = scene.add.sprite("ui_square", UILayers.INGAME_UI)
        this.slotTwo.position.set(xOffset, yOffset)
        this.slotTwo.scale = new Vec2(0.6, 0.6);

	}

	updateSlot(): void {
		
		// TODO: load a sprite of the item to be in this slot, check if melee or projectile and display ammo if projectile
	}

}