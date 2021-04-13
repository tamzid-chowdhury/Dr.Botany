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

export default class LevelZero extends Scene {
    center: Vec2 = this.viewport.getCenter();
    defaultFont: string = 'Round';
    bg: Sprite; 

    //initialize layers 
    primary: Layer; 
    background: Layer; 
    inGameUILayer: InGameUILayer;
    cursorLayer: Layer; 
    cursor2Layer: Layer; 

    loadScene(): void {
        this.load.image("background", "assets/canvas.png");
        this.load.image("temp_cursor", "assets/cursor.png");
    }

    startScene(): void {
        this.background = this.addUILayer("background");
        this.inGameUILayer = new InGameUILayer(this, this.center,this.defaultFont);
        this.bg = this.add.sprite("background", "background");
    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        
    }
}