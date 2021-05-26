import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIEvents, InGame_Events, Scenes } from "../Utils/Enums";
import GameLevel from "./GameLevel";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Receiver from "../../Wolfie2D/Events/Receiver";
import Timer from "../../Wolfie2D/Timing/Timer";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GrowthManager from "../GameSystems/GrowthManager";
import * as Tweens  from "../Utils/Tweens";
import { Physics } from "../Utils/PhysicsOptions";

import MainMenu from "../MainMenu";
import Level_Winter_Two from "./Level_Winter_Two";
import EnemyManager from "../GameSystems/EnemyManager";

export default class Level_Winter_One extends GameLevel {

    collidables: OrthogonalTilemap;
    tilemapSize: Vec2;
    lookDirection: Vec2;
    maxEnemyNumber: number = 15;
    moodEffectTimer: Timer = new Timer(10000, null, false);
    moodBarTimer: Timer = new Timer(6000, null, false);
    levelReceiver: Receiver = new Receiver();
    currentLevel: string = Scenes.LEVEL_WINTER_ONE;
	pillBottleTimer: Timer;
	trashLidTimer: Timer;
    pauseExecution: boolean = false;
    loadScene(): void {
        super.loadScene();
        this.load.tilemap("level_winter_one", "assets/tilemaps/WinterLevel/level_winter_one.json"); // this change
        this.load.audio("background_music", "assets/music/winter_music.mp3")
    }

	unloadScene(): void {
        super.unloadScene();
        this.levelReceiver.destroy();
    }

    startScene(): void {
        super.startScene();
        // [slime, mushroom, carrot, wisp, bomb] , match the total value as the max Enemies to spawn
        this.enemyManager = new EnemyManager(this, this.viewport.getHalfSize(), [0,0,0,10,5]);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "background_music", loop: true, holdReference: true });
        
        let tilemapLayers = this.add.tilemap("level_winter_one");  // this change
        for (let layer of tilemapLayers) {
            let obj = layer.getItems()[0];
            if (obj.isCollidable) {
                this.collidables = <OrthogonalTilemap>obj;
            }
        }

        this.tilemapSize = this.collidables.size;


        //INITIALIZE PLANT BEFORE PLAYER WHEN MAKING YOUR LEVELS 
        super.initPlant(this.collidables.size);
        this.plant.animation.playIfNotAlready("EH", true);
		super.initPlayer(this.collidables.size);
        super.initViewport(this.collidables.size);
        super.initGameUI(this.viewport.getHalfSize());
        super.initPauseMenu(this.viewport.getHalfSize());
        super.initGameOverScreen(this.viewport.getHalfSize());
        super.initLevelCompletionScreen(this.viewport.getHalfSize());
        super.initSpawnerTimer(4000);
        this.viewport.follow(this.player);

        this.levelReceiver.subscribe(InGame_Events.ANGRY_MOOD_REACHED);
        this.levelReceiver.subscribe(InGame_Events.HAPPY_MOOD_REACHED);
        this.subscribeToEvents();
        


        //we initialized supportmanager in gamelevel but it starts with 0 healthpacks and 0 ammopacks 
        //we use addHealthPacks and addAmmoPacks to add how many we want for each level. in tutorial level will have 5 each
        this.supportManager.addHealthPacks(10); 
        this.supportManager.addAmmoPacks(10);

        this.growthManager = new GrowthManager(this, 18);
        this.spawnerTimer.start();
        this.nextLevel = Scenes.LEVEL_WINTER_TWO;
		this.trashLidTimer = new Timer(30000, () => {
			this.equipmentManager.spawnEquipment('TrashLid', new Vec2(this.plant.position.x, this.plant.position.y + 32))
			this.pillBottleTimer.start();
		})
		this.pillBottleTimer =  new Timer(50000, () => {
			this.equipmentManager.spawnEquipment('PillBottle', new Vec2(this.plant.position.x + 32, this.plant.position.y + 32))
		})
		this.trashLidTimer.start();
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
        this.growthManager.update(deltaT);
		if (this.pauseExecution && this.spawnerTimer.isActive() && !this.completionStatus) {
			this.spawnerTimer.pause();
			// console.log(this.spawnerTimer.toString());
		}
		else if (!this.pauseExecution && this.spawnerTimer.isPaused() && !this.completionStatus) {
			this.spawnerTimer.continue();
		}
		if (this.spawnerTimer.isStopped() && this.maxEnemyNumber >= this.enemyManager.activePool.length && !this.pauseExecution) {
			this.spawnerTimer.start();
			this.enemyManager.spawnEnemy(this.player, this.plant);
		}
		if (this.completionStatus && !this.finalWaveCleared && this.enemyManager.activePool.length === 0) {
			this.spawnerTimer.pause();
			// Change the number of final wave enemies for each level
			this.finalWave(10);
			this.finalWaveCleared = true;

		}


		else if(this.pauseExecution && this.moodEffectTimer.isActive()) {
            this.moodEffectTimer.pause();
        }
        else if(!this.pauseExecution && this.moodEffectTimer.isPaused()) {
            this.moodEffectTimer.continue();
        }

        
        if(this.moodEffectTimer.isStopped() && this.moodEffectTimer.hasRun()) {
            this.moodEffectTimer.reset();
            this.plant.animation.play("EH");
            this.moodManager.resetEffect(this, this.player.position);
        }



        while (this.levelReceiver.hasNextEvent()) {
            let event = this.levelReceiver.getNextEvent();

			if (event.type === InGame_Events.ANGRY_MOOD_REACHED) {
                this.moodEffectTimer.start();
                this.plant.animation.play("ANGRY", true);
                this.moodManager.applyEffect(this,"downer", Math.floor(Math.random() * this.moodManager.prototypesAngry.length), this.player.position);
                
            }

            if (event.type === InGame_Events.HAPPY_MOOD_REACHED) {
                this.moodEffectTimer.start();
                this.plant.animation.play("HAPPY", true);
                this.moodManager.applyEffect(this,"upper", Math.floor(Math.random() * this.moodManager.prototypesHappy.length), this.player.position);
                
            }
            

            // We gotta check this with each levels
            if (event.type === UIEvents.CLICKED_RESTART) {
                this.nextLevel = this.currentLevel;
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2,1)
                this.screenWipe.position.set(2*this.screenWipe.size.x, this.screenWipe.size.y/2);
                this.screenWipe.tweens.add("levelTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL));
                this.screenWipe.tweens.play("levelTransition");
            }
            
			if (event.type === UIEvents.TRANSITION_LEVEL) {
                let sceneOptions = {
                    physics: Physics
                }
                switch (this.nextLevel) {
                    case Scenes.MAIN_MENU:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        this.sceneManager.changeToScene(MainMenu, {});
                        break;
                    case this.currentLevel:
                            this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                            this.sceneManager.changeToScene(Level_Winter_One, {}, sceneOptions);
                        break;
                    default:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        this.sceneManager.changeToScene(Level_Winter_Two, {}, sceneOptions);
                    }
            }

        }
   

    }

    protected subscribeToEvents() {
        this.levelReceiver.subscribe([
   
            UIEvents.CLICKED_RESTART,
			UIEvents.TRANSITION_LEVEL

        ]);
    }

}