import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, Fonts } from "../../Utils/Enums";
import * as Palette from "../../Utils/Colors";

export default class MaterialSlots {

    slot: Sprite;
    text: Label;
    textBackdrop: Label;

	sprite: Sprite;
    materialSprite: Sprite;

	centerPos: Vec2;
    xOffset: number;
    yOffset: number;
    count: number = 0; 

	constructor(scene: Scene, centerPos: Vec2, xOffset: number, materialImageId: string) {

		this.centerPos = centerPos;
        this.slot = scene.add.sprite("ui_square", UILayers.INGAME_UI)
        this.xOffset =  xOffset;
        this.yOffset =  this.centerPos.y / 2.5;
        this.slot.position.set(this.xOffset, this.yOffset)
        this.slot.scale = new Vec2(0.4, 0.4);
        this.materialSprite = scene.add.sprite(materialImageId, UILayers.INGAME_UI);
        this.materialSprite.position = this.slot.position;
        this.materialSprite.scale = new Vec2(0.3, 0.3);


        this.textBackdrop = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.INGAME_UI, {position: new Vec2(this.slot.position.x+0.5, this.slot.position.y + 0.5), text:`x${this.count}`});
        this.textBackdrop.size.set(50,50)
        this.textBackdrop.font = Fonts.ROUND;
        this.textBackdrop.textColor = Palette.black();
        this.textBackdrop.fontSize = 16;
        this.textBackdrop.setHAlign('right');
        this.textBackdrop.setVAlign('bottom')

        this.text = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.INGAME_UI, {position: new Vec2(this.slot.position.x, this.slot.position.y), text:`x${this.count}`});
        this.text.size.set(50,50)
        this.text.font = Fonts.ROUND;
        this.text.textColor = Palette.white();
        this.text.fontSize = 16;
        this.text.setHAlign('right');
        this.text.setVAlign('bottom')


	}

    updateCount(): void {
        this.count = this.count+1;
        this.textBackdrop.text = `x${this.count}`;
        this.text.text = `x${this.count}`; 
    }

	updateText(): void {
		// TODO: when player health changes, text has to update
	}
}

