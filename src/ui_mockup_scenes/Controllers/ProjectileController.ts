import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import { InGame_Events } from "../Utils/Enums";
import { PhysicsGroups } from "../Utils/PhysicsOptions";
import * as Tweens from '../Utils/Tweens'

export default class ProjectileController extends StateMachineAI {
    owner: AnimatedSprite;
    direction: Vec2;
    speed: number = 50;
    attacking: boolean = false;
    // WHAT IF TWO SHOVELS AT ONE TIME POWERUP???? ALTERNATING SWINGS
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.owner.size.x/2, this.owner.size.y/2)));
        this.owner.active = false;
        this.owner.setGroup(PhysicsGroups.PROJECTILE);


        this.subscribeToEvents();
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
		while (this.receiver.hasNextEvent()) {
			let event = this.receiver.getNextEvent();
			if(event.type === InGame_Events.PROJECTILE_HIT_ENEMY) {
				this.owner.active = false;
			}
		}

    }


    destroy(): void {

	}

    subscribeToEvents(): void {
      this.receiver.subscribe([InGame_Events.PROJECTILE_HIT_ENEMY])
    }

}

export class TrashLidController extends ProjectileController {
	owner: AnimatedSprite;
	direction: Vec2;
	returnDirection: Vec2 ;
	power: number = 0;
    throwTimer: Timer;
    cooldown: number;
    returning: boolean;
    powerCurve: number;
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
		this.cooldown = options.cooldown;
		// this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.owner.size.x/2, this.owner.size.y/2)));
		this.owner.addPhysics(new Circle(Vec2.ZERO, this.owner.size.x));
		this.owner.active = false;
		this.owner.setGroup(PhysicsGroups.PROJECTILE);
		this.subscribeToEvents();
        this.throwTimer = new Timer((options.cooldown/2)-10, () => {
            this.attacking = false;
            this.returning = true;
        });
	}

	activate(options: Record<string, any>): void {}

	handleEvent(event: GameEvent): void {}

	update(deltaT: number): void {
        if(this.attacking) {
            this.owner._velocity = this.direction;
            this.owner._velocity.normalize();
            this.owner._velocity.mult(new Vec2(this.power,this.power));
            this.owner.move(this.owner._velocity.scaled(deltaT));
            this.power = this.power / (this.power * this.easeOut(this.powerCurve));
            this.powerCurve += 0.00005
        }
        else if(this.returning && this.returnDirection) {
            if(this.owner.position.distanceTo(this.returnDirection) < this.owner.collisionShape.hh) {
                this.endThrow();
            } 
            let dirToPlayer = this.owner.position.dirTo(this.returnDirection);
            this.owner._velocity = dirToPlayer;
            this.owner._velocity.normalize();
            this.owner._velocity.mult(new Vec2(this.power,this.power));
            this.owner.move(this.owner._velocity.scaled(deltaT));
            this.power = this.power * (this.power * this.easeOut(this.powerCurve));
            this.powerCurve += 0.0001
        }
	}

    beginThrow(direction: Vec2) {
        this.direction = direction.clone();
        this.attacking = true;
        this.throwTimer.start();
        this.power = 450;
        this.powerCurve = 0.0001;
		this.owner.tweens.add('trashLidThrow', Tweens.trashLidThrow(this.cooldown/2, this.owner.rotation))
		this.owner.tweens.play('trashLidThrow');
    }

    easeOut(x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        
    }

    returnToPlayer(direction: Vec2): void {
        this.returnDirection = direction;
        this.power = 450;
        this.powerCurve = 0.0001;
    }

    endThrow(): void {
		this.owner.active = false;
        this.returning = false;
    }

	destroy(): void {

    }

	subscribeToEvents(): void {
	}
}


export class PillBottleController extends ProjectileController {
	owner: AnimatedSprite;
	direction: Vec2;
	power: number = 0;
    throwTimer: Timer;
    cooldown: number;
    returning: boolean;
    powerCurve: number;
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
		this.cooldown = options.cooldown;
		// this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.owner.size.x/2, this.owner.size.y/2)));
		this.owner.addPhysics(new Circle(Vec2.ZERO, this.owner.size.x/4));
		this.owner.active = false;
		this.owner.setGroup(PhysicsGroups.PROJECTILE);
		this.subscribeToEvents();
        this.throwTimer = new Timer((options.cooldown/2)-10, () => {
        });
	}

	activate(options: Record<string, any>): void {}

	handleEvent(event: GameEvent): void {}

	update(deltaT: number): void {
        if(this.attacking) {
            this.owner._velocity = this.direction;
            this.owner._velocity.normalize();
            this.owner._velocity.mult(new Vec2(this.power,this.power));
            this.owner.move(this.owner._velocity.scaled(deltaT));
            this.power = this.power / (this.power * this.easeOut(this.powerCurve));
            this.powerCurve += 0.00005
        }

	}

    beginThrow(direction: Vec2) {
        this.direction = direction.clone();
        this.attacking = true;
        this.throwTimer.start();
        this.power = 450;
        this.powerCurve = 0.0001;
		this.owner.tweens.add('trashLidThrow', Tweens.trashLidThrow(this.cooldown/2, this.owner.rotation))
		this.owner.tweens.play('trashLidThrow');
    }

    easeOut(x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        
    }


    endThrow(): void {
		this.owner.active = false;
        this.returning = false;
    }

	destroy(): void {

    }

	subscribeToEvents(): void {
	}
}