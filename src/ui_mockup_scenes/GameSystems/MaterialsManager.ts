import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Material from "../Types/items/Material";

export default class MaterialsManager {

    private position: Vec2;
    private items: Array<Material>;
    private inventorySlots: Array<Sprite>;
    private slotSize: Vec2;
    private padding: number;
    private currentSlot: number;
    private slotLayer: string;
    private itemLayer: string;
    private selectedSlot: Rect;

    constructor(scene: Scene, size: number, inventorySlot: string, position: Vec2, padding: number){
        this.items = new Array(size);
        this.inventorySlots = new Array(size);
        this.padding = padding;
        this.position = position;
        this.currentSlot = 0;

        // Add layers
        this.slotLayer = "slots";
        scene.addUILayer(this.slotLayer).setDepth(100);
        this.itemLayer = "items";
        scene.addUILayer(this.itemLayer).setDepth(101);

    }

    getItem(): Material {
        return this.items[this.currentSlot];
    }

    /**
     * Changes the currently selected slot
     */
    changeSlot(slot: number): void {
        this.currentSlot = slot;
    }

    /**
     * Gets the currently selected slot
     */
    getSlot(): number {
        return this.currentSlot;
    }

    /**
     * Adds an item to the currently selected slot
     */
    addItem(item: Material): boolean {
        if(!this.items[this.currentSlot]){
            // Add the item to the inventory
            this.items[this.currentSlot] = item;

            return true;
        }
        
        // Failed to add item, something was already in the slot
        return false;
    }

    /**
     * Removes and returns an item from the the currently selected slot, if possible
     */
    removeItem(): Material {
        let item = this.items[this.currentSlot];

        this.items[this.currentSlot] = null;

        if(item){
            return item;
        } else {
            return null;
        }
    }
}