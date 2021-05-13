import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers } from "../../Utils/Enums";


interface HealthPip {
    icon: Sprite;
    shadow: Sprite;
}

export default class HealthBar {
    centerPos: Vec2;
    health: number = 5; 
    healthPips: Array<HealthPip> = [];
    xOffset: number = 0;
    yOffset: number = 0;

	constructor(scene: Scene, centerPos: Vec2) {
		this.centerPos = centerPos;
        for(let i = 0; i < this.health; i++) {
            let shadow = scene.add.sprite("health_pip_shadow", UILayers.INGAME_UI);
            let icon = scene.add.sprite("health_pip", UILayers.INGAME_UI);

            let xOffset =  (icon.size.x/2) + ((icon.size.x/2 + 4) * i);
            let yOffset =  this.centerPos.y / 10;
            icon.position.set(xOffset, yOffset);
            shadow.position.set(xOffset+1, yOffset+0.5);

            this.healthPips.push({icon: icon, shadow: shadow});
        }




	}

	takeDamage(): void {

        this.health--;
        let pip = this.healthPips.pop(); 
        (<HealthPip>pip).icon.visible = false;
        (<HealthPip>pip).shadow.visible = false;

	}

}