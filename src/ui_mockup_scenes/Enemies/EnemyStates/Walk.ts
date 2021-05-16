import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { InGame_Events } from "../../Utils/Enums";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"
import * as Tweens from "../../Utils/Tweens"
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import Timer from "../../../Wolfie2D/Timing/Timer";
import ProjectileEnemy from "../../Types/enemies/ProjectileEnemy";

export default class Walk extends EnemyState {
	playerSize: Vec2;
	plantSize: Vec2;
	distBuffer: number = 50; // bias the enemies a little more to attack the player
	doRam: boolean = false;
	doFire: boolean = false;
	ramAttackTimer: Timer;
	projectileAttackTimer: Timer;
	flingAttackTimer: Timer;
	bob: number = 0;
	flingRotation: number = 0;
	doFling: boolean = false;
	onEnter(): void {
		this.parent.currentStateName = EnemyStates.WALK;
		(<AnimatedSprite>this.owner).animation.playIfNotAlready("WALK", true);
		this.playerSize = (<AnimatedSprite>this.parent.player).size;
		this.plantSize = (<AnimatedSprite>this.parent.plant).size;
		this.ramAttackTimer = new Timer(400, () => {
			this.doRam = false;
		})

		this.projectileAttackTimer = new Timer(2000, () => {
			this.doFire = false;
		})

		this.flingAttackTimer = new Timer(2000, () => {
			(<AnimatedSprite>this.owner).animation.play("SQUISH");
			this.doFling = false;
		})
	}

	update(deltaT: number): void {
		super.update(deltaT);
		let plantPos = this.parent.getPlantPosition();
		let playerPos = this.parent.getPlayerPosition();
		let ownerPos = this.parent.getOwnerPosition();

		if(this.parent.attackType === "ram") {
			if(this.doRam) {
				this.handleRamAttack(deltaT);

			}
			else {
				this.handleRamMove(plantPos, playerPos, ownerPos, deltaT);

			}	
		}
		else if(this.parent.attackType === "projectile") {
			// takes care of firing and movement
			this.handleProjectileMove(playerPos, ownerPos, deltaT);
		}

		else if(this.parent.attackType === "fling") {
			// takes care of firing and movement
			if(this.doFling) {
				this.handleFlingAttack(deltaT);

			}
			else {
				this.handleFlingMove(playerPos, ownerPos, deltaT);

			}	
		}

		// if the coordinates are within its range, go to attack depending on its class
		if (this.owner.onCeiling) {
			// this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "enemy_jump", holdReference: true });
			this.owner.tweens.add("enemyHopOver", Tweens.enemyHopOver(this.owner.position, "up", this.owner));
			this.owner.tweens.play("enemyHopOver");
			
		}
		else if(this.owner.onGround) {
			// this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "enemy_jump", holdReference: true });
			this.owner.tweens.add("enemyHopOver", Tweens.enemyHopOver(this.owner.position, "down", this.owner));
			this.owner.tweens.play("enemyHopOver");
			
		}
		else if(this.owner.onWall && this.parent.direction.x > 0) {
			// this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "enemy_jump", holdReference: true });
			this.owner.tweens.add("enemyHopOver", Tweens.enemyHopOver(this.owner.position, "right", this.owner));
			this.owner.tweens.play("enemyHopOver");
		}
		else if(this.owner.onWall && this.parent.direction.x < 0) {
			// this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "enemy_jump", holdReference: true });
			this.owner.tweens.add("enemyHopOver", Tweens.enemyHopOver(this.owner.position, "left", this.owner));
			this.owner.tweens.play("enemyHopOver");
		}



	}

