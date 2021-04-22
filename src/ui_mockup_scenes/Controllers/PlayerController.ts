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
    materials: Array<string> = [];


    // The inventory of the player
    //private inventory: EquipmentManager;


    direction: Vec2;
    speed: number;

    shadow: Sprite;
    weapons: Array<Sprite> = [];
    equipped: Sprite;


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
    damageTaken: number = 5; 


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.weapons.push(options.defaultWeapon);
        this.equipped = options.defaultWeapon;
        this.swing = options.swingSprite;
        this.shadow = options.shadow;
        this.viewport = owner.getScene().getViewport();


        this.direction = Vec2.ZERO;
        this.speed = options.speed;
        this.health = 100;
		this.levelView = this.owner.getScene().getViewport();
		this.viewHalfSize = this.levelView.getHalfSize();

        this.shadow.scale = new Vec2(0.7, 0.7);
        this.owner.scale = new Vec2(1.5, 1.5);

        if(options.mapSize) {
            this.owner.position.set(options.mapSize.x/2, options.mapSize.y/2);
            this.equipped.position.set(options.mapSize.x/2,options.mapSize.y/2);
        }
        else {
            this.owner.position = new Vec2(0,0);
            this.equipped.position = this.owner.position;
        }
        this.shadow.position.set(this.owner.position.x, this.owner.position.y + this.shadowOffset.y);
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

        if(!this.direction.isZero()) {
            this.owner.animation.playIfNotAlready("WALK", true);
        }
        else {
            this.owner.animation.playIfNotAlready("IDLE", true);
        }
		this.owner._velocity.x = this.direction.x;
		this.owner._velocity.y = this.direction.y;
		this.owner._velocity.normalize();
		this.owner._velocity.mult(new Vec2(this.speed, this.speed));
		this.owner.move(this.owner._velocity.scaled(deltaT));

		if(rotateTo.x > this.owner.position.x) {
			this.owner.invertX = true;
		}
		else {
			this.owner.invertX = false;
		}
        // ---

        // Follower movement/rotation update
        this.shadow.position = this.owner.position.clone();
        this.shadow.position.y += this.shadowOffset.y;
        this.equipped.position = this.owner.position.clone();
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

                this.swing.tweens.add('fadeOut', Tweens.spriteFadeOut())
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

            // TODO: move this into materialManager
            if(event.type === InGame_Events.ON_UPPER_DEPOSIT && this.canDepositUpper) {
                let count = this.upperCount;
                this.canDepositUpper = false;
                this.emitter.fireEvent(InGame_GUI_Events.CLEAR_UPPER_LABEL, {position: this.owner.position.clone()});
                this.emitter.fireEvent(InGame_Events.ADD_TO_MOOD, {type: 1, count: count});
                this.upperCount = 0;
            }

            if(event.type === InGame_Events.ON_DOWNER_DEPOSIT && this.canDepositDowner) {
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