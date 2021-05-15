import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Equipment from "../Equipment";
import * as Tweens from "../../../Utils/Tweens";
import ProjectileController from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";
import { PhysicsGroups } from "../../../Utils/PhysicsOptions";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";

export default class Shovel extends Equipment { 
	constructor(data: Record<string,any>, sprite: Sprite, projSprite: AnimatedSprite) {
		super(data);
		this.sprite = sprite;
		this.projectileSprite = projSprite;
		this.init(new Vec2(-1000,-1000))
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
		this.projectileSprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(this.scale, this.scale);
		this.sprite.invertY = true;
		this.sprite.visible = false;
		this.sprite.active = true;
		this.projectileSprite.visible = false;
        this.projectileSprite.active = false;
        this.projectileSprite.addAI(ProjectileController, {});
		this.projectileSprite.container = this;
		this.sprite.container = this;
        this.projectileSprite.setTrigger(PhysicsGroups.ENEMY, InGame_Events.PROJECTILE_HIT_ENEMY, null);
        this.sprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.sprite.size.x/2, this.sprite.size.y/2)));
        this.sprite.setGroup(PhysicsGroups.PROJECTILE);
	}

	onPickup(): void {
		super.onPickup();
		this.sprite.removeTrigger(PhysicsGroups.PLAYER);

	}

	onDrop(position: Vec2): void {
		super.onDrop(position);
		this.sprite.setTrigger(PhysicsGroups.PLAYER, InGame_Events.OVERLAP_EQUIP, InGame_Events.NOT_OVERLAP_EQUIP);
	}

	doAttack(direction: Vec2, deltaT: number) {

	    this.projectileSprite.position.set(this.sprite.position.x + (20*direction.x), this.sprite.position.y + (20*direction.y));
		(<AnimatedSprite>this.projectileSprite).animation.play("ATTACK", false);
		this.projectileSprite.rotation = -this.sprite.rotation;
		this.projectileSprite.visible = true;
		this.projectileSprite.active = true;
		this.projectileSprite.moving = true;

		this.sprite.tweens.add('swingdown', Tweens.swing(this.sprite, this.swingDir))
		this.sprite.tweens.play('swingdown');
		this.projectileSprite.rotation = -this.sprite.rotation;
		this.projectileSprite.visible = true;
		this.projectileSprite.active = true;
		this.projectileSprite.tweens.add('moveAndShrink', Tweens.spriteMoveAndShrink(this.projectileSprite.position, direction))
		this.projectileSprite.tweens.play('moveAndShrink');

		this.projectileSprite.tweens.add('fadeOut', Tweens.spriteFadeOut(200, 0))
		this.projectileSprite.tweens.play('fadeOut');

	}
	updatePos(position: Vec2, playerLookDirection: Vec2): void {
		// TODO: See if sprite position looks better with this additional offset
        // this.equipped.position.add(new Vec2(-8 * this.playerLookDirection.x,-8 *this.playerLookDirection.y));
		this.sprite.position.set(position.x, position.y);
		this.projectileSprite.position.set(position.x, position.y);
	}

	finishAttack(): void {

		this.swingDir *= -1;
		this.projectileSprite.tweens.stopAll();
		this.projectileSprite.visible = false;
		this.projectileSprite.active = false;
		this.projectileSprite.moving = false;
	}
}