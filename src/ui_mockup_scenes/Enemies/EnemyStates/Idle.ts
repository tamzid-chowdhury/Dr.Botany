import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Idle extends EnemyState {
	onEnter(): void {}

	handleInput(event: GameEvent): void {
		super.handleInput(event);
	}

	update(deltaT: number): void {	
		super.update(deltaT);
		// if(this.owner.active){
		// 	this.finished(EnemyStates.WALK);
		// }
	}

	onExit(): Record<string, any> {
		return {};
	}
}

// IGNORE THIS FOR NOW 