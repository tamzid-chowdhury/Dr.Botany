import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers } from "../../Utils/Enums";
import Counter from "../../Classes/Counter";
export default class MaterialSlots {

    slot: Sprite;
    slotSize: Vec2 = new Vec2(32,32);
    text: Label;
    textBackdrop: Label;

	sprite: Sprite;
    materialSprite: Sprite;

	centerPos: Vec2;
    xOffset: number;
    yOffset: number;
    count: number = 0; 
    counter: Counter;
	constructor(scene: Scene, centerPos: Vec2, xOffset: number, materialImageId: string) {

		this.centerPos = centerPos;
        this.xOffset = xOffset - this.slotSize.x/2;
        this.yOffset =  2*this.centerPos.y - (this.slotSize.y) - 4;

        this.materialSprite = scene.add.sprite(materialImageId, UILayers.INGAME_UI);
        this.materialSprite.position.set(this.xOffset, this.yOffset)
        this.materialSprite.scale = new Vec2(0.5, 0.5);

        this.counter = new Counter(scene, this.count, new Vec2(50,50), new Vec2(this.xOffset, this.yOffset))

	}

    updateCount(): void {

        this.count = this.count+1;
        this.counter.setCount(this.count)

    }

    clearCount(): void {
        this.count = 0;
        this.counter.setCount(this.count)

    }

}

