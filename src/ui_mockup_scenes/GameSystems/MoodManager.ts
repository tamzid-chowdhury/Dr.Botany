import Receiver from "../../Wolfie2D/Events/Receiver";
import PlayerController from "../Controllers/PlayerController";
import EnemyController from "../Enemies/EnemyController";
import { InGame_Events, PlantMoods, InGame_GUI_Events } from "../Utils/Enums";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Scene from "../../Wolfie2D/Scene/Scene";
import Input from "../../Wolfie2D/Input/Input";

export default class PlantManager implements Updateable{
	
	receiver: Receiver = new Receiver();
	moodLevel: number = 0; 						// mood goes from -50 -> 50, 100 total points 
	minMoodLevel: number = -20; 
	maxMoodLevel: number = 20; 

	currentMood: string = PlantMoods.NEUTRAL; 	// plant starts each level neutral, although we may want to change this
	
	neutralEffect: MoodEffect;
	upperTierOneEffect: MoodEffect;
	upperTierTwoEffect: MoodEffect;
	downerTierOneEffect: MoodEffect;
	downerTierTwoEffect: MoodEffect;
	

	emitter: Emitter;
	scene: Scene; 


	/*
		-50 -> -30		-30 -> -10	   -10 -> 10 	 10 -> 30		 30 -> 50				
		| Tier 2 Upper | Tier 1 Upper | Neutral 	| Tier 1 Downer | Tier 2 Downer |

		My tentative plan for the mood range is that once you git a threshold, it transitions to the 
		next tier. So if Im tier 1 upper at -20 and I deposit 10 uppers landing exactly on -30, 
		choose to transition to tier 2 upper.
		
		It annoys me to think of uppers as negative and downers as positive, so Ill probably change the art of
		the mood bar to have the upper range on the right and downer on the left
	*/
	constructor(scene: Scene) {
		this.emitter = new Emitter();
		this.scene = scene; 


		this.receiver.subscribe([
            InGame_Events.UPDATE_MOOD
        ]);
	}

	updateMoodLevel(count: number, type: number): void {
		// NOTE: Type is either -1 or 1, so that the mood will shift in the upper/downer direction
		count *= type;
		this.moodLevel += count;
		MathUtils.clamp(this.moodLevel, this.minMoodLevel, this.maxMoodLevel);
		this.emitter.fireEvent(InGame_GUI_Events.UPDATE_MOOD_BAR, { moodChange: count });
		this.updateCurrentMood(); 
	}

	updateCurrentMood(): void {
		if (this.moodLevel <= this.minMoodLevel) {
			this.moodLevel = 0;
			console.log("ANGRY MOOD REACHED")
		}

		if (this.moodLevel >= this.maxMoodLevel) {
			this.moodLevel = 0;
			console.log("HAPPY MOOD REACHED")
		}

	}


	update(deltaT: number): void {
		while(this.receiver.hasNextEvent()) {
			let event = this.receiver.getNextEvent();

			if (event.type === InGame_Events.UPDATE_MOOD) {
                let type = event.data.get('type');
                let count = event.data.get('count');
				this.updateMoodLevel(count, type)
                

            }
		}

		//angrymood cheat
		if (Input.isKeyJustPressed("o")) { 
			this.updateMoodLevel(10, -1)
            console.log("Mood: -1, Current Mood stat: " + this.moodLevel);
			
        }

		//happymood cheat
        if (Input.isKeyJustPressed("p")) {
			this.updateMoodLevel(10, 1)
            console.log("Mood: +1, Current Mood stat: " + this.moodLevel);

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

