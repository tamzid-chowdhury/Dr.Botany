import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { UILayers, ButtonNames, InGameUILayers } from "../Utils/Enums";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import WeaponsInventoryLayer from "./InGameUI/WeaponsInventoryLayer";
import ItemsInventoryLayer from "./InGameUI/ItemsInventoryLayer"
import HealthBarLayer from "./InGameUI/HealthBarLayer"
import GrowthBarLayer from "./InGameUI/GrowthBarLayer"
import MoodBarLayer from "./InGameUI/MoodBarLayer"
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";

export default class InGameUI {
    layer: Layer; 
    scene: Scene;
    center: Vec2;
    viewPort: Viewport;
    font: string; 

    //nested layers 
    healthBarLayer: HealthBarLayer; 
    growthBarLayer: GrowthBarLayer; 
    weaponsInventoryLayer: WeaponsInventoryLayer; 
    itemsInventoryLayer: ItemsInventoryLayer; 
    moodBarLayer: MoodBarLayer; 
    


    constructor(scene: Scene, center: Vec2, font: string, viewport: Viewport){
        this.scene = scene; 
        this.font = font; 
        this.center = center; 
        
        console.log(viewport.getView());
        console.log(center);

        this.layer = scene.addLayer(InGameUILayers.INGAMEUILAYER,13)
        this.layer.setHidden(false); 

        this.weaponsInventoryLayer = new WeaponsInventoryLayer(this.scene, this.font, this.center);
        this.itemsInventoryLayer = new ItemsInventoryLayer(this.scene, this.font);
        this.healthBarLayer = new HealthBarLayer(this.scene, this.font,this.center);
        this.growthBarLayer = new GrowthBarLayer(this.scene, this.font); 
        this.moodBarLayer = new MoodBarLayer(this.scene, this.font);



    }


}