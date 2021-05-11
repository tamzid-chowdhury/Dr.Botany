import AABB from '../../Wolfie2D/DataTypes/Shapes/AABB';
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import Emitter from '../../Wolfie2D/Events/Emitter';
import GameNode from '../../Wolfie2D/Nodes/GameNode';
import Scene from '../../Wolfie2D/Scene/Scene';
import EnemyController from '../Enemies/EnemyController';
import Enemy from '../Types/enemies/Enemy';
import { InGame_Events } from '../Utils/Enums';
import { PhysicsGroups } from '../Utils/PhysicsOptions';

export default class EnemyManager {
	maxEnemies: number; 
	inactivePool: Array<Enemy> = []; 
	activePool: Array<Enemy> = []; 
    scene: Scene;
    // choice % number of types of enemies === selection. Round robin picking
    choice: number = 0;
    enemyTypes: number = 3; // hardcoded for now, should come from enemy data file 
    prototypes: Array<Record<string, any>> = [];
    // emitter: Emitter;

	constructor(scene: Scene, size: number = 3) {
		this.scene = scene;
        // this.emitter = new Emitter();
        this.maxEnemies = size;
        this.initPrototypes();
        for(let i = 0; i < this.maxEnemies; i ++) {
            let enemy = this.createEnemy()
            this.inactivePool.push(enemy);
        }
	}

    initPrototypes(): void {
        let enemyData = this.scene.load.getObject("enemyData");
        for(let i = 0; i < enemyData.count; i++){
            let data = enemyData.enemies[i];
            this.prototypes.push(data)
        }
    }

    createEnemy(): Enemy {
        let data = this.prototypes[this.choice % this.prototypes.length];
        this.choice++;
        let sprite = this.scene.add.animatedSprite(data.spriteKey, "primary");
        return new Enemy(sprite, data)
    }

    spawnEnemy(player: GameNode): void {
        let enemy;
        if(this.inactivePool.length > 0) {
            enemy = this.inactivePool.pop();
        }
        else {
            enemy = this.createEnemy()
        }
        this.activePool.push(enemy);
        enemy.sprite.position.set(300,300)
        enemy.sprite.active = true;
        enemy.sprite.visible = true;
        (<EnemyController>enemy.sprite.ai).wake(player);
        console.log(this.inactivePool, this.activePool);

    }

    despawnEnemy(node: GameNode): void {
        for(let i = 0; i < this.activePool.length; i ++) {
            let enemy = this.activePool[i];

            if(enemy.sprite.id === node.id) {
                this.activePool.splice(i, 1)

                enemy.sprite.position.set(-1000,-1000)
                enemy.sprite.active = true;
                enemy.sprite.visible = true;
                this.inactivePool.push(enemy);
                break;
            }
        }
        console.log(this.inactivePool, this.activePool);

    }


}