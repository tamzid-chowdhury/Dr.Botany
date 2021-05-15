import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import ProjectileController, { PillBottleController } from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";
import { PhysicsGroups } from "../../../Utils/PhysicsOptions";
import Equipment from "../Equipment";

export default class PillBottle extends Equipment {
	clip: Array<Sprite>;
	constructor(data: Record<string,any>, sprite: Sprite, clip: Array<Sprite>) {
		super(data);
		this.sprite = sprite;
		this.clip = clip;
		this.init(new Vec2(-1000,-1000))
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(this.scale, this.scale);
		this.sprite.invertY = true;
		this.sprite.visible = false;
        this.sprite.active = true;
        this.sprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.sprite.size.x/2, this.sprite.size.y/2)));
		this.sprite.container = this;
        this.sprite.addAI(PillBottleController, {cooldown: this.cooldown, clip: this.clip});
		for(let c of this.clip) {
			c.container = this;
			c.setGroup(PhysicsGroups.PROJECTILE);
			c.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.sprite.size.x/2, this.sprite.size.y/4)));
			c.setTrigger(PhysicsGroups.ENEMY, InGame_Events.PROJECTILE_HIT_ENEMY, null);
		}
	}

	onPickup(): void {
		super.onPickup();
		this.sprite.removeTrigger(PhysicsGroups.PLAYER);

	}

	onDrop(position: Vec2): void {
		super.onDrop(position);
		this.sprite.setTrigger(PhysicsGroups.PLAYER, InGame_Events.OVERLAP_EQUIP, InGame_Events.NOT_OVERLAP_EQUIP);

	}

	setActive(position: Vec2): void {
		this.sprite.position.set(position.x, position.y);
        this.sprite.invertY = true;
        this.sprite.visible = true;
	}


	doAttack(direction: Vec2, deltaT: number): void {
		if(this.charges > 0) {
			(<PillBottleController>this.sprite._ai).fire(direction, deltaT);
			this.charges--;
		}
	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
		this.sprite.position.set(position.x, position.y);
		this.sprite.position.add(new Vec2(0,-8*playerLookDirection.y));

	}

	finishAttack(): void { }
}