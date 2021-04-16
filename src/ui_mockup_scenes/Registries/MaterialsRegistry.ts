import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import WeaponType from "../GameSystems/items/WeaponTypes/WeaponType";

export default class MaterialsRegistry extends Registry<MaterialConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        // Load sprites
        // rm.image("pistol", "hw3_assets/sprites/pistol.png");
        // rm.image("knife", "hw3_assets/sprites/knife.png");
        // rm.image("laser_rifle", "hw3_assets/sprites/laser_rifle.png");

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

type MaterialConstructor = new (...args: any) => WeaponType;


