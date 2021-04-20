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
import { UILayers, ButtonNames, InGameUILayers, InGame_Events, InGame_GUI_Events, Fonts } from "../../Utils/Enums";
import UILayer from "../../../Wolfie2D/Scene/Layers/UILayer";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import * as Palette from "../../Utils/Colors";
import * as Tweens from "../../Utils/Tweens";
import HealthBar from "./HealthBar";
import EquipSlots from "./EquipSlot";
import GrowthBar from "./GrowthBar";
import MoodBar from "./MoodBar";
import MaterialSlot from "./MaterialSlot";
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
    materialSlots: Array<MaterialSlot> = []; // [0] == upper  [1] == downer
    materialSpriteIds: Array<string> = ["green_orb", "red_orb"];
    receiver: Receiver;
    constructor(scene: Scene, center: Vec2, font: string, viewport: Viewport){
        this.scene = scene; 
        this.font = font; 
        this.center = center; 
        this.viewport = viewport
        this.receiver = new Receiver();

        this.layer = scene.addUILayer(UILayers.INGAME_UI);

        this.healthBar = new HealthBar(scene, center);
        this.moodBar = new MoodBar(scene, center)
        this.equipSlots = new EquipSlots(scene, center);
        let xOffset = this.center.x;
        for(let i = 0; i < 2; i ++) {
            this.materialSlots.push(new MaterialSlot(scene, center, xOffset, this.materialSpriteIds[i]));
            xOffset += this.materialSlots[i].slot.size.x;
        }


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
            let announce = false;
            let position = new Vec2(0,0);
            let announceText = '';
            if(event.type === InGame_GUI_Events.INCREMENT_UPPER_COUNT){
                position = event.data.get("position");
                this.materialSlots[0].updateCount()
                announceText = '+1 Upper'
                announce = true;
                
            }

            if(event.type === InGame_GUI_Events.INCREMENT_DOWNER_COUNT){
                position = event.data.get("position");
                this.materialSlots[1].updateCount()
                announceText = '+1 Downer'
                announce = true;
            }
            if(announce) {
                let announceLabelBackdrop = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_BACKDROP, {position: new Vec2(position.x + 0.5, position.y + 0.5), text:announceText});
                announceLabelBackdrop.font = Fonts.ROUND;
                announceLabelBackdrop.textColor = Palette.black();
                announceLabelBackdrop.fontSize = 26;
                announceLabelBackdrop.tweens.add("announce", Tweens.announce(position.x -32, 32.5))
                

                let announceLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_TEXT, {position: new Vec2(position.x , position.y), text:announceText});
                announceLabel.font = Fonts.ROUND;
                announceLabel.textColor = Palette.white();
                announceLabel.fontSize = 26;
                announceLabel.tweens.add("announce", Tweens.announce(position.x - 32, 32));
                announceLabelBackdrop.tweens.play("announce");
                announceLabel.tweens.play("announce");
                setTimeout(() => {
                    announceLabel.destroy();
                    announceLabelBackdrop.destroy();
                }, 500);
                
            }
        }
    }
 
}