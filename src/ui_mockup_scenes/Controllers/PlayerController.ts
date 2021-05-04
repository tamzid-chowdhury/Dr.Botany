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
import EquipmentManager from "../GameSystems/EquipmentManager";
import Equipment from "../Types/items/Equipment";
import { InGame_Events, InGame_GUI_Events } from "../Utils/Enums";
import * as Tweens from "../Utils/Tweens"
import BattlerAI from "./BattlerAI";

export default class PlayerController extends StateMachineAI implements BattlerAI {
    health: number;
    owner: AnimatedSprite;
    equipment: EquipmentManager;


    direction: Vec2;
    speed: number;
    velocity: Vec2 = new Vec2(0,0);

    equipped: Equipment;
    onCooldown: boolean = false;
    coolDownTimer: Timer;
    hitTimer: Timer;
    downerCount: number = 0;
    upperCount: number = 0;
    canDepositUpper: boolean = false;
    canDepositDowner: boolean = false;

    viewport: Viewport;
    shadowOffset: Vec2 = new Vec2(0, 10);
	levelView: Viewport;
	viewHalfSize: Vec2;
    playerLookDirection: Vec2 = new Vec2(0,0);
    damaged: boolean = false;
    damageCooldown: number;
    damageTaken: number = 1; 
    hitFlashCooldown: number;
    pauseExecution: boolean = false;
    returnEquipment: boolean = false;


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.equipment = new EquipmentManager(options.defaults);
        this.equipped = this.equipment.equipped;
        this.viewport = owner.getScene().getViewport();


        this.direction = Vec2.ZERO;
        this.speed = options.speed;
        this.health = 5;
		this.levelView = this.owner.getScene().getViewport();
		this.viewHalfSize = this.levelView.getHalfSize();

        this.owner.scale = new Vec2(1.5, 1.5);
        this.owner.tweens.add('squish', Tweens.squish(this.owner.scale.clone()));
        this.owner.tweens.add('hit', Tweens.playerHit(this.owner.alpha));

        this.owner.position.set(options.mapSize.x/2, options.mapSize.y/2);

        
        this.owner.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 2)));
        this.owner.colliderOffset.set(0, 10);
        this.owner.setGroup("player");
        for(let e of this.equipment.prototypes) {
            e.init(this.owner.position.clone())
        }

        this.equipped.setActive(this.owner.position.clone());
        this.emitter.fireEvent(InGame_GUI_Events.UPDATE_EQUIP_SLOT, {slotNum: 0, spriteKey: this.equipped.spriteKey});
        this.subscribeToEvents();
        // NOTE: this should be tied to the currently equipped weapon 
        // can potentially be affected by mood
        this.coolDownTimer = new Timer(this.equipped.cooldown, () => {
            this.equipment.equipped.finishAttack();
        });

        this.hitTimer = new Timer(300, () => {
            this.owner.alpha = 1;

        });
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    resolvePlayerInput(deltaT: number): void {
        let rotateTo = Input.getGlobalMousePosition();
    
        this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        this.direction.y = (Input.isPressed("forward") ? -1 : 0) + (Input.isPressed("backward") ? 1 : 0);

        if(this.direction.x === 0)  this.velocity.x += -this.velocity.x/4
        else                        this.velocity.x +=  this.direction.x * this.speed

        if(this.direction.y === 0)  this.velocity.y += -this.velocity.y/4
        else                        this.velocity.y += this.direction.y * this.speed


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

        if(this.hitTimer.isActive()) {
            
            if (Date.now() - this.hitFlashCooldown > 50) {
                // this.owner.alpha = this.owner.alpha === 1 ? 0 : 1;
                this.hitFlashCooldown = Date.now();
                this.owner.animation.playIfNotAlready("HIT", true);
            }
        }

        this.owner.move(this.velocity.scaled(deltaT));



        if(rotateTo.x > this.owner.position.x) {
            this.owner.invertX = true;
        }
        else {
            this.owner.invertX = false;
        }

        this.playerLookDirection = this.equipped.sprite.position.dirTo(rotateTo);
        // if the equip is not at the player, move it closer
        // if(this.returnEquipment) {
        //     let sprite = this.equipped.sprite;
        //     if (sprite.position.distanceTo(this.owner.position) > 8) {
        //         let dirToPlayer = sprite.position.dirTo(this.owner.position);
        //         sprite._velocity = dirToPlayer;
        //         sprite._velocity.normalize();
        //         sprite._velocity.mult(new Vec2(10,10));
        //         sprite.move(sprite._velocity.scaled(deltaT));
        //     }
        //     else {
        //         this.returnEquipment = false;
        //     }
            
        // }
        // else {
        //     this.equipped.updatePos(this.owner.position.clone(), this.playerLookDirection)
        // }
            this.equipped.updatePos(this.owner.position.clone(), this.playerLookDirection)
            this.equipped.setRot(-Vec2.UP.angleToCCW(this.playerLookDirection))


        if(Input.isMouseJustPressed()) {
            if(!this.coolDownTimer.isActive()) {
                this.equipment.equipped.doAttack(this.playerLookDirection);
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.equipment.equipped.sfxKey, loop: false, holdReference: true});
                this.emitter.fireEvent(InGame_Events.DO_SCREENSHAKE, {dir: this.playerLookDirection})
                this.coolDownTimer.start();
            }
        }

        if (Input.isKeyJustPressed("q")) {
            this.equipment.switchEquipped()
            this.equipped = this.equipment.getEquipped();
            this.equipped.setActive(this.owner.position.clone());
            this.coolDownTimer = new Timer(this.equipped.cooldown, () => {
                this.equipment.equipped.finishAttack();
    
            });

            // this.emitter.fireEvent(InGame_GUI_Events.UPDATE_EQUIP_SLOT, {slotNum: 0, spriteKey: this.equipped.spriteKey});
        }
    }

    update(deltaT: number): void {

        if(!this.pauseExecution) this.resolvePlayerInput(deltaT);

        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
			if(event.type === InGame_Events.TRASH_LID_APEX) {
                this.returnEquipment = true;
			}

            if (event.type === InGame_Events.TOGGLE_PAUSE || event.type === InGame_Events.GAME_OVER) {
                if(this.pauseExecution) this.pauseExecution = false;
                else this.pauseExecution = true;
            }
            

            if(event.type === InGame_Events.PLAYER_ENEMY_COLLISION) {
                if(this.damaged) {

                    if (Date.now() - this.damageCooldown > 2000) {
                        this.damaged = false;
                    }
                }
                else {
                    // This is where it plays tweens + animation for getting hit
                    this.hitFlashCooldown = Date.now();
                    this.hitTimer.start();
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
            InGame_Events.PLAYER_ENEMY_COLLISION,
            InGame_Events.PLAYER_DIED,
            InGame_GUI_Events.INCREMENT_UPPER_COUNT,
            InGame_GUI_Events.INCREMENT_DOWNER_COUNT,
            InGame_Events.ON_UPPER_DEPOSIT,
            InGame_Events.ON_DOWNER_DEPOSIT,
            InGame_Events.OFF_UPPER_DEPOSIT,
            InGame_Events.OFF_DOWNER_DEPOSIT,
            InGame_Events.TOGGLE_PAUSE,
            InGame_Events.GAME_OVER,
            InGame_Events.TRASH_LID_APEX

        ]);
    }

    increaseDamageTaken(newDamageTaken: number): void {
        this.damageTaken = newDamageTaken
    }
}