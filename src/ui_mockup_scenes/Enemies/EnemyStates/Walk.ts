import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { InGame_Events } from "../../Utils/Enums";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Walk extends EnemyState {
	playerSize: Vec2;
	plantSize: Vec2;
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.playIfNotAlready("WALK", true);
		this.playerSize = (<AnimatedSprite>this.parent.player).size;
		this.plantSize = (<AnimatedSprite>this.parent.plant).size;
	}

	update(deltaT: number): void {
		super.update(deltaT);
		

		let ownerPosX = this.parent.getOwnerPosition().x;
		let ownerPosY = this.parent.getOwnerPosition().y;

		let playerPosX = this.parent.getPlayerPosition().x;
		let playerPosY = this.parent.getPlayerPosition().y;

		let plantPosX = this.parent.getPlantPosition().x;
		let plantPosY = this.parent.getPlantPosition().y;

		let distanceToPlayer = Math.sqrt(Math.pow(ownerPosX - playerPosX, 2) + Math.pow(ownerPosY - playerPosY, 2));
		let distanceToPlant = Math.sqrt(Math.pow(ownerPosX - plantPosX, 2) + Math.pow(ownerPosY - plantPosY, 2));


		if (distanceToPlant > distanceToPlayer) {   // moving to the player
			
			this.parent.direction.x = (this.parent.owner.invertX ? -1 : 1);
			
			let dirToPlayer = this.parent.getOwnerPosition().dirTo(this.parent.getPlayerPosition());
			dirToPlayer.x = this.parent.direction.x;
			
			if(playerPosX + 30 <= ownerPosX) {
				this.parent.direction.x = -1
				this.parent.owner.invertX = true;
			}
		
			else if(playerPosX - 30 >= ownerPosX) {
				this.parent.direction.x = 1
				this.parent.owner.invertX = false;
			}
			
			
			// let dirToPlayer = this.parent.getOwnerPostion().dirTo(this.parent.getPlayerPosition());
			
			// this.parent.velocity = dirToPlayer;
			this.parent.velocity = dirToPlayer;

			// if (Math.abs(ownerPosX - playerPosX) + 1000 < (this.playerSize.x / 4)) this.parent.velocity.x = -this.parent.velocity.x;
			// if (Math.abs(ownerPosY - playerPosY) + 1000 < (this.playerSize.y / 4) + 6) this.parent.velocity.y = -this.parent.velocity.y;
			if (Math.abs(ownerPosX - playerPosX) > 1000) { // when the enemy and player distance is far away enough
				this.parent.velocity.x = -this.parent.velocity.x;
			}


			if (Math.abs(ownerPosY - playerPosY) > 1000) {
				this.parent.velocity.y = -this.parent.velocity.y;
			}
			this.parent.velocity.normalize();
			this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
			this.owner.move(this.parent.velocity.scaled(deltaT));
			if (this.parent.velocity.isZero()) {
				// when it reaches the player
				// Which I dont think Ill need
			}
		}
		else {  // moving to the plant
			

			let dirToPlayer = this.parent.getOwnerPosition().dirTo(this.parent.getPlantPosition());
			this.parent.velocity = dirToPlayer;

			if (Math.abs(ownerPosX - plantPosX) < (this.plantSize.x / 4) + 6) this.parent.velocity.x = 0;
			if (Math.abs(ownerPosY - plantPosY) < (this.plantSize.y / 4) + 6) this.parent.velocity.y = 0;
			this.parent.velocity.normalize();
			this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
			this.owner.move(this.parent.velocity.scaled(deltaT));
			if (this.parent.velocity.isZero()) {
				// when it reaches the plant
				this.emitter.fireEvent(InGame_Events.ENEMY_ATTACK_PLANT);
			}
		}

		// if the coordinates are within its range, go to attack depending on its class
		if ((this.owner.onCeiling || this.owner.onGround || this.owner.onWall) && this.parent.velocity.isZero()) {
			// this.owner.disablePhysics();
			// this.text.tweens.add("itemIncrement", Tweens.itemIncrement(this.textBackdrop.fontSize))
			// something like this
			console.log("on colliding")
		}



	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}