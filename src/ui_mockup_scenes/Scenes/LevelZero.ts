import QuadTree from "../../Wolfie2D/DataTypes/QuadTree";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { UIEvents, UILayers, ButtonNames, WindowEvents } from "../Utils/Enums";
import * as Tweens from "../Utils/Tweens";
import * as Palette from "../Utils/Colors";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import { MainMenuLayer } from "../Layers/MainMenuLayer";
import { BackgroundLayer } from "../Layers/BackgroundLayer";
import { ControlsLayer } from "../Layers/ControlsLayer";
import { HelpLayer } from "../Layers/HelpLayer";
import { LevelSelectLayer } from "../Layers/LevelSelectLayer";
import { OptionsLayer } from "../Layers/OptionsLayer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";


export default class LevelZero extends Scene {

}