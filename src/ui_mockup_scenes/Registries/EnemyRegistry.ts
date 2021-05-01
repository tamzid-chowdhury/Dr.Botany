import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import EnemyType from "../Types/enemies/EnemyType";
import Leaping from "../Types/enemies/LeapingType";
import Ram from "../Types/enemies/RamType";
import Spitting from "../Types/enemies/SpittingType";

export default class EnemyTemplateRegistry extends Registry<EnemyConstructor> {
    
    public preload(): void {
        // const rm = ResourceManager.getInstance();

        // rm.image("orange_mushroom", "assets/enemies/orange_mushroom.json"); 
        // rm.image("slime_wip", "assets/enemies/slime_wip.json"); 


        // this.registerItem("ram", Ram);
        // this.registerItem("leaping", Leaping);
        // this.registerItem("spitting", Spitting);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: EnemyConstructor): void {
        this.add(key, constr);
    }
}

type EnemyConstructor = new (...args: any) => EnemyType;


export class EnemyTypeRegistry extends Registry<EnemyType> {
    
    public preload(): void {}

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, type: EnemyType): void {
        this.add(key, type);
    }
}