	handleRamMove(plantPos: Vec2, playerPos: Vec2, ownerPos: Vec2, deltaT: number): void {
		let ownerPosX = ownerPos.x;
		let ownerPosY = ownerPos.y;

		let playerPosX = playerPos.x;
		let playerPosY = playerPos.y;

		let plantPosX = plantPos.x;
		let plantPosY = plantPos.y;

		let distanceToPlayer = Math.sqrt(Math.pow(ownerPosX - playerPosX, 2) + Math.pow(ownerPosY - playerPosY, 2));
		let distanceToPlant = Math.sqrt(Math.pow(ownerPosX - plantPosX, 2) + Math.pow(ownerPosY - plantPosY, 2));
		
		if ((distanceToPlant + this.distBuffer) > distanceToPlayer) {   // moving to the player
			
			this.parent.direction.x = (this.parent.owner.invertX ? -1 : 1);
			
			let dirToPlayer = ownerPos.dirTo(playerPos);
			// dirToPlayer.x = this.parent.direction.x;
			
			if(playerPosX + 15 <= ownerPosX) {
				this.parent.direction.x = -1
				this.parent.owner.invertX = true;
			}
		
			else if(playerPosX - 15 >= ownerPosX) {
				this.parent.direction.x = 1
				this.parent.owner.invertX = false;
			}
			
			this.parent.velocity = dirToPlayer;

			this.parent.velocity.normalize();
			this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));


			this.owner.move(this.parent.velocity.scaled(deltaT));
			
		}
		else {  // moving to the plant
			

			let dir = ownerPos.dirTo(plantPos);
			this.parent.velocity = dir;

			this.parent.velocity.normalize();
			this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
			if (distanceToPlant <= (this.plantSize.x / 2) || distanceToPlant <= (this.plantSize.y / 2) ){
				this.parent.velocity.x += 5*dir.x;
				this.parent.velocity.y += 5*dir.y;
				this.doRam = true;
				this.ramAttackTimer.reset();				
				this.ramAttackTimer.start();	
			} 

			this.owner.move(this.parent.velocity.scaled(deltaT));

		}
	}

	handleRamAttack(deltaT: number): void {

		this.owner.move(this.parent.velocity.scaled(deltaT));
		this.parent.velocity.x *= 0.97;
		this.parent.velocity.y *= 0.97;

	}

	handleFlingAttack(deltaT: number): void {

		this.owner.move(this.parent.velocity.scaled(deltaT));
		this.parent.velocity.x *= 0.97;
		this.parent.velocity.y *= 0.97;

	}

	handleFlingMove(playerPos: Vec2, ownerPos: Vec2, deltaT: number): void {
		let dir = ownerPos.dirTo(playerPos);

		let rotation: Vec2 = playerPos.dirTo(this.owner.position);
        (<AnimatedSprite>this.owner).rotation = Vec2.UP.angleToCCW(rotation);
		this.parent.velocity = dir;
		this.parent.velocity.normalize();
		this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
		if(!this.doFling) {
			this.parent.velocity.x += 4*dir.x;
			this.parent.velocity.y += 4*dir.y;
			(<AnimatedSprite>this.owner).animation.play("UNSQUISH");
			
			this.doFling = true;
			this.flingAttackTimer.reset();				
			this.flingAttackTimer.start();	
		}

		this.owner.move(this.parent.velocity.scaled(deltaT));

	}

	handleProjectileMove(playerPos: Vec2, ownerPos: Vec2, deltaT: number): void {
		let ownerPosX = ownerPos.x;
		let ownerPosY = ownerPos.y;

		let playerPosX = playerPos.x;
		let playerPosY = playerPos.y;



		let dir;

		this.parent.direction.x = (this.parent.owner.invertX ? -1 : 1);
		
		dir = ownerPos.dirTo(playerPos);
		// dir.x = this.parent.direction.x;
		
		if(playerPosX + 15 <= ownerPosX) {
			this.parent.direction.x = -1
			this.parent.owner.invertX = true;
		}
	
		else if(playerPosX - 15 >= ownerPosX) {
			this.parent.direction.x = 1
			this.parent.owner.invertX = false;
		}
		
		this.parent.velocity = dir;

		this.parent.velocity.normalize();

		this.parent.velocity.mult(new Vec2(this.parent.speed, this.parent.speed));

		this.owner.move(this.parent.velocity.scaled(deltaT));
		this.owner.position.y += 0.2* Math.sin(this.bob);
		// this.parent.velocity.y += 5* Math.sin(this.bob);
		this.bob += 0.09;
			


		if(!this.doFire && dir !== undefined) {
			(<ProjectileEnemy>this.parent.container).fire(dir, deltaT);
			this.projectileAttackTimer.start();
			this.doFire = true;


		}


	}

	onExit(): Record<string, any> {
		// (<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}