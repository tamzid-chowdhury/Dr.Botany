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
import LevelZero from "../../Scenes/LevelZero";
import GameButton from "../../Classes/GameButton"

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

        let weaponBox1 = this.scene.add.sprite("weaponslot1",InGameUILayers.WEAPONS_INVENTORY)
        weaponBox1.scale = new Vec2(.11, .11);
        weaponBox1.position.set(15,15);

        const weaponSlot1 = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.INGAMEUILAYER, {position: new Vec2(25,24), text:'x3'});
        weaponSlot1.fontSize = 18;
        weaponSlot1.size.set(60,40)
        weaponSlot1.backgroundColor = Color.TRANSPARENT;

        

        let weaponBox2 = this.scene.add.sprite("weaponslot2",InGameUILayers.WEAPONS_INVENTORY)
        weaponBox2.scale = new Vec2(.11, .11);
        weaponBox2.position.set(45,15);
      
        const weaponSlot2 = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.INGAMEUILAYER, {position: new Vec2(45,24), text:'x5'});
        weaponSlot2.fontSize = 18;
        weaponSlot2.size.set(60,40)
        weaponSlot2.backgroundColor = Color.TRANSPARENT;

        let shovel = this.scene.add.sprite("shovel",InGameUILayers.WEAPONS_INVENTORY)
        shovel.scale = new Vec2(.7,.7)
        shovel.position.set(15,17);
    }
}