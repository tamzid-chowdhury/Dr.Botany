import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Walk extends EnemyState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("WALK", true);

	}

	update(deltaT: number): void {
		super.update(deltaT);
        // let playerPos = this.parent.getPlayerPosition();
        // if(this.parent.direction.isZero()) {
        //     this.parent.direction = playerPos;
        // }
		//this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}