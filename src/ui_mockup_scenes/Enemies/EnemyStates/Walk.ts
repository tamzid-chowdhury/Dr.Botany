import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "../EnemyController";
import EnemyState from "./EnemyState";
import Idle from "./Idle"

export default class Walk extends EnemyState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("WALK", true);
        console.log("onEnter")
        
	}

	update(deltaT: number): void {
		super.update(deltaT);
        // this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        // this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0);
        
        this.parent.direction.x = ((this.parent.getPlayerPosition().x > this.parent.getOwnerPostion().x) ? 1 : -1);
        this.parent.direction.y = ((this.parent.getPlayerPosition().y > this.parent.getOwnerPostion().y) ? 1 : -1);
		this.owner._velocity.x = this.parent.direction.x;
        this.owner._velocity.y = this.parent.direction.y;
        this.owner._velocity.normalize();
		this.owner._velocity.mult(new Vec2(this.parent.speed, this.parent.speed));
		this.owner.move(this.owner._velocity.scaled(deltaT));
        
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}