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
        this.createWeaponInventoryLayer();

    }

    createHealthBarLayer(): void{
        
    }

    createGrowthBarLayer(): void{

    }

    createWeaponInventoryLayer(): void{
        const weaponSlot1 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, UILayers.INGAMEUILAYER, {position: new Vec2(50,30), text:'x3'});
        const weaponSlot2 = <Button>this.scene.add.uiElement(UIElementType.BUTTON, UILayers.INGAMEUILAYER, {position: new Vec2(120,30), text:'x5'});
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

    createItemsInventoryLayer(): void{ 

    }
}