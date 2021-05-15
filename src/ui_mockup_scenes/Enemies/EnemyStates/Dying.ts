import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { InGame_Events } from "../../Utils/Enums";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Dying extends EnemyState {
    playerSize: Vec2;
    onEnter(): void {
		this.parent.currentStateName = EnemyStates.DYING;
		
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemy_die", loop: false, holdReference: true});

        (<AnimatedSprite>this.owner).animation.play("DYING", false, InGame_Events.ENEMY_DEATH_ANIM_OVER);
        this.owner.active = false;
    }

    update(deltaT: number): void {
        super.update(deltaT);


    }

    onExit(): Record<string, any> {
        // (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }
}