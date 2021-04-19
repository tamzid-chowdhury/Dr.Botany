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
import InGameUILayer from "../Layers/InGameUI/InGameUILayer"
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import { UIEvents, UILayers, ButtonNames, InGameUILayers, WindowEvents, InGame_Events, InGame_GUI_Events } from "../Utils/Enums";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import Game from "../../Wolfie2D/Loop/Game";
import EnemyController from "../Enemies/EnemyController"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import * as Tweens from "../Utils/Tweens";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Material from "../GameSystems/items/Material"

export default class GameLevel extends Scene {
    defaultFont: string = 'Round';
    screenCenter: Vec2; 
    pauseScreenToggle: boolean = true; 

    //initialize layers 
    primary:        Layer; 
    background:     Layer; 
    cursorLayer:    Layer; 
    inGameUILayer:  InGameUILayer;
    pauseScreenLayer: PauseScreenLayer; 

    reticle: Sprite;
    player: AnimatedSprite;
    plant: Sprite;
    shadow: Sprite;
    swing: Sprite
    defaultEquip: Sprite;
    shadowOffset: Vec2 = new Vec2(0, 10);

    droppedMaterial: Array<Material> = []; 
    shouldMaterialMove: boolean = false;


    loadScene(): void {
        this.load.image("temp_cursor", "assets/misc/cursor.png");
        this.load.image("reticle", "assets/misc/reticle.png");
        this.load.image("temp_button", "assets/ui_art/button.png");
        this.load.image("ui_square", "assets/ui_art/ui_square.png");
        this.load.image("ui_square_v2", "assets/ui_art/ui_square_v2.png");
        this.load.image("ui_circle", "assets/ui_art/ui_circle.png");
        this.load.image("cursor_clicked", "assets/misc/cursor_clicked.png")
        this.load.image("healthbar", "assets/ui_art/health_bar_wip.png")
        this.load.image("growthbar", "assets/ui_art/growth_bar_wip.png")
        this.load.image("moodbar", "assets/ui_art/mood_bar_wip.png")

        // this.load.image("player", "assets/player/dr_botany_wip.png");
        this.load.spritesheet("player", "assets/player/dr_botany.json")
        this.load.image("shadow", "assets/player/shadow_sprite.png");
        this.load.image("shovel", "assets/weapons/shovel.png");
        this.load.image("green_orb", "assets/items/greenorb.png");
        this.load.image("red_orb", "assets/items/redorb.png");
        this.load.spritesheet("swing_sprite", "assets/weapons/swing_sprite.json" )
        this.load.spritesheet("plant", "assets/plant/plant.json" )

    }

    startScene(): void {
        this.receiver.subscribe(GameEventType.MOUSE_DOWN);
        this.receiver.subscribe(GameEventType.MOUSE_UP);
        this.receiver.subscribe(GameEventType.KEY_DOWN);
        this.receiver.subscribe(InGame_Events.LEVEL_LOADED);
        this.receiver.subscribe(InGame_Events.DOING_SWING);
        this.receiver.subscribe(InGame_Events.FINISHED_SWING);
        this.receiver.subscribe(InGame_Events.START_SWING);
        this.receiver.subscribe(InGame_Events.DO_SCREENSHAKE);
        this.receiver.subscribe(InGame_Events.SPAWN_UPPER);
        this.receiver.subscribe(InGame_Events.SPAWN_DOWNER);
        this.receiver.subscribe(InGame_Events.PLAYER_ATTACK_ENEMY);
        this.receiver.subscribe(InGame_Events.PROJECTILE_HIT_ENEMY);

        this.addLayer("primary", 10);
        this.addLayer("secondary", 9);

    }

    updateScene(deltaT: number){
        super.updateScene(deltaT);
        this.inGameUILayer.update(deltaT);
        // update positions and rotations
        let mousePos = Input.getMousePosition();
        let rotateTo = Input.getGlobalMousePosition();
        this.reticle.position = mousePos;


        // if(Input.isKeyJustPressed("m")){
        //     for(let material of this.droppedMaterial){
        //         material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
        //         material.sprite.setGroup("materials");
        //         this.shouldMaterialMove = true;
        //     }

        // }

        for(let material of this.droppedMaterial){ 
            if(material.sprite.position.distanceTo(this.player.position) < 10){
                if(material.type === "upper"){
                    this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_UPPER_COUNT)
                }
                if(material.type === "downer"){
                    this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_DOWNER_COUNT)
                }                

                material.sprite.destroy();
                
                let index = this.droppedMaterial.indexOf(material) 
                this.droppedMaterial.splice(index,1)

            }

