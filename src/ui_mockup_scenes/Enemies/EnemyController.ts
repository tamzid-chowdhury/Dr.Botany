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
import Idle from "./EnemyStates/Idle"
import Knockback from "./EnemyStates/Knockback";
import Walk from "./EnemyStates/Walk"




export enum EnemyStates {
	IDLE = "idle",
	WALK = "walk",
	KNOCKBACK = "knockback",
    ATTACKING = "attacking",
	PREVIOUS = "previous"
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

    knockBackDir: Vec2 = new Vec2(0,0);
    knockBackTimer: number = 0;
    damage(damage: number) : void {
        this.health -= damage;
        if(this.health <= 0) {
           
            // setTimeout(() => {
            //     let ownerPosition = this.owner.position.clone();
            //     this.owner.destroy();
            //     if(Math.random() < 0.9) {
            //         if(this.type == "Upper"){
            //             this.emitter.fireEvent(InGame_Events.SPAWN_UPPER, {position: ownerPosition});
            //         }
            //         if(this.type == "Downer"){
            //             this.emitter.fireEvent(InGame_Events.SPAWN_DOWNER, {position: ownerPosition});
            //         }
            //     }
            // }, 600)
            // this.owner.setAIActive(false, {});
            // this.owner.isCollidable = false;
        }
        // else {
        //     this.owner.animation.play("HIT", false);
        // }
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

        this.initialize(EnemyStates.WALK);
        this.receiver.subscribe([InGame_Events.ENEMY_DEATH_ANIM_OVER])

    }

    changeState(stateName: string): void {
		super.changeState(stateName);
	}

    update(deltaT: number): void {
        super.update(deltaT);
        
        if(this.knockBackTimer < 0) this.changeState(EnemyStates.WALK);
        if (this.getOwnerPostion().x + 3 <= this.getPlayerPosition().x) { 
            this.owner.invertX = true; 
		}
		else {
			this.owner.invertX = false;
		}
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            if(event.type === InGame_Events.ENEMY_DEATH_ANIM_OVER) {
                let ownerPosition = this.owner.position.clone();
                if(Math.random() < 0.9) {
                    if(this.type == "Upper"){
                        this.emitter.fireEvent(InGame_Events.SPAWN_UPPER, {position: ownerPosition});
                    }
                    if(this.type == "Downer"){
                        this.emitter.fireEvent(InGame_Events.SPAWN_DOWNER, {position: ownerPosition});
                    }
                }
                this.owner.setAIActive(false, {});
                this.owner.isCollidable = false;
                this.owner.destroy();

            }
        }
        
	}

    doKnockBack(direction: Vec2): void {
        this.knockBackDir = direction.clone();
        this.knockBackTimer = 50;
        this.changeState(EnemyStates.KNOCKBACK);
    }

    getPlayerPosition(): Vec2 {
        return this.player.position;
    }

    getOwnerPostion(): Vec2 {
        return this.owner.position;
    }

    increaseSpeed(): void {
        this.speed = this.speed * 4;
    }
}