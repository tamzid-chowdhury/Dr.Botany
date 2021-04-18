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
import Walk from "./EnemyStates/Walk"




export enum EnemyStates {
	IDLE = "idle",
	WALK = "walk",
    ATTACKING = "attacking",
	PREVIOUS = "previous"
}

export default class EnemyController extends StateMachineAI implements BattlerAI {
    owner: AnimatedSprite;
    health: number;
    direction: Vec2 = Vec2.ZERO;
    speed: number = 20;
    player: GameNode;
    attackRange: number;
    type: String; 

    damage(damage: number) : void {
        this.health -= damage;

        if(this.health <= 0) {
            this.owner.animation.play("DYING", false, InGame_Events.ENEMY_DIED);
            setTimeout(() => {
                let ownerPosition = this.owner.position.clone();
                this.owner.destroy()
                if(Math.random() < 0.9) {
                    if(this.type == "Upper"){
                        this.emitter.fireEvent(InGame_Events.SPAWN_UPPER, {position: ownerPosition});
                    }
                    if(this.type == "Downer"){
                        this.emitter.fireEvent(InGame_Events.SPAWN_DOWNER, {position: ownerPosition});
                    }
                }
            }, 700)
            this.owner.setAIActive(false, {});
            this.owner.isCollidable = false;
            


        }
    };

    initializeAI(owner:AnimatedSprite, options:Record<string, any>) {
        this.owner = owner;
        this.health = options.health;
        this.player = options.player;
        this.speed = options.speed;
        this.type = options.type; 
        console.log(this.owner);

        // have to add some properties for each enemy   I don't know if idle is necessary...
        let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);

        this.initialize(EnemyStates.WALK);


    }

    changeState(stateName: string): void {
		super.changeState(stateName);
	}

    update(deltaT: number): void {
		
        if (this.getOwnerPostion().x + 3 <= this.getPlayerPosition().x) { 
            this.owner.invertX = true; 
		}
		else {
			this.owner.invertX = false;
		}
        super.update(deltaT);
        
	}

    getPlayerPosition(): Vec2 {
        return this.player.position;
    }

    getOwnerPostion(): Vec2 {
        return this.owner.position;
    }
}