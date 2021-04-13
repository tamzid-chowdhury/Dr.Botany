import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../../Wolfie2D/Nodes/UIElement";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Slider from "../../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { UILayers, ButtonNames, InGameUILayers } from "../../Utils/Enums";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";

export default class MoodBarLayer {
    layer: UILayer; 
    scene: Scene; 
    font: string;
    
    constructor(scene: Scene, font: string){
        this.scene = scene; 
        this.font = font; 
        this.layer = scene.addUILayer(InGameUILayers.MOOD_BAR)
        this.layer.setHidden(false); 
        this.initializeMoodBar()
        

    }

    initializeMoodBar(): void{
        const moodSlider = <Slider>this.scene.add.uiElement(UIElementType.SLIDER, InGameUILayers.MOOD_BAR, {position: new Vec2(1650,870), text:'Mood'});
        moodSlider.size.set(350,40)
    }
}