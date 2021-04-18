import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Item from "./Item";
import MaterialType from "./MaterialTypes/MaterialType";

export default class Material extends Item {
    /** The type of this weapon */
    type: String;

    /** A list of assets this material needs to be animated */
    sprite: Sprite; 

    constructor(sprite: Sprite, type: String){
        super(sprite);

        // Set the material type
        this.type = type;

        // Keep a reference to the sprite of this weapon
        this.sprite = sprite;

    }

    // @override
    use(user: GameNode, userType: string, direction: Vec2): boolean {


        return true;
    }

    destroy(){
        this.sprite.destroy;
        this.type == null; 
    }


}