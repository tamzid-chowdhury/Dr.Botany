import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import MaterialType from "../Types/items/MaterialTypes/MaterialType";

export default class MaterialsRegistry extends Registry<MaterialConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        rm.image("jelly", "hw3_assets/sprites/items/greenorb.png"); //UPPERITEM JELLY GREEN ORB FOR NOW
        rm.image("stalk", "hw3_assets/sprites/items/redorb.png"); //DOWNERITEM STALK RED ORB FOR NOW 

        // Load spritesheets
        // rm.spritesheet("slice", "hw3_assets/spritesheets/slice.json");

        // Register default types
        // this.registerItem("slice", Slice);

        // this.registerItem("semiAutoGun", SemiAutoGun);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: MaterialConstructor): void {
        this.add(key, constr);
    }
}

type MaterialConstructor = new (...args: any) => MaterialType;


