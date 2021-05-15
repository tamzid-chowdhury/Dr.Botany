import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Support from "../Types/items/Support";
import { InGame_GUI_Events, InGame_Events } from "../Utils/Enums";
import { PhysicsGroups } from "../Utils/PhysicsOptions";

export default class SupportManager {

    inactiveHealthPacks: Array<Support> = [];
    activeHealthPacks: Array<Support> = [];
    activeAmmoPacks: Array<Support> = [];
    inactiveAmmoPacks: Array<Support> = [];


    numHealthPacks: number;
    numAmmoPacks: number; 
    scene: Scene;
    emitter: Emitter;


    constructor(scene: Scene, numHealthPacks: number = 0, numAmmoPacks: number = 0) { 
        this.scene = scene;
        this.emitter = new Emitter();
        this.numHealthPacks = numHealthPacks; 
        this.numAmmoPacks = numAmmoPacks; 
    }

    addHealthPacks(num : number): void {
        for(let i = 0; i < num; i ++) {
            let healthpack = this.scene.add.sprite("healthpack", 'primary');
            healthpack.scale.set(0.6, 0.6);
            let support = new Support(healthpack, "healthpack", 'healthpack', []);
            support.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
            support.sprite.setGroup(PhysicsGroups.MATERIAL);
            support.sprite.visible = false;
            support.sprite.active = false;
            this.inactiveHealthPacks.push(support);

            this.numHealthPacks = this.numHealthPacks + 1; 
        }
    }

    addAmmoPacks(num: number): void {
        for(let i = 0; i < num; i ++) {  
            let ammopack = this.scene.add.sprite("ammopack", 'primary');
            ammopack.scale.set(0.6, 0.6);
            let support = new Support(ammopack, "ammopack", 'ammopack', []);
            support.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
            support.sprite.setGroup(PhysicsGroups.MATERIAL);
            support.sprite.visible = false;
            support.sprite.active = false;
            this.inactiveAmmoPacks.push(support);  
            
            this.numAmmoPacks = this.numAmmoPacks + 1; 
        }
    }


    hasHealthPacksToSpawn(): boolean {
        return this.inactiveHealthPacks.length > 0; 
    }

    hasAmmoPacksToSpawn(): boolean {
        return this.inactiveAmmoPacks.length > 0; 
    }



    spawnHealthPack(position: Vec2): void {
        let support = this.inactiveHealthPacks.pop();
        console.log("health packs left to spawn:" + this.inactiveHealthPacks.length)
        if(support) {
            this.activeHealthPacks.push(support);
            support.sprite.position = position.clone();
            support.sprite.visible = true;
            support.sprite.active = true;
        } 
    }

    spawnAmmoPack(position: Vec2): void {
        let support = this.inactiveAmmoPacks.pop();
        console.log("ammo packs left to spawn:" + this.inactiveAmmoPacks.length)
        if(support) {
            this.activeAmmoPacks.push(support);
            support.sprite.position = position.clone();
            support.sprite.visible = true;
            support.sprite.active = true;
        } 
    }

    resolveSupport(position: Vec2): void {
        for(let healthpack of this.activeHealthPacks) {
            if (healthpack.sprite.position.distanceTo(position) < 15) {
                let index = this.activeHealthPacks.indexOf(healthpack)
                this.activeHealthPacks.splice(index, 1)
                healthpack.sprite.active = false;
                healthpack.sprite.visible = false;
                healthpack.sprite.position.set(0,0)

                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "healthpack_get", loop: false, holdReference: true});
                this.emitter.fireEvent(InGame_GUI_Events.ADD_HEALTH, {position: position})
                this.emitter.fireEvent(InGame_Events.ADD_PLAYER_HEALTH)

            }


        }

        for(let ammopack of this.activeAmmoPacks) {
            if (ammopack.sprite.position.distanceTo(position) < 15) {
                let index = this.activeAmmoPacks.indexOf(ammopack)
                this.activeAmmoPacks.splice(index, 1)
                ammopack.sprite.active = false;
                ammopack.sprite.visible = false;
                ammopack.sprite.position.set(0,0)

                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "ammopack_get", loop: false, holdReference: true});
                this.emitter.fireEvent(InGame_GUI_Events.REFILL_AMMO, {position: position});
                this.emitter.fireEvent(InGame_Events.REFRESH_AMMO)

            }
        }
    }    
}