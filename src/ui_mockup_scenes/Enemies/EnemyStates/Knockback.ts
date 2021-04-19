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
		// (<AnimatedSprite>this.owner).animation.play("WALK", true);
		this.playerSize = (<AnimatedSprite>this.parent.player).size;
		this.force = this.parent.knockBackDir.scale(500, 500);
		this.parent.velocity.add(this.force);
	}
	// TODO: Velocity Tween
	update(deltaT: number): void {
		this.parent.velocity.add(new Vec2(-this.parent.velocity.x/24, -this.parent.velocity.y/24));
		this.owner.move(this.parent.velocity.scaled(deltaT));
		console.log(this.parent.velocity.x, this.parent.velocity.y);
		this.parent.knockBackTimer --;
		super.update(deltaT);

	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}