import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Input from "../Wolfie2D/Input/Input";
import Graphic from "../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../Wolfie2D/Nodes/UIElement";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import Slider from "../Wolfie2D/Nodes/UIElements/Slider";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../Wolfie2D/Scene/Layer";
import Scene from "../Wolfie2D/Scene/Scene";
import Color from "../Wolfie2D/Utils/Color";


export default class default_scene extends Scene {
    private logo: Sprite;
    private bg: Sprite;
    private primary: Layer;
    private background: Layer;
    private about: Layer;
    private logoColor = new Color(204, 152, 114);
    // private highlight = new Color(168, 201, 153);
    private highlight = new Color(76, 175, 80)
    private dropColor = new Color(80, 82, 80);
    private darkHighlight = new Color(140, 100, 81);
    // private darkHighlight = new Color(45, 46, 45);
	private dropShadow: UIElement;

    loadScene(): void {
        this.load.image("logo", "assets/logo.png");
        this.load.image("background", "assets/canvas.png");
    }

    setDropShadow(pos: Vec2) {
        this.dropShadow.position.set(pos.x + 5, pos.y+5);
	}

    createGameGUI(center: Vec2): void {
        let startX = center.x;
        let startY = center.y;

        this.createWeaponSlots()

        const healthBar = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(500,680), text:'Health'});
        healthBar.size.set(950,40)
        healthBar.backgroundColor = new Color(255,0,0)

        const growthBar = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1880,480), text:'Growth'});
        growthBar.size.set(50,450)
        growthBar.backgroundColor = new Color(0,255,0)

        const itemSlot1 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1025,680), text:'x23'});
        itemSlot1.size.set(50,33)
        itemSlot1.setHAlign("right")
        itemSlot1.setVAlign("bottom")
        itemSlot1.borderRadius = 8; 
        itemSlot1.borderWidth = 2; 
        itemSlot1.fontSize = 14;
        itemSlot1.backgroundColor = new Color(102, 255, 255);

        const itemSlot2 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1100,680), text:'x45'});
        itemSlot2.size.set(50,33)
        itemSlot2.setHAlign("right")
        itemSlot2.setVAlign("bottom")
        itemSlot2.borderRadius = 8; 
        itemSlot2.borderWidth = 2; 
        itemSlot2.fontSize = 14;
        itemSlot2.backgroundColor = new Color(204, 102, 0);

        const itemSlot3 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1175,680), text:'x13'});
        itemSlot3.size.set(50,33)
        itemSlot3.setHAlign("right")
        itemSlot3.setVAlign("bottom")
        itemSlot3.borderRadius = 8; 
        itemSlot3.borderWidth = 2; 
        itemSlot3.fontSize = 14;
        itemSlot3.backgroundColor = new Color(204, 153, 0);
        
        const itemSlot4 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1250,680), text:'x32'});
        itemSlot4.size.set(50,33)
        itemSlot4.setHAlign("right")
        itemSlot4.setVAlign("bottom")
        itemSlot4.borderRadius = 8; 
        itemSlot4.borderWidth = 2; 
        itemSlot4.fontSize = 14;
        itemSlot4.backgroundColor = new Color(0, 153, 51);

        const itemSlot5 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1325,680), text:'x32'});
        itemSlot5.size.set(50,33)
        itemSlot5.setHAlign("right")
        itemSlot5.setVAlign("bottom")
        itemSlot5.borderRadius = 8;
        itemSlot5.borderWidth = 2;  
        itemSlot5.fontSize = 14;
        itemSlot5.backgroundColor = new Color(204, 0, 204);

        const itemSlot6 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(1400,680), text:'x41'});
        itemSlot6.size.set(50,33)
        itemSlot6.setHAlign("right")
        itemSlot6.setVAlign("bottom")
        itemSlot6.borderRadius = 8; 
        itemSlot6.borderWidth = 2; 
        itemSlot6.fontSize = 14;
        itemSlot6.backgroundColor = new Color(255, 102, 0);

        const moodSlider = <Slider>this.add.uiElement(UIElementType.SLIDER, "primary", {position: new Vec2(1650,680), text:'Mood'});
        moodSlider.size.set(350,40)


    
    }


    createWeaponSlots(): void{
        const weaponSlot1 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(50,30), text:'x3'});
        const weaponSlot2 = <Button>this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(120,30), text:'x5'});
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

    createBackground(): void {
        this.bg = this.add.sprite("background", "background");
        this.bg.position.set(25, -18);
    }

    startScene(): void {
        const center = this.viewport.getCenter();
        this.background = this.addUILayer("background");
        this.primary = this.addUILayer("primary");

        this.createBackground();
        this.createGameGUI(center);

    }


    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();



        }
    }
}