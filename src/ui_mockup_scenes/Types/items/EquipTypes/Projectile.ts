import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import EquipType from "./EquipType";

export default class Projectile extends EquipType {

	projectileType: string;

    initialize(options: Record<string, any>): void {
    }

    doAnimation(): void {
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let swing = scene.add.animatedSprite("swing", "primary");
        swing.animation.play("swing", true);

        return [swing];
    }

}