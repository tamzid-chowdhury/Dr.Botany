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
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "enemy_die", loop: false, holdReference: true});

        (<AnimatedSprite>this.owner).animation.play("DYING", false, InGame_Events.ENEMY_DEATH_ANIM_OVER);
        this.playerSize = (<AnimatedSprite>this.parent.player).size;
    }

    update(deltaT: number): void {
        super.update(deltaT);
        // console.log("called")
        // if (!(<AnimatedSprite>this.owner).animation.isPlaying("DYING")) {
        //     let ownerPosition = this.owner.position.clone();
        //     if (Math.random() < 0.9) {
        //         if (this.parent.type == "Upper") {
        //             this.emitter.fireEvent(InGame_Events.SPAWN_UPPER, { position: ownerPosition });
        //         }
        //         if (this.parent.type == "Downer") {
        //             this.emitter.fireEvent(InGame_Events.SPAWN_DOWNER, { position: ownerPosition });
        //         }
        //     }
        //     this.owner.setAIActive(false, {});
        //     this.owner.isCollidable = false;
        //     this.owner.destroy();
        // }

    }

    onExit(): Record<string, any> {
        // (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }
}