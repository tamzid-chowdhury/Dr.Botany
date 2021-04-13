import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";
import * as Tweens from "../Utils/Tweens";
import * as Palette from "../Utils/Colors";

// Im thinking this button could encapsulate a position and clickId, and we could swap out a label and sprite interchangeably
export default class GameButton {
	sprite?: Sprite;
	label: Label;
	constructor(sprite: Sprite| null, label: Label) {
        if(sprite) {
            this.sprite = sprite;
        }
		this.label = label;
	}
}
