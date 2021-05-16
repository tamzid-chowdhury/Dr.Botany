import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";

export default class GrowthBar {
    scene: Scene; 
    centerPos: Vec2;
    text: Label;
    growthBarOutline: Sprite;
    growthBarFill: Sprite;

	constructor(scene: Scene, centerPos: Vec2) {
        this.centerPos = centerPos;
        this.scene = scene; 

        this.growthBarOutline = this.scene.add.sprite('growth_bar_outline', UILayers.INGAME_UI);
        this.growthBarFill = this.scene.add.sprite('growth_bar_fill', UILayers.INGAME_UI);

        let xOffset =  this.centerPos.x + 211;
        let yOffset =  this.centerPos.y / 10;
        

        this.growthBarFill.position.set(xOffset + 60, yOffset);
        this.growthBarOutline.position.set(xOffset,yOffset);

        this.growthBarFill.scale = new Vec2(1,1.2);
        this.growthBarOutline.scale = new Vec2(1,1.2)


        this.text = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.INGAME_UI, {position: new Vec2(xOffset, yOffset), text:'Growth: 0%'});
        this.text.size = this.growthBarFill.size;
        this.text.font = Fonts.ROUND;
        this.text.textColor = Palette.black();
        this.text.fontSize = 16;



	}

	updateText(): void {
		// TODO: when player health changes, text has to update
	}
}