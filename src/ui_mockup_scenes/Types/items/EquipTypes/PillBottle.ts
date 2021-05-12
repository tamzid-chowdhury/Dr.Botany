import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import { PillBottleController } from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";
import { PhysicsGroups } from "../../../Utils/PhysicsOptions";
import Equipment from "../Equipment";

export default class PillBottle extends Equipment{
	constructor(data: Record<string,any>, sprite: Sprite, projSprite: Sprite) {
		super(data);
		this.sprite = sprite;
		this.projectileSprite = projSprite;
		this.init(new Vec2(-1000,-1000))
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(this.scale, this.scale);
		this.sprite.invertY = true;
		this.sprite.visible = false;
        this.sprite.active = true;
        this.sprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.sprite.size.x/2, this.sprite.size.y/2)));

        this.sprite.addAI(PillBottleController, {cooldown: this.cooldown});
        // this.sprite.setTrigger(PhysicsGroups.ENEMY, InGame_Events.PROJECTILE_HIT_ENEMY, null);
		// this.sprite.setTrigger(PhysicsGroups.PLAYER, InGame_Events.OVERLAP_EQUIP, InGame_Events.NOT_OVERLAP_EQUIP);
	}

	onPickup(): void {
		super.onPickup();
		this.sprite.removeTrigger(PhysicsGroups.PLAYER);

	}

	onDrop(position: Vec2): void {
		super.onDrop(position);
		this.sprite.setTrigger(PhysicsGroups.PLAYER, InGame_Events.OVERLAP_EQUIP, InGame_Events.NOT_OVERLAP_EQUIP);

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
			this.sprite.position.add(new Vec2(0,-8*playerLookDirection.y));
			// this.sprite.position.y += 2;
			// }


	}

	finishAttack(): void { }
}