import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIEvents } from "../Utils/Enums";

export default class GameToggle {
	borderSprite: Sprite;
	fillSprite: Sprite;
	invisibleLabel: Label;
	constructor(borderSprite: Sprite, fillSprite: Sprite, invisibleLabel: Label){
		this.borderSprite = borderSprite;
		this.fillSprite = fillSprite;
		this.invisibleLabel = invisibleLabel;
		this.invisibleLabel.onClickEventId = UIEvents.CLICKED_TOGGLE;

	}


	toggleFill(): void {
		this.fillSprite.alpha = this.fillSprite.alpha === 0 ? 1 : 0;
	}

}
