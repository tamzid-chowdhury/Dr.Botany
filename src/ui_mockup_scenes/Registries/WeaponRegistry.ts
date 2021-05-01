import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import Projectile from "../Types/items/WeaponTypes/Projectile";
import WeaponType from "../Types/items/WeaponTypes/WeaponType";

export default class WeaponTemplateRegistry extends Registry<WeaponConstructor> {
    
    public preload(): void {
        const rm = ResourceManager.getInstance();

        rm.image("shovel", "assets/weapons/shovel.png");

        rm.spritesheet("swing", "assets/weapons/swing_sprite.json");

        // Register default types
        this.registerItem("projectile", Projectile);

        // this.registerItem("semiAutoGun", SemiAutoGun);
    }

    // We don't need this for this assignment
    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, constr: WeaponConstructor): void {
        this.add(key, constr);
    }
}

type WeaponConstructor = new (...args: any) => WeaponType;



export class WeaponTypeRegistry extends Registry<WeaponType> {
    
    public preload(): void {}

    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, type: WeaponType): void {
        this.add(key, type);
    }
}