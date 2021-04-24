import EnemyController from '../Enemies/EnemyController';

export default class EnemyManager {
	readonly MAX_ENEMIES: number = 100; // dunno if this is too much
	inactivePool: Array<EnemyController> = []; // the inactive pool should only be for enemies not curently spawned



	killEnemy(controller: EnemyController): void {
		// disable physics
		// hide sprite
		// reset all stats/state/values
		// add to inactivePool
	}

	spawnEnemy(): void {
		
	}

	killAllEnemies(): void {
		// loop over all of em, disable/hide 
	}
}