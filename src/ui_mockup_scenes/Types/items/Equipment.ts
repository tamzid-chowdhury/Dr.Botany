import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

export default class Equipment {
	type: string;
	name: string;
	spriteKey: string;
	projectileSpriteKey: string;
	iconSpriteKey: string;
	sfxKey: string;
	sprite: Sprite;
	projectileSprite: Sprite;
	damage: number = 1;
	cooldown: number;
	swingDir: number = 1;
	charges: number;
	scale: number = 1;

	constructor(data: Record<string,any>) {
		this.type = data.type;
		this.spriteKey = data.spriteKey;
		this.iconSpriteKey = data.iconSpriteKey;
		this.projectileSpriteKey = data.projectileSpriteKey;
		this.damage = data.damage;
		this.name = data.name;
		this.cooldown = data.cooldown;
		this.sfxKey = data.sfxKey;
		this.scale = data.scale;
		this.charges = data.charges;

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

	doAttack(direction: Vec2) {}

	finishAttack(): void {}
}