import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../../Wolfie2D/Scene/Layer";
import Scene from "../../../Wolfie2D/Scene/Scene";
import { UILayers, ButtonNames, InGameUILayers, InGame_Events, InGame_GUI_Events, Fonts } from "../../Utils/Enums";
import Viewport from "../../../Wolfie2D/SceneGraph/Viewport";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import * as Palette from "../../Utils/Colors";
import * as Tweens from "../../Utils/Tweens";
import HealthBar from "./HealthBar";
import EquipSlots from "./EquipSlot";
import MoodBar from "./MoodBar";
import MaterialSlot from "./MaterialSlot";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Receiver from "../../../Wolfie2D/Events/Receiver"
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import GrowthBar from "./GrowthBar";

export default class InGameUI implements Updateable {
    layer: Layer; 
    scene: Scene;
    center: Vec2;
    viewport: Viewport;
    font: string; 

    healthBar: HealthBar;
    moodBar: MoodBar;
    growthBar: GrowthBar;
    equipSlots: EquipSlots;
    materialSlots: Array<MaterialSlot> = []; // [0] == downer  [1] == upper
    materialSpriteIds: Array<string> = ["downer", "upper"];
    receiver: Receiver;
    interactLabel: Label; 
    showingInteract: boolean;


    constructor(scene: Scene, center: Vec2, font: string, viewport: Viewport){
        this.scene = scene; 
        this.font = font; 
        this.center = center; 
        this.viewport = viewport
        this.receiver = new Receiver();

        this.layer = scene.addUILayer(UILayers.INGAME_UI);

        this.growthBar = new GrowthBar(scene, center);
        this.healthBar = new HealthBar(scene, center);
        this.moodBar = new MoodBar(scene, center)
        this.equipSlots = new EquipSlots(scene, center);
        let xOffset = this.center.x;
        this.showingInteract = false;
        for(let i = 0; i < 2; i ++) {
            this.materialSlots.push(new MaterialSlot(scene, center, xOffset, this.materialSpriteIds[i]));
            xOffset += 32;
        }

        this.interactLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_TEXT, {position: new Vec2(0,0), text:"E"});
        this.interactLabel.font = Fonts.ABBADON_LIGHT;
        this.interactLabel.textColor = Palette.white();

        // this.growthBarFill = this.scene.add.sprite('growth_bar_fill', UILayers.INGAME_UI);
        // this.growthBarOutline = this.scene.add.sprite('growth_bar_outline', UILayers.INGAME_UI);

        // this.growthBarFill.tweens.add('scaleIn', Tweens.scaleIn(new Vec2(0,0) , new Vec2(1,1),  0, 200));
        // this.growthBarFill.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1,1) , new Vec2(0,0),  0, 200));

        // this.growthBarOutline.tweens.add('scaleIn', Tweens.scaleIn(new Vec2(0,0) , new Vec2(1,1),  0, 200));
        // this.growthBarOutline.tweens.add('scaleOut', Tweens.scaleIn(new Vec2(1,1) , new Vec2(0,0),  0, 200));

