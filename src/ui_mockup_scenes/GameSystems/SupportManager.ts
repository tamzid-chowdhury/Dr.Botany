import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Support from "../Types/items/Support";
import { InGame_GUI_Events } from "../Utils/Enums";
import { PhysicsGroups } from "../Utils/PhysicsOptions";

export default class SupportManager {

    inactiveHealthPacks: Array<Support> = [];
    activeHealthPacks: Array<Support> = [];
    activeAmmoPacks: Array<Support> = [];
    inactiveAmmoPacks: Array<Support> = [];


    maxSupportItems: number;
    scene: Scene;
    emitter: Emitter;


    constructor(scene: Scene, size: number = 10) { 
        this.scene = scene;
        this.emitter = new Emitter();
        this.maxSupportItems = size;
        for(let i = 0; i < this.maxSupportItems; i ++) {
            if(i % 2 === 0) {
                let healthpack = this.scene.add.sprite("healthpack", 'primary');
                healthpack.scale.set(0.6, 0.6);
                let support = new Support(healthpack, "healthpack", 'healthpack', []);
                support.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                support.sprite.setGroup(PhysicsGroups.MATERIAL);
                support.sprite.visible = false;
                support.sprite.active = false;
                this.inactiveHealthPacks.push(support);
            }
            else {
                let ammopack = this.scene.add.sprite("ammopack", 'primary');
                ammopack.scale.set(0.6, 0.6);
                let support = new Support(ammopack, "ammopack", 'ammopack', []);
                support.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                support.sprite.setGroup(PhysicsGroups.MATERIAL);
                support.sprite.visible = false;
                support.sprite.active = false;
                this.inactiveAmmoPacks.push(support);
            }
            
        }
    }

    spawnHealthPack(position: Vec2): void {
        let support = this.inactiveHealthPacks.pop();
        if(support) {
            this.activeHealthPacks.push(support);
            support.sprite.position = position.clone();
            support.sprite.visible = true;
            support.sprite.active = true;
        } 
    }

    spawnAmmoPack(position: Vec2): void {
        let support = this.inactiveAmmoPacks.pop();
        if(support) {
            this.activeAmmoPacks.push(support);
            support.sprite.position = position.clone();
            support.sprite.visible = true;
            support.sprite.active = true;
        } 
        else {
            console.log("no ammo packs :(")
        }
    }

    // moveMaterial(sprite: Sprite, position: Vec2, deltaT: number): void {
    //     if (sprite.position.distanceTo(position) < 400) {
    //         let dirToPlayer = sprite.position.dirTo(position);
    //         sprite._velocity = dirToPlayer;
    //         let dist = sprite.position.distanceSqTo(position);
    //         let speedSq = Math.pow(350, 2);
    //         sprite._velocity.normalize();
    //         sprite._velocity.mult(new Vec2(speedSq / (dist/3), speedSq / (dist/3)));
    //         sprite.move(sprite._velocity.scaled(deltaT));
    //     }
    // }

    // resolveMaterials(position: Vec2, deltaT: number): void {
    //     for(let material of this.activeDowners) {
    //         if (material.sprite.position.distanceTo(position) < 15) {
    //             let index = this.activeDowners.indexOf(material)
    //             this.activeDowners.splice(index, 1)
    //             material.sprite.active = false;
    //             material.sprite.visible = false;
    //             material.sprite.position.set(0,0)

    //             this.inactiveDowners.push(material);
    //             this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "material_get", loop: false, holdReference: true});
    //             this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_DOWNER_COUNT, {position: position})

    //         }
    //         else this.moveMaterial(material.sprite, position, deltaT)


    //     }

    //     for(let material of this.activeUppers) {
    //         if (material.sprite.position.distanceTo(position) < 15) {
    //             let index = this.activeUppers.indexOf(material)
    //             this.activeUppers.splice(index, 1)
    //             material.sprite.active = false;
    //             material.sprite.visible = false;
    //             material.sprite.position.set(0,0)

    //             this.inactiveUppers.push(material);
    //             this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "material_get", loop: false, holdReference: true});
    //             this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_UPPER_COUNT, {position: position})

    //         }
    //         else this.moveMaterial(material.sprite, position, deltaT)
    //     }
    // }    
}