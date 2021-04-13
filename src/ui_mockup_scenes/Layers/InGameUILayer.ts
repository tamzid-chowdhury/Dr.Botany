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

export default class InGameUI {
    layer: UILayer; 
    scene: Scene;
    position: Vec2; 
    pauseScreenLayer: Layer; 
    healthBarLayer: HealthBarLayer; 
    growthBarLayer: GrowthBarLayer; 
    weaponsInventoryLayer: WeaponsInventoryLayer; 
    itemsInventoryLayer: ItemsInventoryLayer; 
    moodBarLayer: MoodBarLayer; 
    font: string; 
    constructor(scene: Scene, position: Vec2, font: string){
        this.scene = scene; 
        this.font = font; 
        this.position = position.clone(); 
        this.layer = scene.addUILayer(UILayers.INGAMEUILAYER)
        this.layer.setHidden(false); 
        this.weaponsInventoryLayer = new WeaponsInventoryLayer(this.scene, this.font);
        this.itemsInventoryLayer = new ItemsInventoryLayer(this.scene, this.font);
        this.healthBarLayer = new HealthBarLayer(this.scene, this.font);
        this.growthBarLayer = new GrowthBarLayer(this.scene, this.font); 
        this.moodBarLayer = new MoodBarLayer(this.scene, this.font);

    }


}