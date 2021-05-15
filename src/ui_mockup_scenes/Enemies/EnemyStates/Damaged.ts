import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";

export default class Damaged extends EnemyState {
	playerSize: Vec2;
	force: Vec2;
	onEnter(): void {
		this.parent.currentStateName = EnemyStates.DAMAGED;
		
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemy_hit", loop: false, holdReference: true});
		
		if (this.parent.health > 0) {
			(<AnimatedSprite>this.owner).animation.play("HIT", true);
		}
		else {
			// this.finished(EnemyStates.DYING);

		}
		this.playerSize = (<AnimatedSprite>this.parent.player).size;
		this.force = this.parent.knockBackDir.scale(500 / this.parent.knockBackGuard, 500 / this.parent.knockBackGuard);
		this.parent.velocity.add(this.force);
	}

	update(deltaT: number): void {
		
		this.parent.velocity.add(new Vec2(-this.parent.velocity.x / 6, -this.parent.velocity.y / 6));
		this.owner.move(this.parent.velocity.scaled(deltaT));
		this.parent.knockBackTimer -= 3;
		if (this.parent.knockBackTimer <= 0 && this.parent.health > 0) {
			this.parent.knockBackGuard = 20;

			this.finished(EnemyStates.WALK);
		} 
		super.update(deltaT);

	}

	onExit(): Record<string, any> {
		return {};
	}
}