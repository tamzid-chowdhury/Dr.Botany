import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import { PillProjectile } from "../../Controllers/ProjectileController";
import EnemyController from "../../Enemies/EnemyController";
import { InGame_Events } from "../../Utils/Enums";
import { PhysicsGroups } from "../../Utils/PhysicsOptions";
import Enemy from "./Enemy";

export default class ProjectileEnemy extends Enemy {
    spriteKey: string;
    type: string;
    sprite: AnimatedSprite;
    effects: Array<string> = [];
    data: Record<string, any>;
	clip: Array<PillProjectile> = [];
	arrayCursor: number = 0;
	clipSize: number = 0;
	cooldown: number;
    constructor(sprite: AnimatedSprite, data: Record<string, any>, clip: Array<AnimatedSprite>) {
		super(sprite, data)
		this.clipSize = data.clipSize;
		this.cooldown = data.cooldown;
		for(let c of clip) {
			c.container = this;
			c.setGroup(PhysicsGroups.ENEMY_PROJECTILE);
			c.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.sprite.size.x/2, this.sprite.size.y/4)));
			c.setTrigger(PhysicsGroups.PLAYER, InGame_Events.PLAYER_ENEMY_COLLISION, null);
			this.clip.push(new PillProjectile(c, data.cooldown));
		}
    }

	updateProjectiles(deltaT: number): void {
		for(let p of this.clip) {
            if(!p.dead) {
                p.update(deltaT)

            }
        }
	}

	fire(direction: Vec2, deltaT: number): void {
		if(this.arrayCursor === this.clipSize-1) this.arrayCursor = 0;
		let projectile = this.clip[this.arrayCursor]
        projectile.activate(direction.clone(), this.sprite.position.clone(), this.sprite.rotation, deltaT, 200, 0.005);
		(<AnimatedSprite>projectile.sprite).animation.playIfNotAlready("FIRE", true);
		this.arrayCursor++;
	}

	deactivateProjectiles(): void {
		for(let c of this.clip) {
			c.deactivate()
		}
	}




}