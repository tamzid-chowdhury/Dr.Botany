import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { InGame_Events } from "../../Utils/Enums";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Walk extends EnemyState {
	playerSize: Vec2;
	onEnter(): void {
		this.parent.currentStateName = EnemyStates.WALK;
		(<AnimatedSprite>this.owner).animation.play("WALK", true);
		this.playerSize = (<AnimatedSprite>this.parent.player).size;
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if (this.parent.getOwnerPostion().x + 3 <= this.parent.getPlayerPosition().x) { 
			this.parent.owner.invertX = true; 
		}
		else {
			this.parent.owner.invertX = false;
		}

		let ownerPosX = this.parent.getOwnerPostion().x;
		let ownerPosY = this.parent.getOwnerPostion().y;

		let playerPosX = this.parent.getPlayerPosition().x;
		let playerPosY = this.parent.getPlayerPosition().y;
		// add a condition of enemies reaching the tree or the player
		// Fix the > operator to area of the player x and y (to fix shaking)
		this.parent.direction.x = ((playerPosX > ownerPosX) ? 1 : -1);
		this.parent.direction.y = ((playerPosY > ownerPosY) ? 1 : -1);

		let dirToPlayer = this.parent.getOwnerPostion().dirTo(this.parent.getPlayerPosition());
		// this.owner._velocity = dirToPlayer;
		this.parent.velocity = dirToPlayer;
		// if (Math.abs(ownerPosX - playerPosX) < 16 && Math.abs(ownerPosY - playerPosY) < 16) {
		// 	// This has to be handled through Player			
		// 	this.owner._velocity.x = 0;
		// 	this.owner._velocity.y = 0;
			
		// }
		if(Math.abs(ownerPosX - playerPosX) < (this.playerSize.x / 4) ) this.parent.velocity.x = 0;
		if(Math.abs(ownerPosY - playerPosY) < (this.playerSize.y / 4) + 6) this.parent.velocity.y = 0;
		this.parent.velocity.normalize();
		this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
		this.owner.move(this.parent.velocity.scaled(deltaT));

		// console.log(this.owner.onCeiling, this.owner.onGround, this.owner.onWall)


		// if the coordinates are within its range, go to attack depending on its class

		

	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}