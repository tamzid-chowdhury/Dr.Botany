import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyController from "../../Enemies/EnemyController";
import { InGame_Events } from "../../Utils/Enums";
import { PhysicsGroups } from "../../Utils/PhysicsOptions";

export default class Enemy {
    spriteKey: string;
    type: string;
    sprite: AnimatedSprite;
    effects: Array<string> = [];
    data: Record<string, any>;
    constructor(sprite: AnimatedSprite, data: Record<string, any>) {
        this.data = data;
        this.sprite = sprite;
        this.sprite.scale.set(data.scale, data.scale);
        let collisionShape = this.sprite.size;
        let aiOptions = {
            container: this,
            speed: data.speed, 
            player: {},
            plant: {}, 
            health: data.health, 
            type: data.type,
            attackType: data.attackType
        }
        this.sprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(( (collisionShape.x / 2)) * data.scale, (collisionShape.y / 4) * data.scale) ));
        this.sprite.colliderOffset.set(0, (collisionShape.y / 4) * data.scale);
        this.sprite.addAI(EnemyController, aiOptions);
        this.sprite.setGroup(PhysicsGroups.ENEMY);
        this.sprite.setTrigger(PhysicsGroups.PLAYER, InGame_Events.PLAYER_ENEMY_COLLISION, null);
        // this.sprite.setTrigger(PhysicsGroups.PROJECTILE, InGame_Events.PROJECTILE_HIT_ENEMY, null);
        this.sprite.visible = false;
        this.sprite.active = false;  
        this.sprite.position.set(-2000,-2000)
    }




}