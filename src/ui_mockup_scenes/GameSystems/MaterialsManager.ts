import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Material from "../Types/items/Material";
import { InGame_GUI_Events } from "../Utils/Enums";
import { PhysicsGroups } from "../Utils/PhysicsOptions";

export default class MaterialsManager {

    inactiveDowners: Array<Material> = [];
    activeDowners: Array<Material> = [];
    activeUppers: Array<Material> = [];
    inactiveUppers: Array<Material> = [];


    maxMaterials: number;
    scene: Scene;
    emitter: Emitter;


    constructor(scene: Scene, size: number = 48) { 
        this.scene = scene;
        this.emitter = new Emitter();
        this.maxMaterials = size;
        for(let i = 0; i < this.maxMaterials; i ++) {
            if(i % 2 === 0) {
                let upper = this.scene.add.sprite("upper", 'primary');
                upper.scale.set(0.6, 0.6);
                let material = new Material(upper, "upper", 'upper', []);
                material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                material.sprite.setGroup(PhysicsGroups.MATERIAL);
                material.sprite.visible = false;
                material.sprite.active = false;
                this.inactiveUppers.push(material);
            }
            else {
                let downer = this.scene.add.sprite("downer", 'primary');
                downer.scale.set(0.6, 0.6);
                let material = new Material(downer, "downer", 'downer', []);
                material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                material.sprite.setGroup(PhysicsGroups.MATERIAL);
                material.sprite.visible = false;
                material.sprite.active = false;
                this.inactiveDowners.push(material);
            }
            
        }
    }

    spawnUpper(position: Vec2): void {
        let material = this.inactiveUppers.pop();
        if(material) {
            this.activeUppers.push(material);
            material.sprite.position = position.clone();
            material.sprite.visible = true;
            material.sprite.active = true;
        } 
    }

    spawnDowner(position: Vec2): void {
        let material = this.inactiveDowners.pop();
        if(material) {
            this.activeDowners.push(material);
            material.sprite.position = position.clone();
            material.sprite.visible = true;
            material.sprite.active = true;
        } 
    }

    moveMaterial(sprite: Sprite, position: Vec2, deltaT: number): void {
        if (sprite.position.distanceTo(position) < 400) {
            let dirToPlayer = sprite.position.dirTo(position);
            sprite._velocity = dirToPlayer;
            let dist = sprite.position.distanceSqTo(position);
            let speedSq = Math.pow(350, 2);
            sprite._velocity.normalize();
            sprite._velocity.mult(new Vec2(speedSq / (dist/3), speedSq / (dist/3)));
            sprite.move(sprite._velocity.scaled(deltaT));
        }
    }

    resolveMaterials(position: Vec2, deltaT: number): void {
        for(let material of this.activeDowners) {
            if (material.sprite.position.distanceTo(position) < 15) {
                let index = this.activeDowners.indexOf(material)
                this.activeDowners.splice(index, 1)
                material.sprite.active = false;
                material.sprite.visible = false;
                material.sprite.position.set(0,0)

                this.inactiveDowners.push(material);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "material_get", loop: false, holdReference: true});
                this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_DOWNER_COUNT, {position: position})

            }
            else this.moveMaterial(material.sprite, position, deltaT)


        }

        for(let material of this.activeUppers) {
            if (material.sprite.position.distanceTo(position) < 15) {
                let index = this.activeUppers.indexOf(material)
                this.activeUppers.splice(index, 1)
                material.sprite.active = false;
                material.sprite.visible = false;
                material.sprite.position.set(0,0)

                this.inactiveUppers.push(material);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "material_get", loop: false, holdReference: true});
                this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_UPPER_COUNT, {position: position})

            }
            else this.moveMaterial(material.sprite, position, deltaT)
        }
    }    
}