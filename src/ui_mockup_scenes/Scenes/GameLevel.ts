import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import InGameUILayer from "../Layers/InGameUI/InGameUILayer"
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { UIEvents, UILayers, ButtonNames, InGameUILayers, WindowEvents, InGame_Events, InGame_GUI_Events } from "../Utils/Enums";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import EnemyController from "../Enemies/EnemyController"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Material from "../GameSystems/items/Material"
import MainMenu from "../MainMenu";
// import GameOver from "../Scenes/GameOver";

export default class GameLevel extends Scene {
    defaultFont: string = 'Round';
    screenCenter: Vec2;
    pauseScreenToggle: boolean = true;

    //initialize layers 
    primary: Layer;
    background: Layer;
    cursorLayer: Layer;
    inGameUILayer: InGameUILayer;
    pauseScreenLayer: PauseScreenLayer;

    reticle: Sprite;
    player: AnimatedSprite;
    plant: Sprite;
    upperDeposit: Sprite;
    downerDeposit: Sprite;
    shadow: Sprite;
    swing: Sprite
    defaultEquip: Sprite;
    shadowOffset: Vec2 = new Vec2(0, 10);

    droppedMaterial: Array<Material> = [];
    shouldMaterialMove: boolean = false;
    boxTop: Sprite;


    loadScene(): void {
        this.load.image("temp_cursor", "assets/misc/cursor.png");
        this.load.image("reticle", "assets/misc/reticle.png");
        this.load.image("temp_button", "assets/ui_art/button.png");
        this.load.image("ui_square", "assets/ui_art/ui_square.png");
        this.load.image("ui_circle", "assets/ui_art/ui_circle.png");
        this.load.image("cursor_clicked", "assets/misc/cursor_clicked.png")
        this.load.image("healthbar", "assets/ui_art/health_bar_wip-1.png")
        this.load.image("healthbaroutline", "assets/ui_art/ui_bar_outline.png")
        this.load.image("growthbar", "assets/ui_art/growth_bar_wip.png")
        this.load.image("moodbar", "assets/ui_art/mood_bar_wip.png")
        this.load.image("moodbar_indicator", "assets/ui_art/mood_bar_indicator.png")

        this.load.spritesheet("player", "assets/player/dr_botany.json")
        this.load.image("shadow", "assets/player/shadow_sprite.png");
        this.load.image("shovel", "assets/weapons/shovel.png");
        this.load.image("green_orb", "assets/items/greenorb.png");
        this.load.image("red_orb", "assets/items/redorb.png");
        this.load.spritesheet("swing_sprite", "assets/weapons/swing_sprite.json")
        this.load.spritesheet("plant", "assets/plant/plant.json")
        this.load.image("upper_deposit", "assets/misc/upper_deposit.png")
        this.load.image("downer_deposit", "assets/misc/downer_deposit.png")
        this.load.audio("swing", "assets/sfx/swing_sfx.wav");
        this.load.audio("enemy_hit", "assets/sfx/enemy_hit.wav");
        this.load.audio("enemy_die", "assets/sfx/enemy_die.wav");
        this.load.audio("material_get", "assets/sfx/material_get_sfx.wav");

    }

