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
import Damaged from "./EnemyStates/DAMAGED";
import Walk from "./EnemyStates/Walk";
import * as Tweens from "../Utils/Tweens";
import Timer from "../../Wolfie2D/Timing/Timer";

import { PhysicsGroups } from "../Utils/PhysicsOptions";
import Enemy from "../Types/enemies/Enemy";
import ProjectileEnemy from "../Types/enemies/ProjectileEnemy";



export enum EnemyStates {
	IDLE = "idle",
	WALK = "walk",
	DAMAGED = "DAMAGED",
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
    plant: GameNode;
    attackRange: number;
    dropType: string; 
    attackType: string;
    controllerType: string = 'Enemy'; 
    velocity: Vec2 = Vec2.ZERO;
    knockBackGuard: number = 1;

    knockBackDir: Vec2 = new Vec2(0,0);
    knockBackTimer: number = 0;
    pauseExecution: boolean = false;
    options:Record<string, any>;
    invuln: boolean = false;
    damageGuard: Timer;
    currentStateName: string;


    container: Enemy;

    damage(damage: number) : void {
        this.health -= damage;
    };

    initializeAI(owner:AnimatedSprite, options:Record<string, any>) {
        this.owner = owner;
        this.health = options.health;
        this.player = options.player;
        this.plant = options.plant;
        this.speed = options.speed;
        this.dropType = options.type; 
        this.attackType = options.attackType; 
        this.options = options;
        this.container = options.container;
        let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);
        let knockback = new Damaged(this, owner);
		this.addState(EnemyStates.DAMAGED, knockback);
        let dying = new Dying(this, owner);
        this.addState(EnemyStates.DYING, dying)

        this.initialize(EnemyStates.IDLE);
        this.receiver.subscribe([InGame_Events.ENEMY_DEATH_ANIM_OVER, InGame_Events.TOGGLE_PAUSE, InGame_Events.GAME_OVER])


    }

    destroy(): void {
    }

    changeState(stateName: string): void {
		super.changeState(stateName);
	}

    handleEvent(event: GameEvent): void {
        
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
        }

    }

    update(deltaT: number): void {
        super.update(deltaT);

        if(!this.pauseExecution && this.currentStateName != EnemyStates.DYING) {
            if(this.attackType === 'projectile') {
                (<ProjectileEnemy>this.container).updateProjectiles(deltaT);
                
            }
            
            if(this.health <= 0) this.changeState(EnemyStates.DYING);
            if(this.knockBackGuard > 1) this.knockBackGuard--;
            if(this.knockBackTimer < 0) this.changeState(EnemyStates.WALK);
        }
	}

    doDamage(direction: Vec2, damage: number, knockback: number): void {
        if(!this.invuln) {
            this.damage(damage);
            this.invuln = true;
            this.damageGuard = new Timer(100, () => {
                this.invuln = false;
    
            });
            this.damageGuard.start();
            this.knockBackDir = direction.clone();
            this.knockBackTimer = 50;
            if(this.knockBackGuard <= 1) this.changeState(EnemyStates.DAMAGED);
        }


        
    }

    wake(player: GameNode, plant:GameNode): void {
        this.player = player;
        this.plant = plant;
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

    getPlantPosition(): Vec2 {
        return this.plant.position;
    }

    getOwnerPosition(): Vec2 {
        return this.owner.position;
    }

    increaseSpeed(): void {
        this.speed = this.speed * 2;
    }
    decreaseSpeed(): void {
        this.speed = this.speed / 2;
    }
}