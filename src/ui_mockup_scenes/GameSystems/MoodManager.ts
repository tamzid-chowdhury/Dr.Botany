import Receiver from "../../Wolfie2D/Events/Receiver";
import PlayerController from "../Controllers/PlayerController";
import EnemyController from "../Enemies/EnemyController";
import { InGame_Events, PlantMoods, InGame_GUI_Events } from "../Utils/Enums";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Scene from "../../Wolfie2D/Scene/Scene";
import Input from "../../Wolfie2D/Input/Input";
import Timer from "../../Wolfie2D/Timing/Timer";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Enemy from "../Types/enemies/Enemy";
import GameLevel from "../Scenes/GameLevel";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";

export default class MoodManager implements Updateable {

	receiver: Receiver = new Receiver();
	// min and max for each 
	minMoodLevel: number; // we dont need this for our imp
	maxMoodLevel: number;
	// angry and happy mood var
	angryMood: number = 0;
	happyMood: number = 0;

	originalValue: any; // single element mood
	originalValues: Array<number>; // this is for array stuff
	enemiesPool: Array<Enemy>;
	
	moodEffect: boolean = false;

	currentMoodEffect: string = "No Effect";

	currentMood: string = PlantMoods.NEUTRAL; 	// plant starts each level neutral, although we may want to change this

	prototypesHappy: Array<Record<string, any>> = [];
	prototypesAngry: Array<Record<string, any>> = [];

	emitter: Emitter;
	scene: Scene;

	constructor(scene: Scene, maxMoodCount: number) {
		this.emitter = new Emitter();
		this.scene = scene;
		this.maxMoodLevel = maxMoodCount;
		this.initPrototypes();
		this.receiver.subscribe([
			InGame_Events.UPDATE_MOOD
		]);
	}

	initPrototypes(): void {
		let effectData = this.scene.load.getObject("effectData");
		for (let i = 0; i < effectData.downerEffects.length; i++) {
			this.prototypesAngry.push(effectData.downerEffects[i]);
		}
		for (let i = 0; i < effectData.upperEffects.length; i++) {
			this.prototypesHappy.push(effectData.upperEffects[i]);
		}
	}

