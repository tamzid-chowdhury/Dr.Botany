import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import { Fonts, InGameUILayers } from "../Utils/Enums";

import * as Palette from "../Utils/Colors";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

export default class AnimatedDialog {
	strings: Array<string> = [];
	fullString: string = '';
	fullLen: number;
	revealedLen: number = 0;
	currentString: string = '';
	intervalTime: number = 3;
	elapsedTime: number = 0 ;
	label: Label;
	position: Vec2;
	scene: Scene;
	finished: boolean = false;
	bg: Sprite;
	emitter: Emitter;
	// note make intervalTime a constructor arg to have variable wait time, so that sentences are fast and then maybe ellipses are slower
	constructor(strings: Array<string>, position: Vec2, scene: Scene) {
		this.strings = strings;
		this.currentString = '';
		this.position = position;
		this.scene = scene;

		this.label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_TEXT, {position: new Vec2(position.x, position.y), text: this.currentString});
		this.label.setHAlign('left')
		this.label.setVAlign('middle')
		this.label.font = Fonts.ABBADON_BOLD;
		this.label.fontSize = 48;
		this.label.setBackgroundColor(Palette.offwhite());
		this.label.borderRadius = 0;
		this.emitter = new Emitter();
	}

	start(index: number): void {
		this.label.visible = true;
		this.finished = false;
		this.currentString = '';
		this.label.text = this.currentString;
		this.fullString = this.strings[index]
		this.fullLen = this.fullString.length;
		this.revealedLen = 0;
		this.elapsedTime = 0;
		this.label.sizeToText()

	}

	incrementText(): void {
		// emit textwrite sfx
		this.emitter.fireEvent(GameEventType.STOP_SOUND,  { key: "plant_voice_sfx", loop: false, holdReference: true })
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: "plant_voice_sfx", loop: false, holdReference: true });
		if(this.elapsedTime % this.intervalTime === 0) {
			// dirty fix for double first char
			let nextChar = this.fullString[this.revealedLen];
			this.revealedLen++;
			if(this.fullString[this.revealedLen] === ' ') {
				nextChar = nextChar + this.fullString[this.revealedLen];
				this.revealedLen++;
			} 
			this.currentString = this.currentString + nextChar;
			this.label.text = this.currentString;
			if(this.revealedLen === this.fullLen) {
				// maybe a better way would be to subscribe to an event while an animated dialog is playing and then unsub when finished

				this.finish();
			}
		}
		this.label.sizeToText();
		
		this.elapsedTime ++;
	}

	finish(): void {
		this.emitter.fireEvent(GameEventType.STOP_SOUND,  { key: "plant_voice_sfx", loop: false, holdReference: true })
		this.finished = true;
	}


}