import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Equipment from "../Equipment";
import * as Tweens from "../../../Utils/Tweens";
import ProjectileController, { TrashLidController } from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";

export default class TrashLid extends Equipment { 
	constructor(data: Record<string,any>) {
		super(data);
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(this.scale, this.scale);
		this.sprite.invertY = true;
		this.sprite.visible = false;
        this.sprite.active = false;
        this.sprite.addAI(TrashLidController, {});
        this.sprite.setTrigger("enemies", InGame_Events.PROJECTILE_HIT_ENEMY, null);

	}
	// get a ref to the array of enemies, then do an intersection test between lid and enemies. This has to be done per update loop
	doAttack(direction: Vec2) {
		this.sprite.active = true;
		(<TrashLidController>this.sprite._ai).beginThrow(direction);

        // this.sprite.position.add(new Vec2(50 * direction.x,50 *direction.y));

	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
		if(!(<TrashLidController>this.sprite._ai).attacking) {
			this.sprite.position.set(position.x, position.y);
			this.sprite.position.add(new Vec2(8 * playerLookDirection.x,8 *playerLookDirection.y));
		}

	}

	finishAttack() {
		// this.sprite.tweens.stopAll();
		// this.sprite.moving = false;
		(<TrashLidController>this.sprite._ai).endThrow();
		this.sprite.active = false;
	}
}