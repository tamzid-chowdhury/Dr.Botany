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

        let ownerPosX = this.parent.getOwnerPostion().x;
        let ownerPosY = this.parent.getOwnerPostion().y;

        let playerPosX = this.parent.getPlayerPosition().x;
        let playerPosY = this.parent.getPlayerPosition().y;
        // add a condition of enemies reaching the tree or the player
		// Fix the > operator to area of the player x and y (to fix shaking)
        this.parent.direction.x = ((playerPosX  > ownerPosX) ? 1 : -1);
        this.parent.direction.y = ((playerPosY  > ownerPosY) ? 1 : -1);
		if(Math.abs(ownerPosX - playerPosX) < 10) {
			this.parent.direction.x = 0;
		}
		if(Math.abs(ownerPosY - playerPosY) < 10) {
			this.parent.direction.y = 0;
		}
		
		this.owner._velocity.x = this.parent.direction.x;
        this.owner._velocity.y = this.parent.direction.y;
        this.owner._velocity.normalize();
		this.owner._velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
		this.owner.move(this.owner._velocity.scaled(deltaT));

		// if the coordinates are within its range, go to attack depending on its class
        
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}