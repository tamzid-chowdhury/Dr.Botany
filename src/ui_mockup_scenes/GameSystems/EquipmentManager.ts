import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Equipment from "../Types/items/Equipment";

export default class EquipmentManager {
	equipped: Equipment;
	stowed: Equipment;

	constructor(defaultEquip: Equipment) {
		this.equipped = defaultEquip;
		this.stowed = null;
	}

	dropEquipped() {
		// drop equipped on ground
	}

	pickupEquipped() {
		// if player already has two equips
		// swap currently equipped with item on ground
	}

	switchEquipped() {
		// switch equipped with stowed
	}
}