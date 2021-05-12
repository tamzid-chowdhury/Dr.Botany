import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Scene from "../../Wolfie2D/Scene/Scene";
import {Fonts, UILayers} from "../Utils/Enums";
import * as Palette from "../Utils/Colors";
import * as Tweens from "../Utils/Tweens";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
export default class Counter {
	text: Label;
    textBackdrop: Label;
	constructor(scene: Scene, count: number, size: Vec2, offset: Vec2, fontSize: number = 16) {

		this.textBackdrop = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.INGAME_UI, {position: new Vec2(offset.x+0.5, offset.y + 0.5), text:`x${count}`});
        this.textBackdrop.size = size;
        this.textBackdrop.font = Fonts.ROUND;
        this.textBackdrop.textColor = Palette.black();
        this.textBackdrop.fontSize = fontSize;
        this.textBackdrop.setHAlign('right');
        this.textBackdrop.setVAlign('bottom');
        this.textBackdrop.tweens.add("itemIncrement", Tweens.itemIncrement(this.textBackdrop.fontSize))

        this.text = <Label>scene.add.uiElement(UIElementType.LABEL, UILayers.INGAME_UI, {position: new Vec2(offset.x, offset.y), text:`x${count}`});
        this.text.size = size;
        this.text.font = Fonts.ROUND;
        this.text.textColor = Palette.white();
        this.text.fontSize = fontSize;
        this.text.setHAlign('right');
        this.text.setVAlign('bottom')
        this.text.tweens.add("itemIncrement", Tweens.itemIncrement(this.textBackdrop.fontSize))
	}

    setCount(count: number) {
        this.textBackdrop.tweens.play("itemIncrement");
        this.text.tweens.play("itemIncrement")
        this.textBackdrop.text = `x${count}`;
        this.text.text = `x${count}`; 
    }

    destroy(): void {
        this.textBackdrop.destroy()
        this.text.destroy()
    }


}