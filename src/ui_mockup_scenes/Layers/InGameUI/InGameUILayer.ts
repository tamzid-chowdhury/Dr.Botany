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
import { UILayers, ButtonNames, InGameUILayers, InGame_Events, InGame_GUI_Events } from "../../Utils/Enums";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import * as Palette from "../../Utils/Colors";
import HealthBar from "./HealthBar";
import EquipSlots from "./EquipSlot";
import GrowthBar from "./GrowthBar";
import ItemsSlot from "./ItemsSlot";
import MoodBar from "./MoodBar";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Receiver from "../../../Wolfie2D/Events/Receiver"

export default class InGameUI implements Updateable {
    layer: Layer; 
    scene: Scene;
    center: Vec2;
    viewport: Viewport;
    font: string; 

    healthBar: HealthBar;
    growthBar: GrowthBar;
    moodBar: MoodBar;
    equipSlots: EquipSlots;
    upperSlot: ItemsSlot;
    downerSlot: ItemsSlot
    receiver: Receiver = new Receiver();
    
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
        let xOffset = this.center.x - this.center.x/5.5;
        this.upperSlot = new ItemsSlot(scene, center, xOffset, "green_orb")
        xOffset = this.center.x + this.center.x/5.5;
        this.downerSlot = new ItemsSlot(scene, center, xOffset, "red_orb")


        //subscribe to events
        this.receiver.subscribe(InGame_GUI_Events.INCREMENT_UPPER_COUNT);
        this.receiver.subscribe(InGame_GUI_Events.INCREMENT_DOWNER_COUNT);
        



    }

    reposition(width: number, height: number) : void {
        this.moodBar.updatePos(width, height);
    }

    update(deltaT:number){
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            if(event.type === InGame_GUI_Events.INCREMENT_UPPER_COUNT){
                this.upperSlot.updateCount()

                
            }

            if(event.type === InGame_GUI_Events.INCREMENT_DOWNER_COUNT){
                this.downerSlot.updateCount()
                
            }
            
        }
    }
 
}