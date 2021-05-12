import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";
import Counter from "../../Classes/Counter";

interface StringIndex {
	[index: string]: any;
}

export default class EquipSlots {
	equippedBackdrop: Sprite;
	text: Label;
	textBackdrop: Label;
	centerPos: Vec2;
	type: string;
	scene: Scene;
	xOffset: number;
	yOffset: number;
	outline: Sprite;
	slots: Array<Sprite> = [];
	ammoSlots: StringIndex = [];
	maxSlots: number = 2;
	constructor(scene: Scene, centerPos: Vec2) {
		this.centerPos = centerPos;
		this.scene = scene;
		this.xOffset = this.centerPos.x / 16;
		this.yOffset = this.centerPos.y / 4;
	}

	updateSlot(iconKey: string, hasAmmo: boolean, ammo: number, slot: number): void {
		let sprite = this.scene.add.sprite(iconKey, UILayers.INGAME_UI);
		let xOffset = this.xOffset + (24 * slot)
		sprite.position.set(xOffset, this.yOffset); // each successive slot is 24 px away from previous
		this.slots[slot] = sprite;
		if(hasAmmo) {
			let counter = new Counter(this.scene, ammo, new Vec2(50,50), new Vec2(xOffset+4, this.yOffset+4), 16);
			this.ammoSlots[iconKey] = counter;
		}
	}

	removeSlot(index: number): void {
		if(this.slots[index] !== undefined) {
			let key = this.slots[index];
			if(this.ammoSlots[key.imageId] !== undefined) {
				(<Counter>this.ammoSlots[key.imageId]).destroy(); 
			}
			this.slots[index].destroy();
		}

	}

	updateCounter(iconKey: string, count: number): void{
		(<Counter>this.ammoSlots[iconKey]).setCount(count);
	}

	drawOutline(iconKey: string): void {
		if(this.outline) {
			this.outline.destroy()
		}
		this.outline = this.scene.add.sprite(`${iconKey}_outline`, UILayers.INGAME_UI);
		for(let slot of this.slots) {
			if(slot.imageId === iconKey) {
				this.outline.position = slot.position;
				break;
			}
		}
	}

}