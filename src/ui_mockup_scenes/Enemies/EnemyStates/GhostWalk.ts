import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";

export default class Ghostwalk extends EnemyState {
    ghostingTimer: Timer;
    onEnter(): void {
		this.parent.currentStateName = EnemyStates.GHOSTWALK;
        this.ghostingTimer = new Timer(5000, null, false);
        (<AnimatedSprite>this.owner).animation.playIfNotAlready("IDLE", true); // ghosting

	}

	handleInput(event: GameEvent): void {
		super.handleInput(event);
        let playerPos = this.parent.getPlayerPosition();
        let plantPos = this.parent.getPlantPosition();
        let ownerPos = this.parent.getOwnerPosition();

        
	}

	update(deltaT: number): void {	
		super.update(deltaT);
		
	}

	onExit(): Record<string, any> {
		return {};
	}
}

// IGNORE THIS FOR NOW 