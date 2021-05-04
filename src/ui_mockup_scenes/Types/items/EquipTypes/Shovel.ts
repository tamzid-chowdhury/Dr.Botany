import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Equipment from "../Equipment";
import * as Tweens from "../../../Utils/Tweens";
import ProjectileController from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";

export default class Shovel extends Equipment { 
	constructor(data: Record<string,any>) {
		super(data);
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
		this.projectileSprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(this.scale, this.scale);
		this.sprite.invertY = true;
		this.sprite.visible = false;
		this.projectileSprite.visible = false;
        this.projectileSprite.active = false;
        this.projectileSprite.addAI(ProjectileController, {});
        this.projectileSprite.setTrigger("enemies", InGame_Events.PROJECTILE_HIT_ENEMY, null);
	}

	doAttack(direction: Vec2) {
	    this.projectileSprite.position.set(this.sprite.position.x + (20*direction.x), this.sprite.position.y + (20*direction.y));
		(<AnimatedSprite>this.projectileSprite).animation.play("ATTACK", false);
		this.projectileSprite.rotation = -this.sprite.rotation;
		this.projectileSprite.visible = true;
		this.projectileSprite.active = true;

		// swingDir is specific to the shovel since it toggles whether its
		// swing up->down or down->up 
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

	finishAttack() {
		this.swingDir *= -1;
		this.projectileSprite.tweens.stopAll();
		this.projectileSprite.visible = false;
		this.projectileSprite.active = false;
	}
}