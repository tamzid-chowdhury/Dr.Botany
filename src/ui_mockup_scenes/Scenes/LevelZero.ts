import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Slider from "../../Wolfie2D/Nodes/UIElements/Slider";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import InGameUILayer from "../Layers/InGameUILayer"
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import { UIEvents, UILayers, ButtonNames } from "../Utils/Enums";
import GameLevel from "./GameLevel";

export default class LevelZero extends GameLevel {
    bg: Sprite; 

    loadScene(): void {
        super.loadScene()
        this.load.image("background", "assets/canvas.png");
    }

    startScene(): void {
        super.startScene()
        this.background = this.addUILayer("background");
        
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        
    }
}