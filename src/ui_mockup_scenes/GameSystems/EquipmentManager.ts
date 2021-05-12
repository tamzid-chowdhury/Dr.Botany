import Equipment from "../Types/items/Equipment";

export default class EquipmentManager {
	equipped: Equipment;
	stowed: Equipment;
	prototypes: Array<Equipment>;
	constructor(defaults: Array<Equipment>) {
		this.prototypes = defaults;
		this.equipped = this.prototypes[2];
		this.stowed = this.prototypes[1];
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
		let equipped = this.prototypes.find((p) => p === this.equipped);
		let swap = this.prototypes.find((p) => p === this.stowed);
		equipped.sprite.visible = false;
		this.equipped = swap;
		this.stowed = equipped;
	}

	getEquipped(): Equipment {
		return this.equipped;
	}
}