    startScene(): void {
        this.receiver.subscribe([
            GameEventType.MOUSE_DOWN,
            GameEventType.MOUSE_UP,
            GameEventType.KEY_DOWN,
            InGame_Events.LEVEL_LOADED,
            InGame_Events.DOING_SWING,
            InGame_Events.FINISHED_SWING,
            InGame_Events.START_SWING,
            InGame_Events.DO_SCREENSHAKE,
            InGame_Events.SPAWN_UPPER,
            InGame_Events.SPAWN_DOWNER,
            InGame_Events.PLAYER_ATTACK_ENEMY,
            InGame_Events.PROJECTILE_HIT_ENEMY,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DEATH_ANIM_OVER,
            InGame_Events.ON_UPPER_DEPOSIT,
            InGame_Events.ON_DOWNER_DEPOSIT
        ]);



        this.addLayer("primary", 10);
        this.addLayer("secondary", 9);
        this.addLayer(InGameUILayers.ANNOUNCEMENT_BACKDROP, 11);
        this.addLayer(InGameUILayers.ANNOUNCEMENT_TEXT, 12);

    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
        this.inGameUILayer.update(deltaT);
        // update positions and rotations
        let mousePos = Input.getMousePosition();
        let rotateTo = Input.getGlobalMousePosition();
        this.reticle.position = mousePos;


        // if (Input.isKeyJustPressed("o")) {
        //     this.emitter.fireEvent(InGame_Events.ANGRY_MOOD_REACHED);
        //     console.log("lajhsdflaijsdofijasdofij")
        // }

        // if (Input.isKeyJustPressed("p")) {
        //     this.emitter.fireEvent(InGame_Events.HAPPY_MOOD_REACHED);

        // }

        for (let material of this.droppedMaterial) {
            if (material.sprite.position.distanceTo(this.player.position) < 15) {
                if (material.type === "upper") {
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "material_get", loop: false, holdReference: true});

                    this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_UPPER_COUNT, {position: this.player.position.clone()})
                }
                if (material.type === "downer") {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "material_get", loop: false, holdReference: true});
                    this.emitter.fireEvent(InGame_GUI_Events.INCREMENT_DOWNER_COUNT, {position: this.player.position.clone()})
                }

                material.sprite.destroy();

                let index = this.droppedMaterial.indexOf(material)
                this.droppedMaterial.splice(index, 1)

            }

            if (material.sprite.position.distanceTo(this.player.position) < 400) {
                let dirToPlayer = material.sprite.position.dirTo(this.player.position);
                material.sprite._velocity = dirToPlayer;
                let dist = material.sprite.position.distanceSqTo(this.player.position);
                let speedSq = Math.pow(350, 2);
                material.sprite._velocity.normalize();
                material.sprite._velocity.mult(new Vec2(speedSq / (dist/3), speedSq / (dist/3)));
                material.sprite.move(material.sprite._velocity.scaled(deltaT));
            }
        }




        if (Input.isKeyJustPressed("p")) {
            if (this.pauseScreenLayer !== undefined) {
                if (this.pauseScreenToggle) {
                    for (let button of this.pauseScreenLayer.menuButtons) {
                        //button.label.tweens.play('slideXFadeIn')
                        //button.sprite.tweens.play('spriteSlideXFadeIn')
                        button.label.textColor.a = 1;
                    }
                    this.pauseScreenToggle = false;
                }
                else {
                    for (let button of this.pauseScreenLayer.menuButtons) {
                        //button.label.tweens.play('slideXFadeOut')
                        //button.sprite.tweens.play('spriteSlideXFadeOut')
                        button.label.textColor.a = 0;
                    }
                    this.pauseScreenToggle = true;
                }
            }


        }


        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();

            // WARNING: No checking that node is actually the enemy, could fail
            if (event.type === InGame_Events.PROJECTILE_HIT_ENEMY) {
                let node = this.sceneGraph.getNode(event.data.get("node"));
                let knockBackDir = (<PlayerController>this.player._ai).playerLookDirection;
                let ms = 30;
                var currentTime = new Date().getTime();
                 
                // while (currentTime + ms >= new Date().getTime()) { /* I feel filthy  doing this*/}
                (<EnemyController>node._ai).damage(10);
                (<EnemyController>node._ai).doKnockBack(knockBackDir);


            }
            if (event.type === WindowEvents.RESIZED) {
            }

            if (event.type === InGame_Events.DO_SCREENSHAKE) {
                let dir = event.data.get("dir");
                this.viewport.doScreenShake(dir);

            }

            if (event.type === InGame_Events.LEVEL_LOADED) {
                this.screenCenter = this.viewport.getHalfSize();
            }

            if (event.type === InGame_Events.SPAWN_UPPER) {
                let position = event.data.get("position");
                let upper = this.add.sprite("green_orb", 'primary');
                upper.position = position;
                upper.scale.set(0.6, 0.6);
                let material = new Material(upper, "upper")
                material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                material.sprite.setGroup("materials");
                this.droppedMaterial.push(material)
            }


            if (event.type === InGame_Events.PLAYER_ENEMY_COLLISION) {
                if ((<PlayerController>this.player._ai).damaged) {
                    if (Date.now() - (<PlayerController>this.player._ai).damageCooldown > 2000) {
                        (<PlayerController>this.player._ai).damaged = false;
                    }
                }
                else {
                    // This is where it plays tweens + animation for getting hit
                    (<PlayerController>this.player._ai).damage(1);
                    (<PlayerController>this.player._ai).damaged = true;
                    (<PlayerController>this.player._ai).damageCooldown = Date.now();
                }
            }

            if (event.type === InGame_Events.SPAWN_DOWNER) {
                let position = event.data.get("position");
                let downer = this.add.sprite("red_orb", 'primary');
                downer.position = position;
                downer.scale.set(0.6, 0.6);
                let material = new Material(downer, "downer")
                material.sprite.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
                material.sprite.setGroup("materials");
                this.droppedMaterial.push(material)
            }

            if (event.type === InGame_Events.PLAYER_DIED) {
                console.log("Player Died. Go to main menu")
                this.sceneManager.changeToScene(MainMenu, {}) 
            }

            if (event.type === InGame_Events.ENEMY_DEATH_ANIM_OVER) {
                let node = this.sceneGraph.getNode(event.data.get("owner"));
                let ownerPosition = (<EnemyController>node._ai).owner.position.clone();
                if (Math.random() < 0.9) {
                    if ((<EnemyController>node._ai).type == "Upper") {
                        this.emitter.fireEvent(InGame_Events.SPAWN_UPPER, { position: ownerPosition });
                    }
                    if ((<EnemyController>node._ai).type == "Downer") {
                        this.emitter.fireEvent(InGame_Events.SPAWN_DOWNER, { position: ownerPosition });
                    }
                }
                node.destroy();
            }


        }
    }

    initPlant(mapSize: Vec2): void {
        let xOffset = 32;
        this.plant = this.add.animatedSprite('plant', "primary");
        this.upperDeposit = this.add.sprite('upper_deposit', "secondary");
        this.downerDeposit = this.add.sprite('downer_deposit', "secondary");
        this.plant.position.set((mapSize.x / 2) + xOffset, this.plant.size.y / 2);

        this.upperDeposit.position.set((mapSize.x / 2) - 2*this.upperDeposit.size.x + xOffset, this.plant.size.y + this.upperDeposit.size.y);
        this.downerDeposit.position.set((mapSize.x / 2) + 2*this.downerDeposit.size.x + xOffset, this.plant.size.y + this.downerDeposit.size.y);

        this.upperDeposit.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.upperDeposit.size.x - this.upperDeposit.size.x/4, this.upperDeposit.size.y - this.upperDeposit.size.y/4)));
        this.downerDeposit.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.downerDeposit.size.x - this.downerDeposit.size.x/4, this.downerDeposit.size.y - this.downerDeposit.size.y/4)));
        this.upperDeposit.setGroup('deposits');
        this.downerDeposit.setGroup('deposits');

        this.upperDeposit.setTrigger("player", InGame_Events.ON_UPPER_DEPOSIT, InGame_Events.OFF_UPPER_DEPOSIT);
        this.downerDeposit.setTrigger("player", InGame_Events.ON_DOWNER_DEPOSIT, InGame_Events.OFF_UPPER_DEPOSIT);


        this.plant.scale.set(1.0, 1.0);
        this.upperDeposit.scale.set(1.5, 1.5);
        this.downerDeposit.scale.set(1.5, 1.5);
        (<AnimatedSprite>this.plant).animation.play("EH")
        // This has to be touched
        // this.plant.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
        // this.plant.colliderOffset.set(0,10);
        // play with this // maybe add a condition for each enemy

        // TODO: define a specific physics group whose collider is half the size of the sprite for collision objects that the player can go behind
        // this.plant.setGroup("ground");
        // this.plant.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
    }
    unloadScene(): void {
        // this.player.destroy();
        this.receiver.destroy();
    }

    initPlayer(mapSize: Vec2): void {
        this.player = this.add.animatedSprite("player", "primary");
        let playerOptions = {
            mapSize: mapSize,
            speed: 150,
            shadow: this.add.sprite("shadow", "secondary"),
            defaultWeapon: this.add.sprite("shovel", "secondary"),
            swingSprite: this.add.animatedSprite("swing_sprite", "primary")
        }
        this.player.addAI(PlayerController, playerOptions);
        this.player.animation.play("IDLE");


    }

    initInventory(): void {

    }

    initEquipment(): void {

    }

    initGameUI(halfsize: Vec2): void {
        this.inGameUILayer = new InGameUILayer(this, halfsize, this.defaultFont, this.viewport);

    }

    initViewport(mapSize: Vec2): void {
        let origin = this.viewport.getOrigin();
        this.viewport.setBounds(origin.x, origin.y, mapSize.x, mapSize.y + 24);
        this.viewport.setSize(480, 270); // NOTE: Viewport can only see 1/4 of full 1920x1080p canvas
    }

    initReticle(): void {
        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.reticle = this.add.sprite("reticle", UILayers.CURSOR);
        this.reticle.scale = new Vec2(0.7, 0.7);

    }


}