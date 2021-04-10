/*import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";
import * as Tweens from "../Utils/Tweens";
import * as Palette from "../Utils/Colors";

// Im thinking this button could encapsulate a position and clickId, and we could swap out a label and sprite interchangeably
export default class GameButton {
	sprite: Sprite;
	label: Label;
	dropShadow: Label;
	type: string;
	name: string;
	constructor(position: Vec2, type: string, isLabel: boolean, isSprite: boolean, name: string, layer: string, addElement: Function, options: Record<string,any>) {
		if(isLabel) {
			this.label = <Label>addElement(type, layer, { position: position, text: `${name}`, size: 24 });
			this.label.size.set(200, 100);
            this.label.borderWidth = 0;
            this.label.borderRadius = 0;
            this.label.font = "PixelSimple";
            this.label.backgroundColor = Palette.logoColor();
            this.label.backgroundColor.a = 0;
            this.label.textColor.a = 0;
            this.label.borderColor = Palette.transparent();
            this.label.tweens.add('slideXFadeIn', Tweens.slideXFadeIn(this.label.position.x, animationDelay, xOffset));
            this.label.tweens.add('slideUpLeft', Tweens.slideUpLeft(endX, this.label.position.y))
            this.label.tweens.add('slideDownRight', Tweens.slideDownRight(endX, this.label.position.y))
            this.label.tweens.add('highlight', Tweens.changeColor(this.label.backgroundColor, this.highlight))
            this.label.tweens.add('unhighlight', Tweens.changeColor(this.highlight, this.label.backgroundColor))
            this.label.onFirstEnter = () => {
                this.label.tweens.play('slideUpLeft');
                this.label.tweens.play('highlight');
            }
            this.label.onLeave = () => {
                this.label.tweens.play('slideDownRight');
                this.label.tweens.play('unhighlight');
            }
		}
		else if(isSprite) {

		}
	}
}
*/