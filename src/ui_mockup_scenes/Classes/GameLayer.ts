import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import Scene from "../../Wolfie2D/Scene/Scene";
import BackButton from "./BackButton";

export default abstract class GameLayer {

	layer: UILayer;
	position: Vec2;
	scene: Scene;
	font: string;
	sprite: Sprite;
	backButton: BackButton;
	titleLabel: Label;

	abstract initButtons(scene?: Scene): void;
	abstract playEntryTweens(): void;
	abstract playExitTweens(): void;
}