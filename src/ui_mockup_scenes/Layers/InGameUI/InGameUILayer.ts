import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../../Wolfie2D/Nodes/UIElement";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { UILayers, ButtonNames, InGameUILayers } from "../../Utils/Enums";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import * as Palette from "../../Utils/Colors";
import HealthBar from "./HealthBar";
import EquipSlots from "./EquipSlot";
import GrowthBar from "./GrowthBar";
import ItemsSlot from "./ItemsSlot";
import MoodBar from "./MoodBar";

export default class InGameUI {
    layer: Layer; 
    scene: Scene;
    center: Vec2;
    viewport: Viewport;
    font: string; 

    healthBar: HealthBar;
    growthBar: GrowthBar;
    moodBar: MoodBar;
    equipSlots: EquipSlots;
    itemsSlots: Array<ItemsSlot> = [];
    
    constructor(scene: Scene, center: Vec2, font: string, viewport: Viewport){
        this.scene = scene; 
        this.font = font; 
        this.center = center; 
        this.viewport = viewport


        this.layer = scene.addUILayer(UILayers.INGAME_UI);

        this.healthBar = new HealthBar(scene, center);
        this.growthBar = new GrowthBar(scene, center);
        this.moodBar = new MoodBar(scene, center)
        this.equipSlots = new EquipSlots(scene, center);
        let xOffset = this.center.x - this.center.x/4;
        for(let i = 0; i < 6; i ++) {
            this.itemsSlots.push(new ItemsSlot(scene, center, xOffset));
            if(i === 2) xOffset += (this.center.x/6);
            else xOffset += (this.center.x/12);
        }
        

        // this.itemsInventoryLayer = new ItemsInventoryLayer(this.scene, this.font);
        // this.moodBarLayer = new MoodBarLayer(this.scene, this.font);


    }

    initHealthBar(): void {

    }


}