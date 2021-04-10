import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import AnimationManager from "../../Wolfie2D/Rendering/Animations/AnimationManager";

/** An sprite with specified animation frames. */
export default class TextureScrollingSprite extends AnimatedSprite {
    /** The number of columns in this sprite sheet */
    protected numCols: number;
	protected scrollOffset: number;
    get cols(): number {
        return this.numCols;
    }

    /** The number of rows in this sprite sheet */
    protected numRows: number;

    get rows(): number {
        return this.numRows;
    }

    /** The animationManager for this sprite */
    animation: AnimationManager;

    // constructor(spritesheet: Spritesheet){
	// 	super();
    // }

    /**
     * Gets the image offset for the current index of animation
     * @param index The index we're at in the animation
     * @returns A Vec2 containing the image offset
     */
    getAnimationOffset(index: number): Vec2 {
        return new Vec2((index % this.numCols) * this.size.x, Math.floor(index / this.numCols) * this.size.y);
    }
}