import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Equipment from "../Types/items/Equipment";
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
        this.owner.setGroup(PhysicsGroups.PROJECTILE);
        this.subscribeToEvents();
        this.owner.active = false;
    }

    hitEnemy(): void {}

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
        this.throwTimer = new Timer((options.cooldown/2), () => {
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

class PillProjectile {
    direction: Vec2;
	power: number = 0;
    liveTime: number;
    liveTimer: Timer;
    powerLoss: number = 10;
    sprite: Sprite;
    dead: boolean;
    drift: number;
    constructor(sprite: Sprite, cooldown: number) {
        this.sprite = sprite;
        this.liveTime = cooldown;
        this.dead = false;
        this.liveTimer = new Timer(4*this.liveTime, () => {
            this.deactivate();
        });

    }

    update(deltaT: number) {
        if(!this.sprite.active) {
            this.liveTimer.pause();
            this.deactivate();
        }
        if(!this.dead) {
            this.sprite._velocity = this.sprite.getLastVelocity();
            this.sprite._velocity.normalize();
            this.sprite._velocity.rotateCCW(this.drift * 0.01);
            this.sprite._velocity.mult(new Vec2(this.power ,this.power ));
            this.sprite.move(this.sprite._velocity.scaled(deltaT));
        }

    }

    

    activate(direction: Vec2, position: Vec2, rotation: number, deltaT: number) {
        this.drift = Math.random() < 0.5 ? 1 : -1;
        this.power = 900 ;
        this.direction = direction;
        this.dead = false;
        this.sprite.position.set(position.x, position.y);
        this.sprite.rotation = -rotation;

        this.sprite.active = true;
        this.sprite._velocity = this.direction;
        this.sprite._velocity.normalize();
        this.sprite._velocity.mult(new Vec2(this.power,this.power));
        this.sprite.visible = true;
        
        this.sprite.move(this.sprite._velocity.scaled(deltaT));
        this.liveTimer.reset();
        this.liveTimer.start();
    }

    deactivate() {
        this.sprite.visible = false;
        this.sprite.active = false;
        this.dead = true;
        this.sprite.position.set(-1000, -1000);

    }


}

export class PillBottleController extends ProjectileController {
	owner: AnimatedSprite;
	direction: Vec2;
	power: number = 0;
    cooldown: number;
    returning: boolean;
    powerCurve: number;
    inactivePills: Array<PillProjectile> = [];
    activePills: Array<PillProjectile> = [];
    clipSize: number;
    arrayCursor: number = 0;
	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;
		this.cooldown = options.cooldown;
		// this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.owner.size.x/2, this.owner.size.y/2)));
		this.owner.active = false;
		this.owner.setGroup(PhysicsGroups.PROJECTILE);
		this.subscribeToEvents();
        let pillSprites = options.clip;
        this.clipSize = options.clip.length;
        for(let p of pillSprites) {
                        
            this.inactivePills.push(new PillProjectile(p, this.cooldown));

        }

	}

    recycle(deadPill: PillProjectile): void {
        let pill = this.activePills.shift();
        if(pill !== undefined) {
            this.inactivePills.push(pill);

        }
    }

	activate(options: Record<string, any>): void {}

	handleEvent(event: GameEvent): void {

    }

	update(deltaT: number): void {

        // for(let p of this.activePills) {
        //     if(p.dead) {
        //         // this.recycle(p);
        //     }
        //     else {
        //         p.update(deltaT)

        //     }
           
        // }

        for(let p of this.inactivePills) {
            if(!p.dead) {
                p.update(deltaT)

            }
        }
	}

    fire(direction: Vec2, deltaT: number) {
        if(this.arrayCursor === this.clipSize-1) this.arrayCursor = 0;
        this.inactivePills[this.arrayCursor].activate(direction.clone(), this.owner.position, this.owner.rotation, deltaT);
        this.arrayCursor++;
        // if(this.inactivePills.length > 0) {
        //     let pill = this.inactivePills.pop();
        //     this.activePills.push(pill);
        //     pill.activate(direction.clone(), this.owner.position, this.owner.rotation, deltaT);
        // }
    }



	destroy(): void {

    }

	subscribeToEvents(): void {

	}
}