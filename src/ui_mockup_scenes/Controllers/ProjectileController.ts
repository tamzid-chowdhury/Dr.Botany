import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
// import EquipmentManager from "../GameSystems/EquipmentManager";
// import Healthpack from "../GameSystems/items/Healthpack";
import Item from "../GameSystems/items/Item";
import { InGame_Events } from "../Utils/Enums";
import * as Tweens from "../Utils/Tweens"
import BattlerAI from "./BattlerAI";

export default class ProjectileController extends StateMachineAI {
    owner: AnimatedSprite;


    // The inventory of the player
    //private inventory: EquipmentManager;


    direction: Vec2;
    speed: number = 50;



    // WHAT IF TWO SHOVELS AT ONE TIME POWERUP???? ALTERNATING SWINGS



    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.owner.size.x/2, this.owner.size.y/2)));
        this.owner.setGroup("projectiles");


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