import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import BattlerAI from "../Controllers/BattlerAI";
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
    velocity: Vec2 = Vec2.ZERO;
    direction: Vec2 = Vec2.ZERO;
    speed: number = 20;
    player: GameNode;

    damage(damage: number) : void {

    };

    initializeAI(owner:AnimatedSprite, options:Record<string, any>) {
        this.owner = owner;

        this.health = options.health;

        // this.weapon = options.weapon;

        this.player = options.player;



        // have to add some properties for each enemy
        let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);
		// let jump = new Jump(this, owner);

        this.initialize(EnemyStates.WALK);

    }

    changeState(stateName: string): void {
		super.changeState(stateName);
	}

    update(deltaT: number): void {
		super.update(deltaT);
	}

    getPlayerPosition(): Vec2 {
        let pos = this.player.position;
        if(pos.x > this.owner.positionX) {
            this.owner.invertX = true;
        }
        else { this.owner.invertX = false; }

        // WE DON"T NEED THIS PART
        // // Get the new player location
        // let start = this.owner.position.clone();
        // let delta = pos.clone().sub(start);

        // // Iterate through the tilemap region until we find a collision
        // let minX = Math.min(start.x, pos.x);
        // let maxX = Math.max(start.x, pos.x);
        // let minY = Math.min(start.y, pos.y);
        // let maxY = Math.max(start.y, pos.y);

        // // Get the wall tilemap
        // let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("Wall").getItems()[0];

        // let minIndex = walls.getColRowAt(new Vec2(minX, minY));
        // let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        // let tileSize = walls.getTileSize();

        // for(let col = minIndex.x; col <= maxIndex.x; col++){
        //     for(let row = minIndex.y; row <= maxIndex.y; row++){
        //         if(walls.isTileCollidable(col, row)){
        //             // Get the position of this tile
        //             let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

        //             // Create a collider for this tile
        //             let collider = new AABB(tilePos, tileSize.scaled(1/2));

        //             let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

        //             if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)){
        //                 // We hit a wall, we can't see the player
        //                 return null;
        //             }
        //         }
        //     }
        // }

        return pos;
    }
}