import Receiver from "../../Wolfie2D/Events/Receiver";
import PlayerController from "../Controllers/PlayerController";
import EnemyController from "../Enemies/EnemyController";
import { InGame_Events, PlantMoods, InGame_GUI_Events } from "../Utils/Enums";
import Updateable from "../../Wolfie2D/DataTypes/Interfaces/Updateable";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Emitter from "../../Wolfie2D/Events/Emitter";
import Scene from "../../Wolfie2D/Scene/Scene";
import Input from "../../Wolfie2D/Input/Input";

export default class GrowthManager implements Updateable{
	
	receiver: Receiver = new Receiver();
    materialsToWin: number; 
    growthComplete: boolean = false; 
    firstGrowthReached: boolean = false; 


    scoreIncreasePerMaterial: number; 
    growthIncreasePerMaterial: number; //determines how much the position changes for growth slider 

    score: number = 0; 						


	emitter: Emitter = new Emitter();
	scene: Scene; 

	constructor(scene: Scene, materialsToWin: number = 10) {
        this.scene = scene; 
        this.materialsToWin = materialsToWin; 

        this.scoreIncreasePerMaterial = 100/materialsToWin; 
        this.growthIncreasePerMaterial = 60/materialsToWin

        this.receiver.subscribe([
            InGame_Events.UPDATE_GROWTH,
            InGame_Events.ENEMY_ATTACK_PLANT
        ]);

    }
    
    increaseGrowthScore(count: number): void {
        let growthIncrease = count * this.growthIncreasePerMaterial; 
        this.score += count * this.scoreIncreasePerMaterial;
        this.score = MathUtils.clamp(this.score, 0, 100)

        this.emitter.fireEvent(InGame_GUI_Events.UPDATE_GROWTH_BAR, {growthIncrease: growthIncrease, score:this.score});

        this.checkGrowthComplete();
    }
    
    decreaseGrowthScore(): void {
        let growthDecrease = -.6; 
        this.score += -1;
        this.score = MathUtils.clamp(this.score, 0, 100)

        this.emitter.fireEvent(InGame_GUI_Events.UPDATE_GROWTH_BAR, {growthIncrease: growthDecrease, score:this.score});
    }

    checkGrowthComplete(): void {
        if(this.score == 100){
            this.growthComplete = true; 
        }

        if(!this.firstGrowthReached && this.score == 50){
            this.firstGrowthReached = true; 
            this.emitter.fireEvent(InGame_Events.GROWTH_STARTED);
        }
    }


	update(deltaT: number): void {

		while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            
            if (event.type === InGame_Events.UPDATE_GROWTH) {
                console.log("UPDATING")
                let count = event.data.get('count');
				this.increaseGrowthScore(count);
            }

            if (event.type === InGame_Events.ENEMY_ATTACK_PLANT) {
                this.decreaseGrowthScore();
                console.log("Plant healath: ", this.score);
            }

            

        }

        if(this.growthComplete){
            this.receiver.unsubscribe(InGame_Events.UPDATE_GROWTH);
            this.receiver.unsubscribe(InGame_Events.ENEMY_ATTACK_PLANT);
            
            this.emitter.fireEvent(InGame_Events.GROWTH_COMPLETED);

            this.growthComplete = false; 
        }
        
        if (Input.isKeyJustPressed("x")) {
            this.increaseGrowthScore(1);
        }

	}

}
