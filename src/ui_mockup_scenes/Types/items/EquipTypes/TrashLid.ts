import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Equipment from "../Equipment";
import * as Tweens from "../../../Utils/Tweens";
import ProjectileController, { TrashLidController } from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";

export default class TrashLid extends Equipment { 
	constructor(data: Record<string,any>) {
		super(data);
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(this.scale, this.scale);
		this.sprite.invertY = true;
		this.sprite.visible = false;
        this.sprite.active = false;
        this.sprite.addAI(TrashLidController, {});
        this.sprite.setTrigger("enemies", InGame_Events.PROJECTILE_HIT_ENEMY, null);
	}

	doAttack(direction: Vec2) {
	    // this.sprite.position.set(this.sprite.position.x + (20*direction.x), this.sprite.position.y + (20*direction.y));
		// (<AnimatedSprite>this.projectileSprite).animation.play("ATTACK", false);
		// this.sprite.visible = true;
		this.sprite.active = true;

		// // swingDir is specific to the shovel since it toggles whether its
		// // swing up->down or down->up 
		// this.sprite.tweens.add('swingdown', Tweens.swing(this.sprite, this.swingDir))
		// this.sprite.tweens.play('swingdown');
		// this.projectileSprite.rotation = -this.sprite.rotation;
		// this.projectileSprite.visible = true;
		// this.projectileSprite.active = true;
		this.sprite.tweens.add('trashLidThrow', Tweens.trashLidThrow(this.projectileSprite.position, direction, this.cooldown/2, this.sprite.rotation))
		this.sprite.tweens.play('trashLidThrow');


	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
		// TODO: See if sprite position looks better with this additional offset
		this.sprite.position.set(position.x, position.y);
        this.sprite.position.add(new Vec2(+8 * playerLookDirection.x,+8 *playerLookDirection.y));
		this.projectileSprite.position.set(position.x, position.y);
	}

	finishAttack() {
		this.swingDir *= -1;
		this.sprite.tweens.stopAll();
		// this.sprite.visible = false;
		this.sprite.active = false;
	}
}