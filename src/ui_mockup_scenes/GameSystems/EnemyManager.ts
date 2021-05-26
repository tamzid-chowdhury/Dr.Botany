import GameNode from '../../Wolfie2D/Nodes/GameNode';
import Scene from '../../Wolfie2D/Scene/Scene';
import EnemyController from '../Enemies/EnemyController';
import Enemy from '../Types/enemies/Enemy';
import Vec2 from '../../Wolfie2D/DataTypes/Vec2';
import ProjectileEnemy from '../Types/enemies/ProjectileEnemy';

export default class EnemyManager {
    maxEnemies: number = 5;
    inactivePool: Array<Enemy> = [];
    activePool: Array<Enemy> = [];
    scene: Scene;
    // choice % number of types of enemies === selection. Round robin picking
    choice: number = 0;
    prototypes: Array<Record<string, any>> = [];
    startingPosition: Vec2 = new Vec2(300, 300)
    spawnPositions: Array<Vec2> = [];
    mapSize: Vec2;
    selection: Array<number>;
    // [slime, mushroom, carrot, wisp, bomb] , match the total value as the max Enemies to spawn
    constructor(scene: Scene, mapSize: Vec2, selection: Array<number>, maxEnemies: number = 5) {
        this.scene = scene;
        this.maxEnemies = maxEnemies
        this.selection = selection;
        this.initPrototypes();

        for (let i = 0; i < this.maxEnemies; i++) {
            for (let j = 0; j < this.selection[i]; j++) {
                let enemy = this.createEnemy(i);
                this.inactivePool.push(enemy);
            }
        }
        // mix
        for(let i = this.inactivePool.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.inactivePool[i];
            this.inactivePool[i] = this.inactivePool[j];
            this.inactivePool[j] = temp;
        }
        this.mapSize = mapSize;
        this.spawnPositions.push(
            new Vec2(mapSize.x /2, -64),
            new Vec2(mapSize.x /2, mapSize.y + 64),
            new Vec2(-64, mapSize.y /2),
            new Vec2(mapSize.x + 64, mapSize.y /2)
        );

        console.log(this.inactivePool);
    }

    initPrototypes(): void {
        let enemyData = this.scene.load.getObject("enemyData");
        for(let i = 0; i < enemyData.count; i++) {
            let data = enemyData.enemies[i];
            this.prototypes.push(data)
        }
    }

    createEnemy(index: number = 0): Enemy {
        ////////////////////////////////////////////////////////////////////
        let data = this.prototypes[index];
        ////////////////////////////////////////////////////////////////////
        let sprite = this.scene.add.animatedSprite(data.spriteKey, "primary");
        let enemy;
        if (data.attackType === "projectile") {
            let clip = [];
            for (let i = 0; i < data.clipSize; i++) {
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

    spawnEnemy(player: GameNode, plant: GameNode, position: Vec2 = this.startingPosition): void { // default value
        let enemy;
        if (this.inactivePool.length > 0) {
            // enemy = this.inactivePool.pop();
            enemy = this.inactivePool.shift()
        }
        else {
            enemy = this.createEnemy()
        }
        this.activePool.push(enemy);
        let choiceIndex = Math.floor(Math.random() * this.spawnPositions.length);

        let spawnPos = this.spawnPositions[choiceIndex];
        spawnPos.x += Math.floor(Math.random() * (32 - (-32) + 1) + (-32))
        spawnPos.y += Math.floor(Math.random() * (32 - (-32) + 1) + (-32));
        enemy.sprite.position.set(spawnPos.x, spawnPos.y)
        enemy.sprite.active = true;
        enemy.sprite.visible = true;

        console.log('spawning at :', spawnPos.x, spawnPos.y);
        (<EnemyController>enemy.sprite.ai).wake(player, plant, enemy.data.spriteKey);
    }

    despawnEnemy(node: GameNode): void {
        for (let i = 0; i < this.activePool.length; i++) {
            let enemy = this.activePool[i];
            if (enemy.sprite.id === node.id) {
                this.activePool.splice(i, 1)

                enemy.sprite.position.set(-2000, -2000)
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