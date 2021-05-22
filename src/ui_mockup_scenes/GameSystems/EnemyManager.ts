import GameNode from '../../Wolfie2D/Nodes/GameNode';
import Scene from '../../Wolfie2D/Scene/Scene';
import EnemyController from '../Enemies/EnemyController';
import Enemy from '../Types/enemies/Enemy';
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import ProjectileEnemy from '../Types/enemies/ProjectileEnemy';

export default class EnemyManager {
	maxEnemies: number; 
	inactivePool: Array<Enemy> = []; 
	activePool: Array<Enemy> = []; 
    scene: Scene;
    // choice % number of types of enemies === selection. Round robin picking
    choice: number = 0;
    prototypes: Array<Record<string, any>> = [];
    startingPosition: Vec2 = new Vec2(300,300)
    spawnPositions: Array<Vec2> = [];
    mapSize : Vec2;

	constructor(scene: Scene, mapSize : Vec2, size: number = 5 ) {
		this.scene = scene;
        this.maxEnemies = size;
        this.initPrototypes();
        for(let i = 0; i < this.maxEnemies; i ++) {
            let enemy = this.createEnemy()
            this.inactivePool.push(enemy);
        }

        this.mapSize = mapSize;
        this.spawnPositions.push(
            new Vec2(mapSize.x/2, -64),
            new Vec2(mapSize.x/2, mapSize.y + 64), 
            new Vec2(-64, mapSize.y/2 ), 
            new Vec2(mapSize.x + 64, mapSize.y/2 )
        );
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
        let enemy;
        if(data.attackType === "projectile") {
            let clip = [];
            for(let i = 0; i < data.clipSize; i ++) {
                let charge = this.scene.add.animatedSprite(data.projectileSpriteKey, "primary");
                charge.visible = false;
                charge.active = false;
                clip.push(charge)
            }
            enemy = new ProjectileEnemy(sprite, data, clip)
        }
        else {
            enemy = new Enemy(sprite, data); 
        }
        return enemy
    }

    spawnEnemy(player: GameNode, plant:GameNode, position: Vec2 = this.startingPosition): void {
        let enemy;
        if(this.inactivePool.length > 0) {
            enemy = this.inactivePool.pop();
        }
        else {
            enemy = this.createEnemy()
        }
        this.activePool.push(enemy);
        let choiceIndex = Math.floor(Math.random() * this.spawnPositions.length);

        // let side = Math.random() < 0.5 ? -1:1;
        // let yPos = Math.random() * (this.mapSize.y ) + (64*side); // 64 is to add a little up/down to potential spawn points
        // let xPos = (yPos > 0 && yPos < this.mapSize.y) ? -48 : Math.random() * this.mapSize.x;
        // xPos += Math.random() < 0.5 ? -32 : 32;
        let spawnPos = this.spawnPositions[choiceIndex];
        enemy.sprite.position.set(spawnPos.x, spawnPos.y)
        enemy.sprite.active = true;
        enemy.sprite.visible = true;

        console.log('spawning at :', spawnPos.x, spawnPos.y);
        (<EnemyController>enemy.sprite.ai).wake(player, plant, enemy.data.spriteKey);
    }

    despawnEnemy(node: GameNode): void {
        for(let i = 0; i < this.activePool.length; i ++) {
            let enemy = this.activePool[i];
            if(enemy.sprite.id === node.id) {
                this.activePool.splice(i, 1)

                enemy.sprite.position.set(-2000,-2000)
                enemy.sprite.active = false;
                enemy.sprite.visible = false;
                this.inactivePool.push(enemy);
                break;
            }
        }
    }

    getNumberOfActiveEnemies(): number {
        return this.activePool.length; 
    }
}