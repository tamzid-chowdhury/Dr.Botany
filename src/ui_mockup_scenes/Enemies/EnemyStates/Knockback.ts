import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { InGame_Events } from "../../Utils/Enums";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Knockback extends EnemyState {
	playerSize: Vec2;
	force: Vec2;
	onEnter(): void {
		if (this.parent.health > 0) {
			(<AnimatedSprite>this.owner).animation.play("HIT", false);
		}
		else {
			this.finished(EnemyStates.DYING);

		}
		this.playerSize = (<AnimatedSprite>this.parent.player).size;
		this.force = this.parent.knockBackDir.scale(500, 500);
		this.parent.velocity.add(this.force);
	}
	// TODO: Velocity Tween
	update(deltaT: number): void {
		this.parent.velocity.add(new Vec2(-this.parent.velocity.x / 24, -this.parent.velocity.y / 24));
		this.owner.move(this.parent.velocity.scaled(deltaT));
		this.parent.knockBackTimer--;
		if (this.parent.knockBackTimer <= 0 && this.parent.health > 0) this.finished(EnemyStates.WALK);
		super.update(deltaT);

	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();

		return {};
	}
}