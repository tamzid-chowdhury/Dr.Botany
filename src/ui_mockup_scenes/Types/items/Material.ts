import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import Item from "./Item";

export default class Material extends Item {

    type: string;
    name: string;
    sprite: Sprite; 
    effects: Array<string>;
    constructor(sprite: Sprite, type: string, name: string = '', effects: Array<string> = []){
        super(sprite, name);
        this.type = type;
        // if we get time to implement extra effects for the materials
        this.effects = effects;
    }


    destroy(){
        this.sprite.destroy;
    }


}