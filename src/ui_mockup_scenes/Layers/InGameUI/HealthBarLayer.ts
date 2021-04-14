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
import * as Palette  from "../../Utils/Colors";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";

export default class HealthBarLayer {
    layer: UILayer; 
    scene: Scene; 
    font: string;
    sprite: Sprite;
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
       this.sprite = this.scene.add.sprite("healthbar",InGameUILayers.HEALTH_BAR)
       let xOffset =  (this.sprite.size.x/2) + 1;
       let yOffset =  this.center.y - 25;
       this.sprite.position.set(xOffset, yOffset)
       
       this.sprite.scale = new Vec2(0.8,0.8);

        // healthBar.position.set(98,260)50,450


        const backdrop = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.HEALTH_BAR, {position: new Vec2(xOffset+0.5, yOffset + 0.5), text:'HP : 100%'});
        backdrop.font = this.font;
        backdrop.textColor = Palette.black();
        backdrop.fontSize = 24;

        const healthBarLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.HEALTH_BAR, {position: new Vec2(xOffset, yOffset), text:'HP : 100%'});
        healthBarLabel.font = this.font;
        healthBarLabel.textColor = Palette.white();
        healthBarLabel.fontSize = 24;
    }

}