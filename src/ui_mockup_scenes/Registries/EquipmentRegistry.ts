/*import Registry from "../../Wolfie2D/Registry/Registries/Registry";
import ResourceManager from "../../Wolfie2D/ResourceManager/ResourceManager";
import Projectile from "../Types/items/EquipTypes/Projectile";
import WeaponType from "../Types/items/EquipTypes/EquipType";

export default class EquipmentTemplateRegistry extends Registry<EquipmentConstructor> {
    
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

    public registerItem(key: string, constr: EquipmentConstructor): void {
        this.add(key, constr);
    }
}

type EquipmentConstructor = new (...args: any) => WeaponType;



export class EquipTypeRegistry extends Registry<WeaponType> {
    
    public preload(): void {}

    public registerAndPreloadItem(key: string): void {}

    public registerItem(key: string, type: WeaponType): void {
        this.add(key, type);
    }
}
*/