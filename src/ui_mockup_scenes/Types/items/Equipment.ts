import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import ProjectileController from "../../Controllers/ProjectileController";
import { InGame_Events } from "../../Utils/Enums";
import * as Tweens from "../../Utils/Tweens";


// NOTE: this should probably be a "single projectile" class that extends equipment

export default class Equipment {
	type: string;
	name: string;
	spriteKey: string;
	projectileSpriteKey: string;
	sfxKey: string;
	sprite: Sprite;
	projectileSprite: Sprite;
	damage: number = 1;
	cooldown: number;
	swingDir: number = 1;
	scale: number = 1;
	constructor(data: Record<string,any>) {
		this.type = data.type;
		this.spriteKey = data.spriteKey;
		this.projectileSpriteKey = data.projectileSpriteKey;
		this.damage = data.damage;
		this.name = data.name;
		this.cooldown = data.cooldown;
		this.sfxKey = data.sfxKey;
		this.scale = data.scale;

	}

	init(position: Vec2): void { }

	setActive(position: Vec2): void {
		this.sprite.position.set(position.x, position.y);
		this.projectileSprite.position.set(position.x, position.y);
        this.sprite.invertY = true;
        this.sprite.visible = true;
		this.projectileSprite.visible = false;
        this.projectileSprite.active = false;
	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
	}

	setRot(rotation: number): void {
		this.sprite.rotation = rotation;
	}

	doAttack(direction: Vec2) { }

	finishAttack(): void {}
}