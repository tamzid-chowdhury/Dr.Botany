import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import WeaponType from "./WeaponType";

export default class Swing extends WeaponType {

    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.cooldown = options.cooldown;
        this.displayName = options.displayName;
        this.spriteKey = options.spriteKey;
        this.useVolume = options.useVolume;
    }

    doAnimation(attacker: GameNode, direction: Vec2, sliceSprite: AnimatedSprite): void {
        // TODO: Rotate weapon by 180 degrees, spawn a swipe sprite
        // // Rotate this with the game node
        // sliceSprite.rotation = attacker.rotation;

        // // Move the slice out from the player
        // sliceSprite.position = attacker.position.clone().add(direction.scaled(16));
        
        // // Play the slice animation w/o loop, but queue the normal animation
        // sliceSprite.animation.play("SLICE");
        // sliceSprite.animation.queue("NORMAL", true);
    }

    createRequiredAssets(scene: Scene): [AnimatedSprite] {
        let swing = scene.add.animatedSprite("swing", "primary");
        swing.animation.play("NORMAL", true);

        return [swing];
    }

    hits(node: GameNode, swingSprite: AnimatedSprite): boolean {
        return swingSprite.boundary.overlaps(node.collisionShape);
    }
}