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
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";

export default class HealthBarLayer {
    layer: UILayer; 
    scene: Scene; 
    font: string;
    center: Vec2; 
    
    constructor(scene: Scene, font: string, center: Vec2){
        this.scene = scene; 
        this.font = font; 
        this.center = center; 
        this.layer = scene.addUILayer(InGameUILayers.HEALTH_BAR)
        this.layer.setHidden(false); 
        this.initializeHealthBar()
        

    }

    initializeHealthBar(): void{
        let healthBar = this.scene.add.sprite("healthbar",InGameUILayers.HEALTH_BAR)
        healthBar.scale = new Vec2(1,.5);
        healthBar.position.set(65,260)
        const healthBarLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.HEALTH_BAR, {position: new Vec2(65,260), text:'Health: 100%'});
        healthBarLabel.fontSize = 18;
        healthBarLabel.backgroundColor = Color.RED.lighten();
    }

    
    
}