            if(material.sprite.position.distanceTo(this.player.position) < 75){ 
                let dirToPlayer = material.sprite.position.dirTo(this.player.position);
                material.sprite._velocity = dirToPlayer;
                let dist = material.sprite.position.distanceSqTo(this.player.position);
                let speedSq = Math.pow(300, 2);
                material.sprite._velocity.normalize();
                material.sprite._velocity.mult(new Vec2(speedSq / dist, speedSq / dist));
                material.sprite.move(material.sprite._velocity.scaled(deltaT));
            }
        }
        


        // if(this.shouldMaterialMove){
        //     for(let material of this.droppedMaterial){ 
        //             let dirToPlayer = material.sprite.position.dirTo(this.player.position);
        //             material.sprite._velocity = dirToPlayer;
        //             let dist = material.sprite.position.distanceSqTo(this.player.position);
        //             let speedSq = Math.pow(1000, 2);
        //             // if(Math.abs(ownerPosX - playerPosX) < (this.playerSize.x / 2) ) this.owner._velocity.x = 0;
        //             // if(Math.abs(ownerPosY - playerPosY) < (this.playerSize.y / 2) + 6) this.owner._velocity.y = 0;
        //             material.sprite._velocity.normalize();
        //             material.sprite._velocity.mult(new Vec2(speedSq / dist, speedSq / dist));
        //             material.sprite.move(material.sprite._velocity.scaled(deltaT));
        //     }
        // }


            
        
        if(Input.isKeyJustPressed("p")){
            if(this.pauseScreenLayer !== undefined) {
                if(this.pauseScreenToggle){
                    for (let button of this.pauseScreenLayer.menuButtons) {
                        //button.label.tweens.play('slideXFadeIn')
                        //button.sprite.tweens.play('spriteSlideXFadeIn')
                        button.label.textColor.a = 1; 
                    }
                    this.pauseScreenToggle = false; 
                }
                else{
                    for (let button of this.pauseScreenLayer.menuButtons) {
                        //button.label.tweens.play('slideXFadeOut')
                        //button.sprite.tweens.play('spriteSlideXFadeOut')
                        button.label.textColor.a = 0; 
                    }
                    this.pauseScreenToggle = true; 
                }
            }
            

        }


        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            if(event.type === InGame_Events.PROJECTILE_HIT_ENEMY) {
                console.log('projectile hit enemy')
            }
            if(event.type === WindowEvents.RESIZED) {
            }

            if(event.type === InGame_Events.DO_SCREENSHAKE) {
                let dir = event.data.get("dir");
                this.viewport.doScreenShake(dir);

            }

            if(event.type === InGame_Events.LEVEL_LOADED) {
                this.screenCenter = this.viewport.getHalfSize();
            }
            
            if(event.type === InGame_Events.SPAWN_UPPER) {
                let position = event.data.get("position");
                let upper = this.add.sprite("green_orb", 'primary');
                upper.position = position; 
                upper.scale.set(0.6, 0.6);
                let material = new Material(upper,"upper")
                material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                material.sprite.setGroup("materials");
                this.droppedMaterial.push(material)
            }

            if(event.type === InGame_Events.PLAYER_ATTACK_ENEMY) {
                // let node = this.sceneGraph.getNode(event.data.get("node"));
                // let other = this.sceneGraph.getNode(event.data.get("other"));
                // let node2 = this.sceneGraph.getNode(event.data.get("owner"));
                // console.log(node2)
                // console.log(other)
                // console.log(node)
                // if( node === this.player) {
                //     console.log("node is player ");
                // }
                // else {
                //     console.log("node is enemey");
                //     console.log(other)
                // }aw
                
                
            }

            if(event.type === InGame_Events.PLAYER_ENEMY_COLLISION) {
                let node = this.sceneGraph.getNode(event.data.get("node"));
                let other = this.sceneGraph.getNode(event.data.get("other"));

                if (node === this.player) {
                    console.log("node is player");
                    (<PlayerController>this.player._ai).damage(1);

                    // add tweens that bumps from the enemy collision
                    console.log((<PlayerController>this.player._ai).health);
                }
            }

            if(event.type === InGame_Events.SPAWN_DOWNER) {
                let position = event.data.get("position");
                let downer = this.add.sprite("red_orb", 'primary');
                downer.position = position; 
                downer.scale.set(0.6, 0.6);
                let material = new Material(downer,"downer")
                material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                material.sprite.setGroup("materials");
                this.droppedMaterial.push(material)
            }            

        }
    }

    initPlant(mapSize: Vec2): void {
        this.plant = this.add.animatedSprite('plant', "primary");
        this.plant.position.set(mapSize.x/2, mapSize.y/4);
        this.plant.scale.set(0.2, 0.2);
        (<AnimatedSprite>this.plant).animation.play("EH")
        // This has to be touched
        // this.plant.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
        // this.plant.colliderOffset.set(0,10);
        // play with this // maybe add a condition for each enemy
        
        // TODO: define a specific physics group whose collider is half the size of the sprite for collision objects that the player can go behind
        // this.plant.setGroup("ground");
        // this.plant.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
    }   

    initPlayer(mapSize: Vec2): void {
        this.player = this.add.animatedSprite("player", "primary");
        let playerOptions = {
            mapSize: mapSize, 
            speed: 150,
            shadow: this.add.sprite("shadow", "secondary"),
            defaultWeapon: this.add.sprite("shovel", "secondary"),
            swingSprite: this.add.animatedSprite("swing_sprite", "primary")
        }

        this.player.addAI(PlayerController, playerOptions);
        this.player.animation.play("IDLE");
    }

    initInventory(): void {

    }

    initEquipment(): void {

    }

    initGameUI(halfsize: Vec2): void { 
        this.inGameUILayer = new InGameUILayer(this, halfsize, this.defaultFont, this.viewport);

    }

    initViewport(mapSize: Vec2): void {
        let origin = this.viewport.getOrigin();
        this.viewport.setBounds(origin.x, origin.y, mapSize.x, mapSize.y+24);
        // NOTE: Viewport can only see 1/4 of full 1920x1080p canvas
        this.viewport.setSize(480, 270);
    }

    initReticle(): void { 
        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.reticle = this.add.sprite("reticle", UILayers.CURSOR);
        this.reticle.scale = new Vec2(0.7, 0.7);

    }
}