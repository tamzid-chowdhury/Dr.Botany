import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

export default class EquipmentManager {
	equipped: Sprite;
	stowed: Sprite;

	constructor() {

	}

	dropEquipped() {
		// drop equipped on ground
	}

	pickupEquipped() {
		// if player already has two equips
		// swap currently equipped with item on ground
	}

	swapEquipped() {
		// switch equipped with stowed
	}
}