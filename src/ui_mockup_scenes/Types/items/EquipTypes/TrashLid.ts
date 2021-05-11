import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Equipment from "../Equipment";
import { TrashLidController } from "../../../Controllers/ProjectileController";
import { InGame_Events } from "../../../Utils/Enums";

export default class TrashLid extends Equipment { 
	
	constructor(data: Record<string,any>) {
		super(data);
	}

	init(position: Vec2): void {
        this.sprite.position.set(position.x, position.y);
        this.sprite.scale = new Vec2(1.2, 1.2);
		this.sprite.invertY = true;
		this.sprite.visible = false;
        this.sprite.active = false;
        this.sprite.addAI(TrashLidController, {cooldown: this.cooldown});
        this.sprite.setTrigger("enemies", InGame_Events.PROJECTILE_HIT_ENEMY, null);

	}
	doAttack(direction: Vec2): void {
		this.sprite.active = true;
		(<TrashLidController>this.sprite._ai).beginThrow(direction);

	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
		if((<TrashLidController>this.sprite._ai).attacking) {
			// do nothing
		}
		else if((<TrashLidController>this.sprite._ai).returning) {
			(<TrashLidController>this.sprite._ai).returnToPlayer(position);
		}
		else {
			this.sprite.position.set(position.x, position.y);
			this.sprite.position.add(new Vec2(8 * playerLookDirection.x,8 *playerLookDirection.y));
		}


	}

	finishAttack(): void { }
}