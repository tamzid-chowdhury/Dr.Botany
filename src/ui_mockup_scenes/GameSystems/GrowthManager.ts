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
    scorePerMaterial: number; 						


	emitter: Emitter = new Emitter();
	scene: Scene; 

	constructor(scene: Scene, materialsToWin: number = 15) {
        this.scene = scene; 
        this.materialsToWin = materialsToWin; 
        this.scorePerMaterial = 60/materialsToWin; 

        this.receiver.subscribe([
            InGame_Events.UPDATE_GROWTH
        ]);

    }
    
    updateGrowthScore(count: number): void {
        let growthIncrease = count * this.scorePerMaterial; 
		this.emitter.fireEvent(InGame_GUI_Events.UPDATE_GROWTH_BAR, {growthIncrease: growthIncrease});
	}


	update(deltaT: number): void {

		while(this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            
            if (event.type === InGame_Events.UPDATE_GROWTH) {
                console.log("UPDATING")
                let count = event.data.get('count');
				this.updateGrowthScore(count);
            }


		}

	}

}
