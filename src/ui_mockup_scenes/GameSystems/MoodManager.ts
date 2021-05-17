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

export default class MoodManager implements Updateable{
	
	receiver: Receiver = new Receiver();
	// min and max for each 
	minMoodLevel: number; // we dont need this for our imp
	maxMoodLevel: number; 
	// angry and happy mood var
	angryMood: number = 0;
	happyMood: number = 0;

	originalValue: number = 0;

	currentMood: string = PlantMoods.NEUTRAL; 	// plant starts each level neutral, although we may want to change this
	
	
	angryEffectPool: Array<AngryEffect> = [];
	happyEffectPool: Array<HappyEffect> = [];
	
	
	prototypes: Array<Record<string, any>> = [];

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

	initPrototypes() : void {
		let effectData = this.scene.load.getObject("effectData");
		for(let i = 0; i< effectData.count; i++) {
			let data = effectData.effects[i];
			this.prototypes.push(data);
		}
		console.log(this.prototypes);
	}

	applyEffect(player: GameNode, activePool: Array<Enemy>, effectChoice : number):void {
		let data = this.prototypes[effectChoice];
		this.originalValue = (<PlayerController>player.ai).speed;
		console.log(this.originalValue);
		(<PlayerController>player.ai).speed = (<PlayerController>player.ai).speed * 1.5;
		// for(let i = 0; i < activePool.length; i++) {
		// 	(<EnemyController>activePool[i].sprite.ai).speed = (<EnemyController>activePool[i].sprite.ai).speed * 2;
		// }
	}

	resetEffect(player:GameNode, activePool: Array<Enemy>, effectChoice : number): void {
		(<PlayerController>player.ai).speed = this.originalValue;
		console.log((<PlayerController>player.ai).speed);
		// for(let i = 0; i < activePool.length; i++) {
		// 	(<EnemyController>activePool[i].sprite.ai).speed = (<EnemyController>activePool[i].sprite.ai).speed / 2;
		// }
	}

	isApplied(enemy: Enemy) {

	}

	updateMoodLevel(count: number, type: number): void {
		// NOTE: Type is either -1 or 1, so that the mood will shift in the upper/downer direction
		if(type === 1) {
			//upper update
			this.happyMood += count;
			
			// GUI stuff 
			// MathUtils.clamp(this.happyMood, this.minMoodLevel, this.maxMoodLevel);
			// this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, { moodChange: count, type: type})

		}
		if(type === -1) {
			// downer update
			this.angryMood += count;
			
			// GUI stuff
			// MathUtils.clamp(this.angryMood, this.minMoodLevel, this.maxMoodLevel);
			// this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, { moodChange: count, type: type})
		}
		this.updateCurrentMood();
	}

	updateCurrentMood(): void {
		if (this.angryMood >= this.maxMoodLevel) {
			this.angryMood = 0;
			this.happyMood = 0;
			this.currentMood = PlantMoods.ANGRY;
			this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);
			// this.receiver.unsubscribe(InGame_Events.UPDATE_MOOD);
			// console.log("ANGRY MOOD REACHED")
			// GUI counter (timer)
			
		}

		if (this.happyMood >= this.maxMoodLevel) {
			this.happyMood = 0;
			this.angryMood = 0;
			this.currentMood = PlantMoods.HAPPY;
			this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);
			// this.receiver.unsubscribe(InGame_Events.UPDATE_MOOD);
			// console.log("HAPPY MOOD REACHED")
			// GUI counter (timer)
		}

	}


	update(deltaT: number): void {
		while(this.receiver.hasNextEvent()) {
			let event = this.receiver.getNextEvent();

			if (event.type === InGame_Events.UPDATE_MOOD) {
                let type = event.data.get('type');
                let count = event.data.get('count');
				this.updateMoodLevel(count, type);
				console.log("Happy mood score : ",this.happyMood);
				console.log("Angry mood score : ", this.angryMood);
            }
		}

		//angry mood cheat
		if (Input.isKeyJustPressed("o")) { 
			this.updateMoodLevel(10, -1)
			
        }

		//happy mood cheat
        if (Input.isKeyJustPressed("p")) {
			this.updateMoodLevel(10, 1)
        }
	}

}


abstract class MoodEffect {
	
/*	
	my vague intention for plant effect is that it has access to every enemy and player
	and will apply a data change to all of them, depending on the specific type of effect

	I dont know if effects will be better implemented as:
	UpperEffect extends MoodEffect
	or
	UpperEffect<T> extends MoodEffect, with T being MoveFaster, HitHarder, DoubleMaterialDrops, etc
	or
	IncreaseSpeed extends MoodEffect
*/	
	abstract enemies: Array<EnemyController>;
	abstract player: PlayerController;
	abstract applyEffect: void;
}

export class AngryEffect extends MoodEffect {
	enemies: EnemyController[];
	player: PlayerController;
	applyEffect: void;
	// maybe timer here
}

export class HappyEffect extends MoodEffect {

	enemies: EnemyController[];
	player: PlayerController;
	applyEffect: void;
	// timer as well
	
}

