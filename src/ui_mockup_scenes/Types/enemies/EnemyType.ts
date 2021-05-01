import Scene from "../../../Wolfie2D/Scene/Scene";

export default abstract class EnemyType {
    spriteKey: string;

    health: number;

    displayName: string;

    speed: number;

    type: number;

    abstract initialize(options: Record<string, any>): void;

    abstract doAnimation(...args: any): void;

    abstract createRequiredAssets(scene: Scene): Array<any>;

}