	applyEffect(scene: GameLevel, upperOrDowner: string, effectChoice: number, playerPosition: Vec2): void {
		console.log("applying effects")
		this.moodEffect = true;
		if (upperOrDowner === "upper") {
			let dataName = this.prototypesHappy[effectChoice].name;
			console.log("Upper Effect : ", dataName);
			let value = this.prototypesHappy[effectChoice].value;
			switch (dataName) {
				case "SpeedUP_Player":
					this.currentMoodEffect = "Player Speed UP";
					this.originalValue = (<PlayerController>scene.player.ai).speed;
					(<PlayerController>scene.player.ai).speed = (<PlayerController>scene.player.ai).speed + value;
					break;

				case "SpeedUP_Enemies": // gotta fix this
					this.currentMoodEffect = "Enemies Speed UP";
					this.enemiesPool = scene.enemyManager.activePool;					
					for (let i = 0; i < scene.enemyManager.activePool.length; i++) {
						(<EnemyController>this.enemiesPool[i].sprite.ai).speed = (<EnemyController>this.enemiesPool[i].sprite.ai).speed + value
					}
					break;

				case "addDamage_Player":
					this.currentMoodEffect = "Player Damage UP";
					this.originalValue = (<PlayerController>scene.player.ai).equipped.damage;
					(<PlayerController>scene.player.ai).equipped.damage += value;

					break;
				case "multiplySpawnRate":
					this.currentMoodEffect = "Double Spawn rate";
					this.originalValue = scene.spawnerTimer.getTime();
					scene.spawnerTimer.stop();
					scene.spawnerTimer.setTime(this.originalValue / value);
					scene.spawnerTimer.start();
					break;
				case "addAttackCooldown":
					this.currentMoodEffect = "Slower Attack Speed";
					this.originalValue = (<PlayerController>scene.player.ai).coolDownTimer.getTime();
					(<PlayerController>scene.player.ai).coolDownTimer.stop();
					(<PlayerController>scene.player.ai).coolDownTimer.setTime(this.originalValue + value);
					(<PlayerController>scene.player.ai).coolDownTimer.start();
					break;
			}
			this.emitter.fireEvent(InGame_GUI_Events.ANNOUNCE_MOOD_EFFECT, { type:1, moodEffect: this.currentMoodEffect, position: playerPosition})
		}
		if (upperOrDowner === "downer") {
			let dataName = this.prototypesAngry[effectChoice].name;
			let value = this.prototypesAngry[effectChoice].value;
			console.log("Downer Effect : ", dataName);
			switch (dataName) {
				case "SpeedDown_Player":
					this.currentMoodEffect = "Player Speed Down";
					this.originalValue = (<PlayerController>scene.player.ai).speed;
					(<PlayerController>scene.player.ai).speed = (<PlayerController>scene.player.ai).speed + value;
					break;
				case "SpeedDown_Enemies":
					this.currentMoodEffect = "Enemies Speed Down";
					this.enemiesPool = scene.enemyManager.activePool;
					for (let i = 0; i < scene.enemyManager.activePool.length; i++) {
						(<EnemyController>this.enemiesPool[i].sprite.ai).speed = (<EnemyController>this.enemiesPool[i].sprite.ai).speed + value
					}
					break;
				case "multiplyGrowth":
					this.currentMoodEffect = "Triple Growth Rate";
					this.originalValue = scene.growthManager.growthIncreasePerMaterial;
					scene.growthManager.growthIncreasePerMaterial *= value;
					break;
				case "addDamage_Enemies":
					this.currentMoodEffect = "Enemies Damage UP";
					this.originalValue = (<PlayerController>scene.player.ai).damageTaken;
					(<PlayerController>scene.player.ai).damageTaken = value
					break;
				case "reduceAttackCooldown":
					this.currentMoodEffect = "Faster Attack Speed";
					this.originalValue = (<PlayerController>scene.player.ai).coolDownTimer.getTime();
					(<PlayerController>scene.player.ai).coolDownTimer.stop();
					(<PlayerController>scene.player.ai).coolDownTimer.setTime(this.originalValue + value);
					(<PlayerController>scene.player.ai).coolDownTimer.start();
					break;

				default: break;
			}
			this.emitter.fireEvent(InGame_GUI_Events.ANNOUNCE_MOOD_EFFECT, { type:-1, moodEffect: this.currentMoodEffect, position: playerPosition})
		}
	}

