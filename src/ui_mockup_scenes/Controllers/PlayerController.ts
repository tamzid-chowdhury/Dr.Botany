import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import EquipmentManager from "../GameSystems/EquipmentManager";
// import EquipmentManager from "../GameSystems/EquipmentManager";
// import Healthpack from "../GameSystems/items/Healthpack";
import Item from "../GameSystems/items/Item";
import { InGame_Events, InGame_GUI_Events } from "../Utils/Enums";
import * as Tweens from "../Utils/Tweens"
import BattlerAI from "./BattlerAI";
import ProjectileController from "./ProjectileController";

export default class PlayerController extends StateMachineAI implements BattlerAI {
    health: number;
    owner: AnimatedSprite;
    inventory: EquipmentManager;


    direction: Vec2;
    speed: number;
    velocity: Vec2 = new Vec2(0,0);

    weapons: Array<Sprite> = [];
    equipped: Sprite;
    stowed: Sprite;


    downerCount: number = 0;
    upperCount: number = 0;
    canDepositUpper: boolean = false;
    canDepositDowner: boolean = false;

    // WHAT IF TWO SHOVELS AT ONE TIME POWERUP???? ALTERNATING SWINGS

    swing: Sprite;
    viewport: Viewport;
    shadowOffset: Vec2 = new Vec2(0, 10);
	levelView: Viewport;
	viewHalfSize: Vec2;
    playerLookDirection: Vec2 = new Vec2(0,0);
    swingDir: number = -1; 
    doingSwing: boolean = false;
    damaged: boolean = false;
    damageCooldown: number;
    damageTaken: number = 1; 


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        for(let equips of options.defaultWeapons) {
            this.weapons.push(equips);
        }
        this.equipped = options.defaultWeapons[0];
        this.swing = options.swingSprite;
        this.viewport = owner.getScene().getViewport();

        // TEMPORARY, JUST TESTING OUT SECOND WEAPON ON BACK
        this.stowed = options.defaultWeapons[1];
        // this.stowed.scale = new Vec2(0.8, 0.8)
        // this.stowed.invertY = true;

        this.direction = Vec2.ZERO;
        this.speed = options.speed;
        this.health = 5;
		this.levelView = this.owner.getScene().getViewport();
		this.viewHalfSize = this.levelView.getHalfSize();

        this.owner.scale = new Vec2(1.5, 1.5);
        this.owner.tweens.add('squish', Tweens.squish(this.owner.scale.clone()));
        // this.owner.tweens.play('squish');

        if(options.mapSize) {
            this.owner.position.set(options.mapSize.x/2, options.mapSize.y/2);
            this.equipped.position.set(options.mapSize.x/2,options.mapSize.y/2);
            // this.stowed.position.set(options.mapSize.x/2,options.mapSize.y/2);
        }
        else {
            this.owner.position = new Vec2(0,0);
            this.equipped.position = this.owner.position;
            this.stowed.position = this.owner.position;
        }
        this.equipped.invertY = true;

        this.swing.position.set(this.owner.position.x, this.owner.position.y);
        this.swing.visible = false;
        this.swing.active = false;
        this.swing.addAI(ProjectileController, {});
        this.swing.setTrigger("enemies", InGame_Events.PROJECTILE_HIT_ENEMY, null);
        
