import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import ProjectileController from "../Controllers/ProjectileController";
import Equipment from "../Types/items/Equipment";
import PillBottle from "../Types/items/EquipTypes/PillBottle";
import Shovel from "../Types/items/EquipTypes/Shovel";
import TrashLid from "../Types/items/EquipTypes/TrashLid";
import { InGame_Events } from "../Utils/Enums";
import { PhysicsGroups } from "../Utils/PhysicsOptions";

export default class EquipmentManager {
	prototypes: Array<Equipment> = [];
	scene: Scene;
	constructor(scene: Scene) {
		this.scene = scene;
		let equipData = this.scene.load.getObject("equipmentData");

        for(let i = 0; i < equipData.count; i++){
            let equip = equipData.equipment[i];
            let temp ;
			let sprite;
			let projSprite;
            switch(equip.name) {
                case "Shovel":
					sprite = this.scene.add.sprite(equip.spriteKey, "secondary");
					projSprite = this.scene.add.animatedSprite(equip.projectileSpriteKey, "primary");
                    temp = new Shovel(equip, sprite, projSprite);
					break;
                case "TrashLid":
					sprite = this.scene.add.sprite(equip.spriteKey, "primary");
					// projSprite = this.scene.add.animatedSprite(equip.projectileSpriteKey, "primary");
                    temp = new TrashLid(equip, sprite, projSprite);
                    break;
                case "PillBottle":
					sprite = this.scene.add.sprite(equip.spriteKey, "primary");
					let clip: Array<Sprite> = [];
					let projectileCopies = equip.projectileCopies;
					for(let i = 0; i < projectileCopies; i ++) {
						let charge = this.scene.add.sprite(equip.projectileSpriteKey, "primary");
						charge.visible = false;
						charge.active = false;
						clip.push(charge)
					}
                    temp = new PillBottle(equip, sprite, clip);
                default:
                    break;
            }
            this.prototypes.push(temp);
		}
	}



	spawnEquipment(name: string, position: Vec2): void {
		for(let p of this.prototypes) {
			if(p.name === name) {
				p.onDrop(position);
			}
		}
	}

	

	dropEquipped(): void {
		return;
		// drop equipped on ground
	}

	pickupEquipped(id: any): Equipment {
		let equip;
		if(typeof id === 'string') {
			for(let p of this.prototypes) {
				if(p !== undefined) {
					if(p.name === id) {
						p.onPickup();
						equip = p;
						break;
					}
				}

			}
		}
		else if(typeof id === 'number') {
			for(let p of this.prototypes) {
				if(p !== undefined) {

					if(p.sprite.id === id) {
						p.onPickup();
						equip = p;
						break;
					}
				}
			}
		}

		return equip;
	}

}