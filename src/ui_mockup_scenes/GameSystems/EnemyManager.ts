import AABB from '../../Wolfie2D/DataTypes/Shapes/AABB';
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import Emitter from '../../Wolfie2D/Events/Emitter';
import Scene from '../../Wolfie2D/Scene/Scene';
import EnemyController from '../Enemies/EnemyController';
import { InGame_Events } from '../Utils/Enums';

export default class EnemyManager {
	maxEnemies: number; // dunno if this is too much
	inactivePool: Array<EnemyController> = []; // the inactive pool should only be for enemies not curently spawned
	activePool: Array<EnemyController> = []; // the inactive pool should only be for enemies not curently spawned
    scene: Scene;
    emitter: Emitter;

	constructor(scene: Scene, size: number = 100) {
		this.scene = scene;
        this.emitter = new Emitter();
        this.maxEnemies = size;
	}


	// this.addEnemy("green_slime", new Vec2(this.tilemapSize.x/2, this.tilemapSize.y/2), { speed: 50 , player: this.player, health: 40, type: "Downer" }, 1.5)
	addEnemy(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>, scale: number): void {
        let enemy = this.scene.add.animatedSprite(spriteKey, "primary");
        enemy.position.set(tilePos.x, tilePos.y);
        enemy.scale.set(scale, scale);
        let collisionShape = enemy.size;
        enemy.addPhysics(new AABB(Vec2.ZERO, new Vec2(( (collisionShape.x / 2)) * scale, (collisionShape.y / 4) * scale) ));
        enemy.colliderOffset.set(0, (collisionShape.y / 4) * scale);
        enemy.addAI(EnemyController, aiOptions);
        enemy.setGroup("enemies");
        enemy.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
        enemy.setTrigger("projectiles", InGame_Events.PROJECTILE_HIT_ENEMY, null)
		this.inactivePool.push()
    }

}