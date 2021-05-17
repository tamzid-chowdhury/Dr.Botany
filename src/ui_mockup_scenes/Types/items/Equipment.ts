import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Equipment {
	type: string;
	name: string;
	spriteKey: string;
	projectileSpriteKey: string;
	iconSpriteKey: string;
	sfxKey: string;
	sprite: Sprite;
	projectileSprite: Sprite;
	damage: number;
	knockback: number;
	cooldown: number;
	swingDir: number = 1;
	charges: number;
	scale: number = 1;
	inInventory: boolean = false;
	constructor(data: Record<string,any>) {
		this.type = data.type;
		this.spriteKey = data.spriteKey;
		this.iconSpriteKey = data.iconSpriteKey;
		this.projectileSpriteKey = data.projectileSpriteKey;
		this.damage = data.damage;
		this.knockback = data.knockback;
		this.name = data.name;
		this.cooldown = data.cooldown;
		this.sfxKey = data.sfxKey;
		this.scale = data.scale;
		this.charges = data.charges;

	}

	init(position: Vec2): void { 
	}

	onPickup(): void {
		this.inInventory = true;
		this.sprite.visible = true;
		this.sprite.active = false;
	};
	onDrop(position: Vec2): void {
		this.sprite.position.set(position.x, position.y)
		this.sprite.visible = true;
		this.sprite.active = true;
		this.inInventory = false;

	};

	setActive(position: Vec2): void {
		this.sprite.position.set(position.x, position.y);
        this.sprite.invertY = true;
        this.sprite.visible = true;
		if(this.projectileSprite) {
			this.projectileSprite.visible = false;
			this.projectileSprite.active = false;
			this.projectileSprite.position.set(position.x, position.y);
		}

	}

	updatePos(position: Vec2, playerLookDirection: Vec2): void {
	}

	setRot(rotation: number): void {
		this.sprite.rotation = rotation;
	}

	doAttack(direction: Vec2, deltaT: number) {}

	finishAttack(): void {}
	disable():void {
		this.sprite.disablePhysics();
	}
}