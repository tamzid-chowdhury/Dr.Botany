import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import Graphic from "../../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../../Wolfie2D/Nodes/UIElement";
import Button from "../../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import { UILayers, ButtonNames, InGameUILayers } from "../../Utils/Enums";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";

export default class ItemsInventoryLayer {
    layer: UILayer; 
    scene: Scene; 
    font: string;
    
    constructor(scene: Scene, font: string) {
        this.scene = scene; 
        this.font = font; 
        this.layer = scene.addUILayer(InGameUILayers.ITEMS_INVENTORY)
        this.layer.setHidden(false); 
        this.initilizeItemInventory()
    }

    initilizeItemInventory(): void{

        //////////////THESE ARE NOT ORDERED CORRECTLY MAKE SURE YOU CHECK THE VARIABLE NAME TO CONFIRM WHICH ITEM YOU ARE EDITING//////////////////////////////////////////////////

        let itemSlotNum1 = this.scene.add.sprite("itemslot2",InGameUILayers.ITEMS_INVENTORY)
        itemSlotNum1.scale = new Vec2(.07, .07);
        itemSlotNum1.position.set(430,220);

        let itemSlotNum1Label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(430,220), text:'1'});
        itemSlotNum1Label.fontSize = 30; 

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let itemSlotNum6 = this.scene.add.sprite("itemslot2",InGameUILayers.ITEMS_INVENTORY)
        itemSlotNum6.scale = new Vec2(.07, .07);
        itemSlotNum6.position.set(450,260);

        let itemSlotNum6Label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(450,260), text:'6'});
        itemSlotNum6Label.fontSize = 30; 

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let itemSlotNum5 = this.scene.add.sprite("itemslot3",InGameUILayers.ITEMS_INVENTORY)
        itemSlotNum5.scale = new Vec2(.07, .07);
        itemSlotNum5.position.set(430,260);

        let itemSlotNum5Label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(430,260), text:'5'});
        itemSlotNum5Label.fontSize = 30; 

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let itemSlotNum2 = this.scene.add.sprite("itemslot1",InGameUILayers.ITEMS_INVENTORY)
        itemSlotNum2.scale = new Vec2(.07, .07);
        itemSlotNum2.position.set(450,220);

        let itemSlotNum2Label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(450,220), text:'2'});
        itemSlotNum2Label.fontSize = 30; 

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let itemSlotNum4 = this.scene.add.sprite("itemslot3",InGameUILayers.ITEMS_INVENTORY)
        itemSlotNum4.scale = new Vec2(.07, .07);
        itemSlotNum4.position.set(450,240);

        let itemSlot4Label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(450,240), text:'4'});
        itemSlot4Label.fontSize = 30; 

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        let itemSlotNum3 = this.scene.add.sprite("itemslot1",InGameUILayers.ITEMS_INVENTORY)
        itemSlotNum3.scale = new Vec2(.07, .07);
        itemSlotNum3.position.set(430,240);

        let itemSlotNum3Label = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(430,240), text:'3'});
        itemSlotNum3Label.fontSize = 30; 

        

        
        
    }
}