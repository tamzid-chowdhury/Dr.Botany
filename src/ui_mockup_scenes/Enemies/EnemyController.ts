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
import { PhysicsGroups } from "../Utils/PhysicsOptions";



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
    speed: number;
    player: GameNode;
    attackRange: number;
    dropType: String; 
    controllerType: String = 'Enemy'; 
    velocity: Vec2 = Vec2.ZERO;
    knockBackGuard: number = 1;

    knockBackDir: Vec2 = new Vec2(0,0);
    knockBackTimer: number = 0;
    pauseExecution: boolean = false;
    options:Record<string, any>;

    damage(damage: number) : void {
        this.health -= damage;
    };

    initializeAI(owner:AnimatedSprite, options:Record<string, any>) {
        this.owner = owner;
        this.health = options.health;
        this.player = options.player;
        this.speed = options.speed;
        this.dropType = options.type; 
        this.options = options;

        // have to add some properties for each enemy   I don't know if idle is necessary...
        let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);
        let knockback = new Knockback(this, owner);
		this.addState(EnemyStates.KNOCKBACK, knockback);
        let dying = new Dying(this, owner);
        this.addState(EnemyStates.DYING, dying)

        this.initialize(EnemyStates.IDLE);
        this.receiver.subscribe([InGame_Events.ENEMY_DEATH_ANIM_OVER, InGame_Events.TOGGLE_PAUSE, InGame_Events.GAME_OVER, InGame_Events.ENEMY_HIT_WALL])

    }

    destroy(): void {
    }

    changeState(stateName: string): void {
		super.changeState(stateName);
	}

    handleEvent(event: GameEvent): void {
        console.log(this.owner.active);
        
        if(this.owner.active) {
            if(event.type === InGame_Events.TOGGLE_PAUSE || event.type === InGame_Events.GAME_OVER) {
                if(this.pauseExecution) {
                    this.pauseExecution = false;
                    this.changeState(EnemyStates.WALK);
                }
                else {
                    this.pauseExecution = true;
                    this.changeState(EnemyStates.IDLE);
                }
    
                
            }
            if(event.type === InGame_Events.ENEMY_HIT_WALL) {
                console.log("enemy hit the wall");
            }
        }

    }

    update(deltaT: number): void {
        super.update(deltaT);
        if(!this.pauseExecution && this.owner.active) {
            if(this.knockBackGuard > 1) this.knockBackGuard--;
            if(this.knockBackTimer < 0) this.changeState(EnemyStates.WALK);
        }
        while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            if(event.type === InGame_Events.ENEMY_HIT_WALL) {
                this.handleEvent(event);
            }
        }
	}

    doKnockBack(direction: Vec2): void {
        this.knockBackDir = direction.clone();
        this.knockBackTimer = 50;
        if(this.knockBackGuard <= 1) this.changeState(EnemyStates.KNOCKBACK);
        
    }

    wake(player: GameNode): void {
        this.player = player;
        this.health = this.options.health;
        this.speed = this.options.speed;
        this.changeState(EnemyStates.WALK);
    } 

    sleep(): void {
        this.changeState(EnemyStates.IDLE);
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