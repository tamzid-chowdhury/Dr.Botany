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

export default class WeaponsInventoryLayer {
    layer: UILayer; 
    scene: Scene; 
    font: string;
    center: Vec2;
    
    constructor(scene: Scene, font: string, center: Vec2){
        this.scene = scene; 
        this.font = font; 
        this.center = center; 
        this.layer = scene.addUILayer(InGameUILayers.WEAPONS_INVENTORY)
        this.layer.setHidden(false); 
        this.initializeWeaponInventory()
        

    }

    initializeWeaponInventory(): void{
        const weaponSlot1 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, UILayers.INGAMEUILAYER, {position: new Vec2(10,10), text:'x3'});
        const weaponSlot2 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, UILayers.INGAMEUILAYER, {position: new Vec2(30,10), text:'x5'});
        weaponSlot1.setHAlign("right")
        weaponSlot1.setVAlign("bottom")
        weaponSlot1.fontSize = 14;
        weaponSlot1.size.set(60,40)
        weaponSlot2.setHAlign("right")
        weaponSlot2.setVAlign("bottom")
        weaponSlot2.fontSize = 14;
        weaponSlot2.size.set(60,40)
        weaponSlot1.backgroundColor = new Color(0,0,0)
        weaponSlot2.backgroundColor = new Color(0,0,0)
    }
}