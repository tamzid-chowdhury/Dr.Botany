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
        const itemSlot1 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(1025,870), text:'x23'});
        itemSlot1.size.set(50,33)
        itemSlot1.setHAlign("right")
        itemSlot1.setVAlign("bottom")
        itemSlot1.borderRadius = 8; 
        itemSlot1.borderWidth = 2; 
        itemSlot1.fontSize = 14;
        itemSlot1.backgroundColor = new Color(102, 255, 255);

        const itemSlot2 = <Button>this.scene.add.uiElement(UIElementType.BUTTON,InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(1100,870), text:'x45'});
        itemSlot2.size.set(50,33)
        itemSlot2.setHAlign("right")
        itemSlot2.setVAlign("bottom")
        itemSlot2.borderRadius = 8; 
        itemSlot2.borderWidth = 2; 
        itemSlot2.fontSize = 14;
        itemSlot2.backgroundColor = new Color(204, 102, 0);

        const itemSlot3 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(1175,870), text:'x13'});
        itemSlot3.size.set(50,33)
        itemSlot3.setHAlign("right")
        itemSlot3.setVAlign("bottom")
        itemSlot3.borderRadius = 8; 
        itemSlot3.borderWidth = 2; 
        itemSlot3.fontSize = 14;
        itemSlot3.backgroundColor = new Color(204, 153, 0);
        
        const itemSlot4 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(1250,870), text:'x32'});
        itemSlot4.size.set(50,33)
        itemSlot4.setHAlign("right")
        itemSlot4.setVAlign("bottom")
        itemSlot4.borderRadius = 8; 
        itemSlot4.borderWidth = 2; 
        itemSlot4.fontSize = 14;
        itemSlot4.backgroundColor = new Color(0, 153, 51);

        const itemSlot5 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(1325,870), text:'x32'});
        itemSlot5.size.set(50,33)
        itemSlot5.setHAlign("right")
        itemSlot5.setVAlign("bottom")
        itemSlot5.borderRadius = 8;
        itemSlot5.borderWidth = 2;  
        itemSlot5.fontSize = 14;
        itemSlot5.backgroundColor = new Color(204, 0, 204);

        const itemSlot6 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, InGameUILayers.ITEMS_INVENTORY, {position: new Vec2(1400,870), text:'x41'});
        itemSlot6.size.set(50,33)
        itemSlot6.setHAlign("right")
        itemSlot6.setVAlign("bottom")
        itemSlot6.borderRadius = 8; 
        itemSlot6.borderWidth = 2; 
        itemSlot6.fontSize = 14;
        itemSlot6.backgroundColor = new Color(255, 102, 0);
    }
}