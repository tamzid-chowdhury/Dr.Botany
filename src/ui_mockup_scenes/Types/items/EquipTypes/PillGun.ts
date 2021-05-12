import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import { PillGunController } from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";
import { PhysicsGroups } from "../../../Utils/PhysicsOptions";
import Equipment from "../Equipment";

export default class PillGun extends Equipment{
	constructor(data: Record<string,any>, sprite: Sprite, projSprite: Sprite) {
		super(data);
		this.sprite = sprite;
		this.projectileSprite = projSprite;
		this.init(new Vec2(-1000,-1000))
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(1.2, 1.2);
		this.sprite.invertY = true;
		this.sprite.visible = false;
        this.sprite.active = false;
        // this.sprite.addAI(PillGunController, {cooldown: this.cooldown});
        // this.sprite.setTrigger(PhysicsGroups.ENEMY, InGame_Events.PROJECTILE_HIT_ENEMY, null);
		// this.sprite.setTrigger(PhysicsGroups.PLAYER, InGame_Events.OVERLAP_EQUIP, InGame_Events.NOT_OVERLAP_EQUIP);
	}

	onPickup(): void {
		this.inInventory = true;

	}

	onDrop(position: Vec2): void {
		this.sprite.position.set(position.x, position.y)
		this.sprite.visible = true;
		this.inInventory = false;

	}


	doAttack(direction: Vec2): void {
		// if(this.charges > 0) {
		// 	this.sprite.active = true;
		// 	(<TrashLidController>this.sprite._ai).beginThrow(direction);
		// 	this.charges--;
		// }
	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
		// if((<TrashLidController>this.sprite._ai).attacking) {
		// 	// do nothing
		// }
		// else if((<TrashLidController>this.sprite._ai).returning) {
		// 	(<TrashLidController>this.sprite._ai).returnToPlayer(position);
		// }
		// else {
			this.sprite.position.set(position.x, position.y);
			// this.sprite.position.add(new Vec2(8 * playerLookDirection.x,8 *playerLookDirection.y));
			this.sprite.position.add(new Vec2(0,8 *playerLookDirection.y));
		// }


	}

	finishAttack(): void { }
}