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
import { UILayers, ButtonNames } from "../Utils/Enums";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";

export default class InGameUI {
    layer: UILayer; 
    scene: Scene;
    position: Vec2; 
    pauseScreenLayer: Layer; 
    healthBarLayer: Layer; 
    growthBarLayer: Layer; 
    weaponsInventoryLayer: Layer; 
    itemsInventoryLayer: Layer; 
    moodBarLayer: Layer; 
    font: string; 
    constructor(scene: Scene, position: Vec2, font: string){
        this.scene = scene; 
        this.font = font; 
        this.position = position.clone(); 
        this.layer = scene.addUILayer(UILayers.INGAMEUILAYER)
        this.layer.setHidden(false); 

    }

    createHealthBarLayer(): void{
        
    }

    createGrowthBarLayer(): void{

    }

    createWeaponInventoryLayer(): void{

    }

    createItemsInventoryLayer(): void{ 

    }
}