	resetEffect(scene: GameLevel): void {
		console.log("resetting effects")
		this.moodEffect = false;
		switch (this.currentMoodEffect) {
			// UPPER EFFECT RESET
			case "SpeedUP_Player":
				this.currentMoodEffect = "No Effect";
				(<PlayerController>scene.player.ai).speed = this.originalValue;
				break;
			case "SpeedUP_Enemies":
				this.currentMoodEffect = "No Effect";
				let value = this.prototypesHappy[1].value;
				
				for(let i = 0 ; i < scene.enemyManager.activePool.length; i++) {
					let found = scene.enemyManager.activePool.find(x => x.sprite.id === this.enemiesPool[i].sprite.id)
					if(found) {
						(<EnemyController>this.enemiesPool[i].sprite.ai).speed = (<EnemyController>found.sprite.ai).speed - value;
					}
				}

				break;
			case "addDamage_Player":
				this.currentMoodEffect = "No Effect";
				console.log((<PlayerController>scene.player.ai).equipped.damage);
				(<PlayerController>scene.player.ai).equipped.damage = this.originalValue;
				console.log((<PlayerController>scene.player.ai).equipped.damage);
				break;
			case "multiplySpawnRate":
				this.currentMoodEffect = "No Effect";
				scene.spawnerTimer.stop();
				scene.spawnerTimer.setTime(this.originalValue);
				scene.spawnerTimer.start();
				break;
			case "addAttackCooldown":
				this.currentMoodEffect = "No Effect";
				(<PlayerController>scene.player.ai).coolDownTimer.stop();
				(<PlayerController>scene.player.ai).coolDownTimer.setTime(this.originalValue);
				(<PlayerController>scene.player.ai).coolDownTimer.start();
				break;

			// DOWNER EFFECT RESET
			case "SpeedDown_Player":
				this.currentMoodEffect = "No Effect";
				(<PlayerController>scene.player.ai).speed = this.originalValue;
				break;
			case "SpeedDown_Enemies":
				this.currentMoodEffect = "No Effect";
				let value1 = this.prototypesAngry[1].value;
				
				for(let i = 0 ; i < scene.enemyManager.activePool.length; i++) {
					let found = scene.enemyManager.activePool.find(x => x.sprite.id === this.enemiesPool[i].sprite.id)
					if(found) {
						(<EnemyController>this.enemiesPool[i].sprite.ai).speed = (<EnemyController>found.sprite.ai).speed - value1;
					}
				}
				break;
			case "multiplyGrowth":
				this.currentMoodEffect = "No Effect";
				scene.growthManager.growthIncreasePerMaterial = this.originalValue;
				break;
			case "addDamage_Enemies":
				this.currentMoodEffect = "No Effect";
				(<PlayerController>scene.player.ai).damageTaken = this.originalValue;
				break;
			case "reduceAttackCooldown":
				this.currentMoodEffect = "No Effect";
				(<PlayerController>scene.player.ai).coolDownTimer.stop();
				(<PlayerController>scene.player.ai).coolDownTimer.setTime(this.originalValue);
				(<PlayerController>scene.player.ai).coolDownTimer.start();
				break;
			default: break;
		}
	}

	updateMoodLevel(count: number, type: number): void {
		// NOTE: Type is either -1 or 1, so that the mood will shift in the upper/downer direction
		if (type === 1 && !this.moodEffect) {
			//upper update
			this.happyMood += count;

			// GUI stuff 
			 MathUtils.clamp(this.happyMood, this.minMoodLevel, this.maxMoodLevel);
			 this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, { moodChange: count, type: type})

		}
		if (type === -1 && !this.moodEffect) {
			// downer update
			this.angryMood += count;

			// GUI stuff
			MathUtils.clamp(this.angryMood, this.minMoodLevel, this.maxMoodLevel);
			this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, { moodChange: count, type: type})
		}
		this.updateCurrentMood();
	}

	updateCurrentMood(): void {
		if (this.angryMood >= this.maxMoodLevel) {
			this.angryMood = 0;
			this.happyMood = 0;
			this.currentMood = PlantMoods.ANGRY;
			this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);
			this.emitter.fireEvent(InGame_GUI_Events.RESET_MOOD_BAR, { type: -1})
			// this.receiver.unsubscribe(InGame_Events.UPDATE_MOOD);
			// console.log("ANGRY MOOD REACHED")
			// GUI counter (timer)

		}

		if (this.happyMood >= this.maxMoodLevel) {
			this.happyMood = 0;
			this.angryMood = 0;
			this.currentMood = PlantMoods.HAPPY;
			this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);
			this.emitter.fireEvent(InGame_GUI_Events.RESET_MOOD_BAR, { type: 1})
			// this.receiver.unsubscribe(InGame_Events.UPDATE_MOOD);
			// console.log("HAPPY MOOD REACHED")
			// GUI counter (timer)
		}

	}


	update(deltaT: number): void {
		while (this.receiver.hasNextEvent()) {
			let event = this.receiver.getNextEvent();

			if (event.type === InGame_Events.UPDATE_MOOD) {
				let type = event.data.get('type');
				let count = event.data.get('count');
				this.updateMoodLevel(count, type);
				console.log("Happy mood score : ", this.happyMood);
				console.log("Angry mood score : ", this.angryMood);
			}
		}
		// Happy mood cheat code
		if(Input.isKeyJustPressed('p')) {
			this.updateMoodLevel(1, 1);
		}
		// Angry mood cheat code
		if(Input.isKeyJustPressed('o')) {
			this.updateMoodLevel(1, -1);
		}
	}

}
