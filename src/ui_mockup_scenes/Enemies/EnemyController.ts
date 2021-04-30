import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattlerAI from "../Controllers/BattlerAI";
import { InGame_Events } from "../Utils/Enums";
import Dying from "./EnemyStates/Dying";
import EnemyState from "./EnemyStates/EnemyState";
import Idle from "./EnemyStates/Idle"
import Knockback from "./EnemyStates/Knockback";
import Walk from "./EnemyStates/Walk";
import * as Tweens from "../Utils/Tweens";



export enum EnemyStates {
	IDLE = "idle",
	WALK = "walk",
	KNOCKBACK = "knockback",
    ATTACKING = "attacking",
	PREVIOUS = "previous",
    DYING = "dying"
}

export default class EnemyController extends StateMachineAI implements BattlerAI {
    owner: AnimatedSprite;
    health: number;
    direction: Vec2 = Vec2.ZERO;
    speed: number = 30;
    player: GameNode;
    attackRange: number;
    type: String; 
    velocity: Vec2 = Vec2.ZERO;
    knockBackGuard: number = 1;

    knockBackDir: Vec2 = new Vec2(0,0);
    knockBackTimer: number = 0;
    damage(damage: number) : void {
        this.health -= damage;
    };

    initializeAI(owner:AnimatedSprite, options:Record<string, any>) {
        this.owner = owner;
        this.health = options.health;
        this.player = options.player;
        this.speed = options.speed;
        this.type = options.type; 
        

        // have to add some properties for each enemy   I don't know if idle is necessary...
        let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);
        let knockback = new Knockback(this, owner);
		this.addState(EnemyStates.KNOCKBACK, knockback);
        let dying = new Dying(this, owner);
        this.addState(EnemyStates.DYING, dying)

        this.initialize(EnemyStates.WALK);
        this.receiver.subscribe([InGame_Events.ENEMY_DEATH_ANIM_OVER])

    }

    destroy(): void {
    }

    changeState(stateName: string): void {
		super.changeState(stateName);
	}

    update(deltaT: number): void {
        super.update(deltaT);
        if(this.knockBackGuard > 1) this.knockBackGuard--;
        
        if(this.knockBackTimer < 0) this.changeState(EnemyStates.WALK);
        if (this.getOwnerPostion().x + 3 <= this.getPlayerPosition().x) { 
            this.owner.invertX = true; 
		}
		else {
			this.owner.invertX = false;
		}
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            // if(event.type === InGame_Events.ENEMY_DEATH_ANIM_OVER) {

                

            // }
        }
        
	}

    doKnockBack(direction: Vec2): void {
        this.knockBackDir = direction.clone();
        this.knockBackTimer = 50;
        if(this.knockBackGuard <= 1) this.changeState(EnemyStates.KNOCKBACK);
        
    }

    getPlayerPosition(): Vec2 {
        return this.player.position;
    }

    getOwnerPostion(): Vec2 {
        return this.owner.position;
    }

    increaseSpeed(): void {
        this.speed = this.speed * 2;
    }
    decreaseSpeed(): void {
        this.speed = this.speed / 2;
    }
}