        this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 2)));
        this.owner.colliderOffset.set(0, 10);
        this.owner.setGroup("player");
        // this.items = options.items;
        // this.inventory = options.inventory;
        this.subscribeToEvents();
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {

        let mousePos = Input.getMousePosition();
        let rotateTo = Input.getGlobalMousePosition();
        
        this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0);

        if(this.direction.x === 0) {
            this.velocity.x += -this.velocity.x/4
        }
        else {
            this.velocity.x +=  this.direction.x * this.speed
        }

        if(this.direction.y === 0) {
            this.velocity.y += -this.velocity.y/4
        }
        else {
            this.velocity.y += this.direction.y * this.speed

        }

        if(!this.direction.isZero()) {
            // this.owner.tweens.resume('squish');
            this.velocity.normalize()
            this.velocity.mult(new Vec2(this.speed, this.speed));
            this.owner.animation.playIfNotAlready("WALK", true);
        }
        else {
            // this.owner.tweens.pause('squish');
            this.owner.animation.playIfNotAlready("IDLE", true);
        }   

        this.owner.move(this.velocity.scaled(deltaT));



		if(rotateTo.x > this.owner.position.x) {
			this.owner.invertX = true;
		}
		else {
			this.owner.invertX = false;
		}
        // ---

        // Follower movement/rotation update
        this.equipped.position = this.owner.position.clone();
        // this.stowed.position = this.owner.position.clone();
        this.swing.position = this.owner.position.clone();

        this.playerLookDirection = this.equipped.position.dirTo(rotateTo);

        if(mousePos.x > this.equipped.position.x) {
            this.equipped.rotation = -Vec2.UP.angleToCCW(this.playerLookDirection);
            // this.equipped.rotation += 3.14/2
        }
        else {
            this.equipped.rotation = -Vec2.UP.angleToCCW(this.playerLookDirection);
            // this.equipped.rotation -= 3.14/2
        } 


        this.equipped.position.add(new Vec2(-8 * this.playerLookDirection.x,-8 *this.playerLookDirection.y));
        // ---


        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            // TODO: Abstract MOUSE_DOWN event to doAttack, specific implementations in weapontype files 
            if(event.type === GameEventType.MOUSE_DOWN && !this.doingSwing) {
                this.emitter.fireEvent(InGame_Events.START_SWING);
                this.doingSwing = true;
            }
            if(event.type === InGame_Events.START_SWING) {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "swing", loop: false, holdReference: true});

                // NOTE: Right now the swing cooldown is tied to the duration of the swing tween
                // this is because the tween would kind of bug outit you didnt let it finish
                // a fix might be to have two copies of the swing tween and swap between them
                // for alternating swing, which should give each enough time to finish
                this.swing.position.set(this.owner.position.x + (20*this.playerLookDirection.x), this.owner.position.y + (20*this.playerLookDirection.y));
                
                // Ideally, the equipped weapon would own the swing sprite, and they'd receive START_SWING and handle this stuff itself
                // this.emitter.fireEvent(InGame_Events.DOING_SWING);
                (<AnimatedSprite>this.swing).animation.play("SWING", false);
                this.equipped.tweens.add('swingdown', Tweens.swing(this.equipped, this.swingDir))
                this.equipped.tweens.play('swingdown');
                this.swing.rotation = -this.equipped.rotation;
                this.swing.visible = true;
                this.swing.active = true;
                this.swing.tweens.add('moveAndShrink', Tweens.spriteMoveAndShrink(this.swing.position, this.playerLookDirection))
                this.swing.tweens.play('moveAndShrink');

                this.swing.tweens.add('fadeOut', Tweens.spriteFadeOut(400, 0.2))
                this.swing.tweens.play('fadeOut');

                this.emitter.fireEvent(InGame_Events.DO_SCREENSHAKE, {dir: this.playerLookDirection})

            }

            if(event.type === InGame_Events.FINISHED_SWING) {
                this.swing.active = false;
                this.swing.visible = false;
                if(Input.isMouseJustPressed()) {
                    this.swingDir *= -1;
                    this.emitter.fireEvent(InGame_Events.START_SWING);
                } 
                else {
                    this.swingDir *= -1;
                    this.doingSwing = false;
                } 
            }
            

            if(event.type === InGame_Events.PLAYER_ENEMY_COLLISION) {
                if(this.damaged) {

                    if (Date.now() - this.damageCooldown > 2000) {
                        this.damaged = false;
                    }
                }
                else {
                    // This is where it plays tweens + animation for getting hit
                    this.emitter.fireEvent(InGame_Events.DO_SCREENSHAKE, {dir: this.playerLookDirection})
                    this.damage(this.damageTaken);
                    this.damaged = true;
                    this.damageCooldown = Date.now();
                    this.emitter.fireEvent(InGame_GUI_Events.UPDATE_HEALTHBAR, {damageTaken: this.damageTaken});
                }
                
            }

            if(event.type === InGame_GUI_Events.INCREMENT_UPPER_COUNT) {
                this.upperCount++;
                this.canDepositUpper = true;
            }

            if(event.type === InGame_GUI_Events.INCREMENT_DOWNER_COUNT) {
                this.downerCount++;
                this.canDepositDowner = true;
            }

            // TODO: move this into materialManager, have it be tied to pressing e key
            if(event.type === InGame_Events.ON_UPPER_DEPOSIT && this.canDepositUpper) {
                let other = event.data.get('other');
                let box = this.owner.getScene().getSceneGraph().getNode(other);
                this.emitter.fireEvent(InGame_GUI_Events.SHOW_INTERACT_LABEL, {position: box.position.clone()});
                let count = this.upperCount;
                this.canDepositUpper = false;
                this.emitter.fireEvent(InGame_GUI_Events.CLEAR_UPPER_LABEL, {position: this.owner.position.clone()});
                this.emitter.fireEvent(InGame_Events.ADD_TO_MOOD, {type: 1, count: count});
                this.upperCount = 0;
            }

            if(event.type === InGame_Events.OFF_DOWNER_DEPOSIT || event.type === InGame_Events.OFF_UPPER_DEPOSIT) {
                this.emitter.fireEvent(InGame_GUI_Events.HIDE_INTERACT_LABEL);
            }

            if(event.type === InGame_Events.ON_DOWNER_DEPOSIT && this.canDepositDowner) {
                let other = event.data.get('other');
                let box = this.owner.getScene().getSceneGraph().getNode(other);
                this.emitter.fireEvent(InGame_GUI_Events.SHOW_INTERACT_LABEL, {position: box.position.clone()});
                let count = this.downerCount;
                this.canDepositDowner = false;
                this.emitter.fireEvent(InGame_GUI_Events.CLEAR_DOWNER_LABEL, {position: this.owner.position.clone()});
                this.emitter.fireEvent(InGame_Events.ADD_TO_MOOD, {type: -1, count: count});
                this.downerCount = 0;
            }

        }

    }

    damage(damage: number): void {
        this.health -= damage;

        if(this.health <= 0){
            console.log("Game Over");
            this.owner.animation.play("DYING", false);
            this.emitter.fireEvent(InGame_Events.PLAYER_DIED);
        }
    }
    destroy(): void {
        this.receiver.destroy();
	}

    subscribeToEvents(): void {
        this.receiver.subscribe([
            GameEventType.MOUSE_DOWN,
            GameEventType.MOUSE_UP,
            GameEventType.KEY_DOWN,
            InGame_Events.DOING_SWING,
            InGame_Events.FINISHED_SWING,
            InGame_Events.START_SWING,
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_GUI_Events.INCREMENT_UPPER_COUNT,
            InGame_GUI_Events.INCREMENT_DOWNER_COUNT,
            InGame_Events.ON_UPPER_DEPOSIT,
            InGame_Events.ON_DOWNER_DEPOSIT,
            InGame_Events.OFF_UPPER_DEPOSIT,
            InGame_Events.OFF_DOWNER_DEPOSIT,

        ]);
    }

    increaseDamageTaken(newDamageTaken: number): void {
        this.damageTaken = newDamageTaken
    }
}