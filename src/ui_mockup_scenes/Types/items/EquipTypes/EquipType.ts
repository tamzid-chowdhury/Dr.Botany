import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Scene from "../../../../Wolfie2D/Scene/Scene";

export default abstract class EquipType {
    spriteKey: string;

    damage: number;

    displayName: string;

    cooldown: number;

    sfxKey: string;

    abstract initialize(options: Record<string, any>): void;

    abstract doAnimation(...args: any): void;

    abstract createRequiredAssets(scene: Scene): Array<any>;

}