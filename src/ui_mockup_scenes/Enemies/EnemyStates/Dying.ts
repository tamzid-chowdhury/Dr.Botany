import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { InGame_Events } from "../../Utils/Enums";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Dying extends EnemyState {
    playerSize: Vec2;
    onEnter(): void {
        (<AnimatedSprite>this.owner).animation.play("DYING", false, InGame_Events.ENEMY_DEATH_ANIM_OVER);
        this.playerSize = (<AnimatedSprite>this.parent.player).size;
    }

    update(deltaT: number): void {
        super.update(deltaT);
    }

    onExit(): Record<string, any> {
        // (<AnimatedSprite>this.owner).animation.stop();
        return {};
    }
}