        //subscribe to events
        this.receiver.subscribe([
            InGame_GUI_Events.INCREMENT_UPPER_COUNT,
            InGame_GUI_Events.INCREMENT_DOWNER_COUNT,
            InGame_GUI_Events.UPDATE_MOOD_BAR,
            InGame_GUI_Events.CLEAR_UPPER_LABEL,
            InGame_GUI_Events.CLEAR_DOWNER_LABEL,
            InGame_GUI_Events.UPDATE_HEALTHBAR,
            InGame_GUI_Events.SHOW_INTERACT_LABEL,
            InGame_GUI_Events.HIDE_INTERACT_LABEL,
            InGame_GUI_Events.UPDATE_EQUIP_SLOT,
            InGame_GUI_Events.SHOW_GROWTH_BAR,
            InGame_GUI_Events.HIDE_GROWTH_BAR,
            InGame_GUI_Events.UPDATE_EQUIP_SLOT_OUTLINE,
            InGame_GUI_Events.UPDATE_EQUIP_SLOT_AMMO,
            InGame_GUI_Events.ADD_HEALTH,
            InGame_GUI_Events.REFILL_AMMO,
            InGame_GUI_Events.RESET_MOOD_BAR,
            InGame_GUI_Events.UPDATE_GROWTH_BAR,
            InGame_GUI_Events.ANNOUNCE_MOOD_EFFECT
        ]);

    }

    reposition(width: number, height: number) : void {
        this.moodBar.updatePos(width, height);
    }

    update(deltaT:number){
        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            let announce = false;
            let longAnnounce = false; 
            let position = new Vec2(0,0);
            let announceText = '';
            let color;
            if(event.type === InGame_GUI_Events.UPDATE_MOOD_BAR){
                let type = event.data.get('type');
                let moodChange = event.data.get('moodChange');
                if(type == 1){
                    let newPos = (40*moodChange / (this.moodBar.sprite.size.x/16)) +  this.moodBar.happyindicator.position.x;
                    newPos = MathUtils.clamp(newPos, this.moodBar.centerPos.x - this.moodBar.sprite.size.x / 2, this.moodBar.centerPos.x + this.moodBar.sprite.size.x / 2)
                    this.moodBar.happyindicator.tweens.add("slideX", Tweens.indicatorSlideX(this.moodBar.happyindicator.position.x, newPos));   
                    // this.moodBar.happyindicator.scale.x += 1;     
                    // this.moodBar.happyindicator.tweens.add("scale", Tweens.indicatorScaleUpDown(this.moodBar.happyindicator.scale));        
                    this.moodBar.happyindicator.tweens.play("slideX");        
                    // this.moodBar.happyindicator.tweens.play("scale"); 
                }

                if(type == -1){
                    let newPos = (30*(-1*moodChange) / (this.moodBar.sprite.size.x/16)) +  this.moodBar.angryindicator.position.x;
                    newPos = MathUtils.clamp(newPos, this.moodBar.centerPos.x - this.moodBar.sprite.size.x / 2, this.moodBar.centerPos.x + this.moodBar.sprite.size.x / 2)
                    this.moodBar.angryindicator.tweens.add("slideX", Tweens.indicatorSlideX(this.moodBar.angryindicator.position.x, newPos));   
                    // this.moodBar.angryindicator.scale.x += 1;     
                    // this.moodBar.angryindicator.tweens.add("scale", Tweens.indicatorScaleUpDown(this.moodBar.angryindicator.scale));        
                    this.moodBar.angryindicator.tweens.play("slideX");        
                    // this.moodBar.angryindicator.tweens.play("scale"); 
                }
      
            }

            if(event.type === InGame_GUI_Events.UPDATE_GROWTH_BAR){
                let growthIncrease = event.data.get('growthIncrease');
                let score = event.data.get('score');
                let newPos = this.growthBar.growthBarFill.position.x - growthIncrease;
                newPos = MathUtils.clamp(newPos, this.growthBar.centerPos.x + 211, this.growthBar.centerPos.x + 271)
                this.growthBar.growthBarFill.tweens.add("slideX", Tweens.healthBarSlideX(this.growthBar.growthBarFill.position.x, newPos));          
                this.growthBar.growthBarFill.tweens.play("slideX");     
                this.growthBar.text.text = "Growth: " + score + "%"         
            }

            if(event.type === InGame_GUI_Events.RESET_MOOD_BAR){
                position = event.data.get('playerPosition');
                let newPos = this.moodBar.xOffset; 

    
                    this.moodBar.happyindicator.tweens.add("slideX", Tweens.slowIndicatorSlideX(this.moodBar.happyindicator.position.x, newPos));   
                    // this.moodBar.happyindicator.scale.x += 1;     
                    // this.moodBar.happyindicator.tweens.add("scale", Tweens.indicatorScaleUpDown(this.moodBar.happyindicator.scale));        
                    this.moodBar.happyindicator.tweens.play("slideX");        
                    // this.moodBar.happyindicator.tweens.play("scale");   

                

                    this.moodBar.angryindicator.tweens.add("slideX", Tweens.slowIndicatorSlideX(this.moodBar.angryindicator.position.x, newPos));   
                    // this.moodBar.angryindicator.scale.x += 1;     
                    // this.moodBar.angryindicator.tweens.add("scale", Tweens.indicatorScaleUpDown(this.moodBar.happyindicator.scale));        
                    this.moodBar.angryindicator.tweens.play("slideX");        
                    // this.moodBar.angryindicator.tweens.play("scale");   
                
                announceText = 'MOOD EFFECT FINISHED...RESETTING!'
                color = Palette.white()
                longAnnounce = true;
    
            }

            // if(event.type === InGame_GUI_Events.SHOW_GROWTH_BAR){
            //     if(!this.showingGrowth) {
            //         this.showingGrowth = true;
            //         position = event.data.get("position");
            //         this.growthBarFill.position.set(300, 300);
            //         this.growthBarOutline.position.set(300, 300);
            //         // this.growthBarFill.tweens.add("fadeIn", Tweens.spriteFadeIn(200));
            //         // this.growthBarOutline.tweens.add("fadeIn", Tweens.spriteFadeIn(200));
            //         // this.growthBarFill.tweens.add("fadeOut", Tweens.spriteFadeOut(200));
            //         // this.growthBarOutline.tweens.add("fadeOut", Tweens.spriteFadeOut(200));
            //         this.growthBarFill.tweens.play("scaleIn");
            //         this.growthBarOutline.tweens.play("scaleIn");
            //     }

            // }

            // if(event.type === InGame_GUI_Events.HIDE_GROWTH_BAR){
            //     this.growthBarFill.tweens.play("scaleOut");
            //     this.growthBarOutline.tweens.play("scaleOut");
            //     this.showingGrowth = false;
            // }

            if(event.type === InGame_GUI_Events.UPDATE_HEALTHBAR){
                let damageTaken = event.data.get("damageTaken");
                this.healthBar.takeDamage(damageTaken);
            }


            if(event.type === InGame_GUI_Events.ADD_HEALTH){
                position = event.data.get("position");
                this.healthBar.addHealth();
                announceText = `+1 Health Added`
                color = Palette.greenish();
                announce = true;
            }

            if(event.type === InGame_GUI_Events.REFILL_AMMO){
                position = event.data.get("position");
                announceText = `Ammo Refilled`
                color = Palette.greenish();
                announce = true;
            }
            
            
            if(event.type === InGame_GUI_Events.SHOW_INTERACT_LABEL){
                position = event.data.get("position");
                this.interactLabel.position.set(position.x, position.y-16);
                this.interactLabel.fontSize = 0;
                this.interactLabel.scale = Vec2.ZERO;
                this.interactLabel.tweens.add("scaleTextIn", Tweens.scaleInText(48, 0, 100));
                this.interactLabel.tweens.add("scaleTextOut", Tweens.scaleOutText(48, 0, 100));
                this.showingInteract = true;
                this.interactLabel.tweens.play("scaleTextIn");
            }

            if(event.type === InGame_GUI_Events.HIDE_INTERACT_LABEL){
                if(this.interactLabel && this.showingInteract) {
                    this.showingInteract = false;
                    this.interactLabel.tweens.play("scaleTextOut");
                }

            }
            if(event.type === InGame_GUI_Events.UPDATE_EQUIP_SLOT_AMMO){ 
                let spriteKey = event.data.get("spriteKey");
                let ammo = event.data.get("ammo");
                this.equipSlots.updateCounter(spriteKey, ammo);
            }

            

            if(event.type === InGame_GUI_Events.UPDATE_EQUIP_SLOT){ 
                let slotData = event.data.get("slotData");
                for(let i = 0; i < slotData.length; i ++) {
                    let spriteKey = slotData[i].spriteKey;
                    let ammo = slotData[i].ammo;
                    let hasAmmo = slotData[i].hasAmmo;
                    this.equipSlots.removeSlot(i);
                    this.equipSlots.updateSlot(spriteKey, hasAmmo, ammo, i);
                }

            }

            if(event.type === InGame_GUI_Events.UPDATE_EQUIP_SLOT_OUTLINE){ 
                let spriteKey = event.data.get("spriteKey");
                this.equipSlots.drawOutline(spriteKey);
            }


            if(event.type === InGame_GUI_Events.CLEAR_UPPER_LABEL){
                position = event.data.get("position");
                announceText = `${this.materialSlots[1].count} uppers dropped`
                announce = true;
                color = Palette.yellowish()
                this.materialSlots[1].clearCount()
            }

            if(event.type === InGame_GUI_Events.CLEAR_DOWNER_LABEL){
                position = event.data.get("position");
                announceText = `${this.materialSlots[0].count} downers dropped`
                announce = true;
                color = Palette.reddish()
                this.materialSlots[0].clearCount()

            }
            if(event.type === InGame_GUI_Events.INCREMENT_UPPER_COUNT){
                position = event.data.get("position");
                this.materialSlots[1].updateCount()
                announceText = '+1 Upper'
                color = Palette.white()
                announce = true;
                
            }

            if(event.type === InGame_GUI_Events.INCREMENT_DOWNER_COUNT){
                position = event.data.get("position");
                this.materialSlots[0].updateCount()
                announceText = '+1 Downer'
                color = Palette.white()
                announce = true;
            }

            if(event.type === InGame_GUI_Events.ANNOUNCE_MOOD_EFFECT){
                let type = event.data.get("type");
                let moodEffect = event.data.get("moodEffect")
                position = event.data.get("position");
                
                if(type == 1){
                    announceText = 'Happy Mood Effect Reached: ' + moodEffect
                    color = Palette.yellowish()
                    longAnnounce = true;
                }

                if(type == -1){
                    announceText = 'Angry Mood Effect Reached: ' + moodEffect
                    color = Palette.red()
                    longAnnounce = true;
                }

            }

            if(announce) {
                let announceLabelBackdrop = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_BACKDROP, {position: new Vec2(position.x + 0.5, position.y + 0.5), text:announceText});
                announceLabelBackdrop.font = Fonts.ROUND;
                announceLabelBackdrop.textColor = Palette.black();
                announceLabelBackdrop.fontSize = 26;
                announceLabelBackdrop.tweens.add("announce", Tweens.announce(position.x -32, 32.5))
                

                let announceLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_TEXT, {position: new Vec2(position.x , position.y), text:announceText});
                announceLabel.font = Fonts.ROUND;
                announceLabel.textColor = color;
                announceLabel.fontSize = 26;
                announceLabel.tweens.add("announce", Tweens.announce(position.x - 32, 32));
                announceLabelBackdrop.tweens.play("announce");
                announceLabel.tweens.play("announce");
                setTimeout(() => {
                    announceLabel.destroy();
                    announceLabelBackdrop.destroy();
                }, 600);
                
            }

            if(longAnnounce) {
                let announceLabelBackdrop = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_BACKDROP, {position: new Vec2(position.x + 0.5, position.y + 0.5), text:announceText});
                announceLabelBackdrop.font = Fonts.ROUND;
                announceLabelBackdrop.textColor = Palette.black();
                announceLabelBackdrop.fontSize = 34;
                announceLabelBackdrop.tweens.add("announce", Tweens.announce(position.x -32, 32.5))
                

                let announceLabel = <Label>this.scene.add.uiElement(UIElementType.LABEL, InGameUILayers.ANNOUNCEMENT_TEXT, {position: new Vec2(position.x , position.y), text:announceText});
                announceLabel.font = Fonts.ROUND;
                announceLabel.textColor = color;
                announceLabel.fontSize = 34;
                announceLabel.tweens.add("announce", Tweens.announce(position.x - 32, 32));
                announceLabelBackdrop.tweens.play("announce");
                announceLabel.tweens.play("announce");
                setTimeout(() => {
                    announceLabel.destroy();
                    announceLabelBackdrop.destroy();
                }, 1500);

            }
        }
    }
    destroy(): void {
        this.receiver.destroy();
    }
}