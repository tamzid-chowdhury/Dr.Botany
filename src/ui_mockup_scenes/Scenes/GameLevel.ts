import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import InGameUILayer from "../Layers/InGameUI/InGameUILayer"
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { UIEvents, UILayers, InGameUILayers, InGame_Events, Scenes } from "../Utils/Enums";
import PauseScreenLayer from "../Layers/PauseScreenLayer";
import GameOverScreenLayer from "../Layers/GameOverScreenLayer";
import LevelCompletionScreenLayer from "../Layers/LevelCompletionScreenLayer";
import EnemyController from "../Enemies/EnemyController"
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import PlayerController from "../Controllers/PlayerController";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MainMenu from "../MainMenu";
import * as Tweens  from "../Utils/Tweens";
import UILayer from "../../Wolfie2D/Scene/Layers/UILayer";
import Equipment from "../Types/items/Equipment";
import MaterialsManager from "../GameSystems/MaterialsManager";
import Shovel from "../Types/items/EquipTypes/Shovel";
import TrashLid from "../Types/items/EquipTypes/TrashLid";
import { PhysicsGroups } from "../Utils/PhysicsOptions";
import EnemyManager from "../GameSystems/EnemyManager";
import PillBottle from "../Types/items/EquipTypes/PillBottle";
import EquipmentManager from "../GameSystems/EquipmentManager";
import ProjectileController from "../Controllers/ProjectileController";
import SupportManager from "../GameSystems/SupportManager"
import MoodManager from "../GameSystems/MoodManager"
import GrowthManager from "../GameSystems/GrowthManager";
import LevelZero from "./LevelZero";
import {Physics} from "../Utils/PhysicsOptions"
import Timer from "../../Wolfie2D/Timing/Timer";
import Game from "../../Wolfie2D/Loop/Game";
import Level_Fall_one from "./Level_Fall_One";

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
    gameOverScreenLayer:GameOverScreenLayer;
    levelCompletionScreenLayer: LevelCompletionScreenLayer;

    reticle: Sprite;
    cursor: Sprite;
    cursor2: Sprite; // clicked cursor 
    player: AnimatedSprite;
    plant: AnimatedSprite;
    upperDeposit: Sprite;
    downerDeposit: Sprite;
    shadow: Sprite;
    shadowOffset: Vec2 = new Vec2(0, 10);

    equipmentPrototypes: Array<Equipment> = [];

    materialsManager: MaterialsManager;
    enemyManager: EnemyManager;
    equipmentManager: EquipmentManager;
    supportManager: SupportManager; 
    moodManager: MoodManager;
    growthManager: GrowthManager;
    spawnerTimer : Timer;
    ////
    completionStatus : boolean = false;
    finalWaveCleared: boolean = false;
    ////
    shouldMaterialMove: boolean = false;
    screenWipe: Sprite;    
    swipeLayer: UILayer;
    pauseExecution: boolean = false;

    nextLevel: string;
    gameOver: boolean = false;



    loadScene(): void {
        
        this.load.image("reticle", "assets/misc/reticle.png");
        this.load.image("growth_bar_outline", "assets/ui_art/generic_bar_outline.png");
        this.load.image("growth_bar_fill", "assets/ui_art/generic_bar_fill.png");
        
        this.load.image("moodbar", "assets/ui_art/mood_bar_wip.png")
        this.load.image("moodbar_indicator", "assets/ui_art/mood_bar_indicator.png")
        this.load.image("health_pip", "assets/ui_art/leaf_icon.png");
        this.load.image("health_pip_shadow", "assets/ui_art/leaf_icon_shadow.png");
        this.load.image("shadow", "assets/player/shadow_sprite.png");

        this.load.image("shovel", "assets/weapons/shovel.png");
        this.load.image("shovel_outline", "assets/weapons/shovel_select_outline.png");
        this.load.image("shovel_icon", "assets/weapons/shovel_icon.png");
        this.load.image("shovel_icon_outline", "assets/weapons/shovel_icon_outline.png");
        this.load.image("pill_bottle", "assets/weapons/pill_bottle.png");
        this.load.image("pill", "assets/weapons/pill.png");
        this.load.image("pill_icon", "assets/weapons/pill_icon.png");
        this.load.image("pill_icon_outline", "assets/weapons/pill_icon_outline.png");

        this.load.image("trash_lid", "assets/weapons/trash_lid_icon.png");
        this.load.image("trash_lid_icon", "assets/weapons/trash_lid_icon.png");
        this.load.image("trash_lid_icon_outline", "assets/weapons/trash_lid_icon_outline.png");
    
        this.load.image("upper", "assets/items/good_vibe.png");
        this.load.image("downer", "assets/items/bad_vibe.png");
        this.load.image("healthpack", "assets/items/healthpack.png");
        this.load.image("ammopack", "assets/items/ammopack.png");
        this.load.image("upper_deposit", "assets/misc/upper_deposit_v2.png")
        this.load.image("downer_deposit", "assets/misc/downer_deposit_v2.png")
        this.load.audio("swing", "assets/sfx/swing_sfx.wav");
        this.load.audio("enemy_hit", "assets/sfx/enemy_hit.wav");
        this.load.audio("enemy_jump", "assets/sfx/enemy_jump.wav");
        this.load.audio("enemy_die", "assets/sfx/enemy_die.wav");
        this.load.audio("player_hit", "assets/sfx/player_hit.wav");
        this.load.audio("material_get", "assets/sfx/material_get_sfx.wav");
        this.load.audio("healthpack_get", "assets/sfx/healthpack.wav");
        this.load.audio("ammopack_get", "assets/sfx/ammopack.wav");
        this.load.audio("deposit", "assets/sfx/deposit.wav");
        this.load.audio("plant_grow", "assets/sfx/plantgrow.wav");
        this.load.spritesheet("swing", "assets/weapons/swing_sprite.json")
        this.load.spritesheet("player", "assets/player/dr_botany.json")
        this.load.spritesheet("plant", "assets/plant/plant.json")


        this.load.object("equipmentData", "assets/data/equipmentData.json");
        this.load.object("enemyData", "assets/data/enemyData.json");
        this.load.spritesheet("orange_mushroom", "assets/enemies/orange_mushroom.json")
        this.load.spritesheet("green_slime", "assets/enemies/slime_wip.json")
        this.load.spritesheet("wisp", "assets/enemies/wisp.json")
        this.load.spritesheet("wisp_projectile", "assets/enemies/wisp_projectile.json")
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
            InGame_Events.SPAWN_AMMO,
            InGame_Events.SPAWN_HEALTH, 
            InGame_Events.PLAYER_ATTACK_ENEMY,
            InGame_Events.PROJECTILE_HIT_ENEMY,
            InGame_Events.PLAYER_DIED,
            InGame_Events.ENEMY_DEATH_ANIM_OVER,
            InGame_Events.ON_UPPER_DEPOSIT,
            InGame_Events.ON_DOWNER_DEPOSIT,
            InGame_Events.TOGGLE_PAUSE,
            InGame_Events.TOGGLE_PAUSE_TRANSITION,
            InGame_Events.OVERLAP_EQUIP,
            InGame_Events.NOT_OVERLAP_EQUIP,
            InGame_Events.ENEMY_ATTACK_PLANT,
            InGame_Events.GROWTH_STARTED,
            InGame_Events.GROWTH_COMPLETED,
            UIEvents.CLICKED_QUIT,
            UIEvents.CLICKED_RESUME,
            UIEvents.TRANSITION_LEVEL,
            UIEvents.CLICKED_RESTART,
            InGame_Events.PLANT_HIT,
            InGame_Events.LEVEL_END
        ]);


        this.addLayer("primary", 10);
        this.addLayer("secondary", 9);
        this.addLayer("tertiary", 8);
        this.addLayer(InGameUILayers.ANNOUNCEMENT_BACKDROP, 11);
        this.addLayer(InGameUILayers.ANNOUNCEMENT_TEXT, 12);
        this.swipeLayer = this.addUILayer(UILayers.SCREEN_WIPE);
        this.swipeLayer.setDepth(1000);
        this.screenWipe = this.add.sprite("screen_wipe", UILayers.SCREEN_WIPE);
        this.screenWipe.imageOffset = new Vec2(0, 0);
        this.screenWipe.scale = new Vec2(2,1)
        this.screenWipe.position.set(0, this.screenWipe.size.y/2);
        this.screenWipe.tweens.add("introTransition", Tweens.slideLeft(0, -2*this.screenWipe.size.x, 800, '', 200));
        this.screenWipe.tweens.play("introTransition");
        // TODO: Disable input until after screen wipe finished
        this.initReticle();
        this.materialsManager = new MaterialsManager(this);
        this.enemyManager = new EnemyManager(this, this.viewport.getHalfSize());
        this.equipmentManager = new EquipmentManager(this);
        this.supportManager = new SupportManager(this);
        this.moodManager = new MoodManager(this);
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
        this.inGameUILayer.update(deltaT);
        this.moodManager.update(deltaT);
        let mousePos = Input.getMousePosition();
        this.reticle.position = mousePos;
        this.cursor.position = mousePos;
        
        if(!this.gameOver) {
            if(!this.pauseExecution) {
                this.materialsManager.resolveMaterials(this.player.position, deltaT);
                this.supportManager.resolveSupport(this.player.position)
    
            }



            if (Input.isKeyJustPressed("escape")) {
                if(this.pauseScreenLayer.hidden) {
                    this.pauseScreenLayer.playEntryTweens();
    
                    this.reticle.visible = false;
                    this.cursor.visible = true;
    
    
                }
                else {
                    this.pauseScreenLayer.playExitTweens();
                    this.reticle.visible = true;
                    this.cursor.visible = false;
                }
                this.emitter.fireEvent(InGame_Events.TOGGLE_PAUSE);
            }
    
            // This is temporary for testing
            if (Input.isKeyJustPressed("k")) {
                (<PlayerController>this.player._ai).damage(100);
            }
        }

        if(this.finalWaveCleared && this.levelCompletionScreenLayer.hidden && this.enemyManager.activePool.length === 0) {
            this.emitter.fireEvent(InGame_Events.TOGGLE_PAUSE);
            this.levelCompletionScreenLayer.playEntryTweens();
            this.reticle.visible = false;
            this.cursor.visible = true;
        }



        while (this.receiver.hasNextEvent()) {
            let event = this.receiver.getNextEvent();
            
            if (event.type === InGame_Events.TOGGLE_PAUSE_TRANSITION) {
                this.pauseScreenLayer.layer.setHidden(true);
                this.pauseScreenLayer.layer.disable();

            }
            
            // if (event.type === InGame_Events.PLANT_HIT) {
            //     console.log('plant hit')
                
            // }


            

            if (event.type === InGame_Events.PROJECTILE_HIT_ENEMY) {
                let node = this.sceneGraph.getNode(event.data.get("node"));
                let other = this.sceneGraph.getNode(event.data.get("other"));
                if((<EnemyController>node._ai).controllerType === 'Enemy') {
                    // makes sure dropped weapons dont cause damage
                    if((<Sprite>other).container.inInventory) { 
                        let player = (<PlayerController>this.player._ai);
                        // WARNING this always deactivates the projectile when it hits
                        // if we want porjectile piercing as a powerup, this has to be conditional
                        // also bad hardcoding
                        if((<Sprite>other).imageId === "pill") {

                            other.active = false;
                        }

                        let weaponKnockBack = player.equipped.knockback
                        let knockBackDir = player.playerLookDirection;
                        knockBackDir = knockBackDir.scale(weaponKnockBack);
                        // let ms = 30;
                        // var currentTime = new Date().getTime();
                        // while (currentTime + ms >= new Date().getTime()) { /* I feel filthy  doing this*/}
                        // TODO: Non constant damage
                        (<EnemyController>node._ai).doDamage(knockBackDir, player.equipped.damage, weaponKnockBack);
                    }
                }
                
            }

            if (event.type === InGame_Events.DO_SCREENSHAKE) {
                let dir = event.data.get("dir");
                this.viewport.doScreenShake(dir);

            }

            if (event.type === UIEvents.TRANSITION_LEVEL) {
                switch(this.nextLevel) {
                    case Scenes.MAIN_MENU:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });

                        this.sceneManager.changeToScene(MainMenu, {});
                        break;
                    case Scenes.LEVEL_ZERO:
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        let sceneOptions = {
                            physics: Physics
                        }
                        this.sceneManager.changeToScene(LevelZero, {}, sceneOptions);
                        break;
                    case Scenes.LEVEL_FALL_ONE:
                        console.log("asdf")
                        this.emitter.fireEvent(GameEventType.STOP_SOUND, { key: "background_music", holdReference: true });
                        // this.sceneManager.changeToScene(Level_Fall_one, {}, sceneOptions);
                        break;
                    default:
                        // level1
                        break;
                }
            }

            if (event.type === InGame_Events.LEVEL_LOADED) {
                this.screenCenter = this.viewport.getHalfSize();
            }

            if (event.type === InGame_Events.TOGGLE_PAUSE) {
                if(this.pauseExecution){
                    this.pauseExecution = false;
                } 
                else this.pauseExecution = true;
            }

            if (event.type === UIEvents.CLICKED_RESUME) {
                this.pauseScreenLayer.playExitTweens();
                this.reticle.visible = true;
                this.cursor.visible = false;
                this.emitter.fireEvent(InGame_Events.TOGGLE_PAUSE);
            }

            if (event.type === UIEvents.CLICKED_QUIT) {
                this.nextLevel = Scenes.MAIN_MENU;
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2,1)
                this.screenWipe.position.set(2*this.screenWipe.size.x, this.screenWipe.size.y/2);
                this.screenWipe.tweens.add("levelTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL));
                this.screenWipe.tweens.play("levelTransition");
            }
           
            //////////////////////////////////////////////////////////////////////////////////
            if (event.type === UIEvents.CLICKED_NEXT_LEVEL) {
                this.screenWipe.imageOffset = new Vec2(0, 0);
                this.screenWipe.scale = new Vec2(2,1)
                this.screenWipe.position.set(2*this.screenWipe.size.x, this.screenWipe.size.y/2);
                this.screenWipe.tweens.add("levelTransition", Tweens.slideLeft(this.screenWipe.position.x, 0, 500, UIEvents.TRANSITION_LEVEL));
                this.screenWipe.tweens.play("levelTransition");
            }
            //////////////////////////////////////////////////////////////////////////////////

            if (event.type === InGame_Events.SPAWN_UPPER) {
                let position = event.data.get("position");
                this.materialsManager.spawnUpper(position);

            }

            if (event.type === InGame_Events.SPAWN_DOWNER) {
                let position = event.data.get("position");
                this.materialsManager.spawnDowner(position);
            }

            if (event.type === InGame_Events.SPAWN_AMMO) {
                let position = event.data.get("position");
                this.supportManager.spawnAmmoPack(position);
            }

            if (event.type === InGame_Events.SPAWN_HEALTH) {
                let position = event.data.get("position");
                this.supportManager.spawnHealthPack(position);
            }


            if (event.type === InGame_Events.PLAYER_DIED) {
                
                this.emitter.fireEvent(InGame_Events.TOGGLE_PAUSE);
                this.emitter.fireEvent(InGame_Events.GAME_OVER);
                this.gameOver = true;
                this.gameOverScreenLayer.layer.setHidden(false);
                if(this.gameOverScreenLayer.hidden) {
                    this.gameOverScreenLayer.playEntryTweens();
    
                    this.reticle.visible = false;
                    this.cursor.visible = true;
    
                }
                else {
                    this.gameOverScreenLayer.playExitTweens();
                    this.reticle.visible = true;
                    this.cursor.visible = false;
                }
            }



            if (event.type === InGame_Events.ENEMY_DEATH_ANIM_OVER) {
                let node = this.sceneGraph.getNode(event.data.get("owner"));
                let ownerPosition = (<EnemyController>node._ai).owner.position.clone();
                if (Math.random() < 0.9) {
                    if ((<EnemyController>node._ai).dropType == "Upper") {
                        this.emitter.fireEvent(InGame_Events.SPAWN_UPPER, { position: ownerPosition });
                    }
                    if ((<EnemyController>node._ai).dropType == "Downer") {
                        this.emitter.fireEvent(InGame_Events.SPAWN_DOWNER, { position: ownerPosition });
                    }
                }
                
                if (this.supportManager.hasHealthPacksToSpawn() && Math.random() < 0.05) {
                    this.emitter.fireEvent(InGame_Events.SPAWN_HEALTH, { position: ownerPosition });
                }
                else if(this.supportManager.hasAmmoPacksToSpawn() && Math.random() < 0.05) {
                    this.emitter.fireEvent(InGame_Events.SPAWN_AMMO, { position: ownerPosition });
                }



                

                this.enemyManager.despawnEnemy(node);
            }

            if (event.type === InGame_Events.GROWTH_STARTED) {
                this.plant.tweens.add("treeScaleUp", Tweens.treeScaleUp(this.plant.scale, new Vec2(0.75,0.75)))
                this.plant.tweens.play("treeScaleUp")
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "plant_grow", loop: false, holdReference: true});


            }

            if (event.type === InGame_Events.GROWTH_COMPLETED) {
                this.plant.tweens.add("treeScaleUp", Tweens.treeScaleUp(this.plant.scale,new Vec2(1,1)))
                this.plant.tweens.play("treeScaleUp")
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "plant_grow", loop: false, holdReference: true});

                
                this.completionStatus = true;
                this.spawnerTimer.pause();
            }


        }
    }
    // TODO: plant init function probably needs to be diff for each level unless the center is always consistent
    initPlant(mapSize: Vec2): void {
				// set the trigger of the plant for enemies and enemy projectiles

        this.plant = this.add.animatedSprite('plant', "primary");
        this.upperDeposit = this.add.sprite('upper_deposit', "tertiary");
        this.downerDeposit = this.add.sprite('downer_deposit', "tertiary");
        this.plant.position.set((mapSize.x / 2) - this.plant.size.x, (mapSize.x / 2) - 1.3*this.plant.size.y);

        this.upperDeposit.position.set(this.plant.position.x + this.plant.size.x, this.plant.position.y + this.plant.size.y/1.8);
        this.downerDeposit.position.set(this.plant.position.x - this.plant.size.x, this.plant.position.y + this.plant.size.y/1.8);

        this.upperDeposit.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.upperDeposit.size.x/2, this.upperDeposit.size.y - this.upperDeposit.size.y/4)));
        this.downerDeposit.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.downerDeposit.size.x/2, this.downerDeposit.size.y - this.downerDeposit.size.y/4)));
        this.plant.addPhysics(new AABB(Vec2.ZERO, new Vec2(this.plant.size.x/2 , this.plant.size.y/2)));
        this.upperDeposit.setGroup(PhysicsGroups.DEPOSIT);
        this.downerDeposit.setGroup(PhysicsGroups.DEPOSIT);
        this.plant.setGroup(PhysicsGroups.DEPOSIT);

        this.upperDeposit.setTrigger(PhysicsGroups.PLAYER, InGame_Events.ON_UPPER_DEPOSIT, InGame_Events.OFF_UPPER_DEPOSIT);
        this.downerDeposit.setTrigger(PhysicsGroups.PLAYER, InGame_Events.ON_DOWNER_DEPOSIT, InGame_Events.OFF_DOWNER_DEPOSIT);
        this.plant.setTrigger(PhysicsGroups.ENEMY, InGame_Events.PLANT_HIT, null);
        this.plant.setTrigger(PhysicsGroups.ENEMY_PROJECTILE, InGame_Events.PLANT_HIT, null);



        this.plant.scale.set(0.5, 0.5);
        this.upperDeposit.scale.set(1, 1);
        this.downerDeposit.scale.set(1, 1);
        (<AnimatedSprite>this.plant).animation.play("HAPPY")


        // This has to be touched
        // this.plant.addPhysics(new AABB(Vec2.ZERO), new Vec2(7, 2));
        // this.plant.colliderOffset.set(0,10);
        // play with this // maybe add a condition for each enemy

        // this.plant.setGroup("ground");
        // this.plant.setTrigger("player", InGame_Events.PLAYER_ENEMY_COLLISION, null);
    }
    unloadScene(): void {
        // TODO: pass managers, player controller to next level 
        this.receiver.destroy();
    }

    initPlayer(mapSize: Vec2): void {
        this.player = this.add.animatedSprite("player", "primary");
        let playerOptions = {
            mapSize: mapSize,
            speed: 125,
            defaults: this.equipmentPrototypes,
            equipmentManager: this.equipmentManager,
            plant: this.plant
        }
        this.player.addAI(PlayerController, playerOptions);


    }


    initGameUI(halfsize: Vec2): void {
        this.inGameUILayer = new InGameUILayer(this, halfsize, this.defaultFont, this.viewport);

    }

    initPauseMenu(halfsize: Vec2): void {
        this.pauseScreenLayer = new PauseScreenLayer(this, halfsize);

    }

    initGameOverScreen(halfSize: Vec2) : void {
        this.gameOverScreenLayer = new GameOverScreenLayer(this, halfSize);
    }

    initLevelCompletionScreen(halfSize: Vec2) : void {
        this.levelCompletionScreenLayer = new LevelCompletionScreenLayer(this, halfSize);
    }

    initViewport(mapSize: Vec2): void {
        let origin = this.viewport.getOrigin();
        this.viewport.setBounds(origin.x+8, origin.y+8, mapSize.x - 8, mapSize.y+8);
        this.viewport.setSize(480, 270); // NOTE: Viewport can only see 1/4 of full 1920x1080p canvas
        this.viewport.setFocus(new Vec2(this.player.position.x, this.player.position.y));
    }

    initReticle(): void {
        this.cursorLayer = this.addUILayer(UILayers.CURSOR);
        this.cursorLayer.setDepth(900);
        this.reticle = this.add.sprite("reticle", UILayers.CURSOR);
        this.reticle.scale = new Vec2(0.7, 0.7);
        
        this.cursor = this.add.sprite("temp_cursor", UILayers.CURSOR);
        this.cursor.scale = new Vec2(0.22, 0.22)
        this.cursor.visible = false;

        this.cursor2 = this.add.sprite("cursor_clicked", UILayers.CURSOR);
        this.cursor2.scale = new Vec2(0.25, 0.25)
        this.cursor2.visible = false;
    }
    initSpawnerTimer(time : number) {
        this.spawnerTimer = new Timer(time, null, false);
    }

    finalWave(number : number) {
        
        for ( let i = 0; i < number; i++) {
            this.enemyManager.spawnEnemy(this.player, this.player);
        }
    }
    ///////////////////////////////////////////////////////
    doubleSpawnTime() {
        this.spawnerTimer.setTime(this.spawnerTimer.getTime()/2);
    }
    //////////////////////////////////////////////////////

}