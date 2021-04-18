export enum UIEvents {
	PLAY_GAME = "PLAY_GAME",
	CONTROLS = "CONTROLS",
	ABOUT = "ABOUT",
	MENU = "MENU",
	HIDE_LAYER = 'HIDE_LAYER',
	TRANSITION_SPLASH_SCREEN = 'TRANSITION_SPLASH_SCREEN',
	SHOW_MAIN_MENU = 'SHOW_MAIN_MENU',
	SHOW_MAIN_MENU_FINISHED = 'SHOW_MAIN_MENU_FINISHED',
	FIRST_RENDER = 'FIRST_RENDER',

	CLICKED_RESUME = 'CLICKED_RESUME',
	CLICKED_START = 'CLICKED_START',
	CLICKED_LEVEL_SELECT = 'CLICKED_LEVEL_SELECT',
	CLICKED_CONTROLS = 'CLICKED_CONTROLS', 
	CLICKED_OPTIONS = 'CLICKED_OPTIONS',
	CLICKED_HELP = 'CLICKED_HELP',
	CLICKED_QUIT = "CLICKED_QUIT",
	CLICKED_SPRING = 'CLICKED_SPRING',
	CLICKED_SUMMER = 'CLICKED_SUMMER',
	CLICKED_FALL = 'CLICKED_FALL',
	CLICKED_WINTER = 'CLICKED_WINTER',
	CLICKED_BACK_LEVEL = 'CLICKED_BACK_LEVEL'
}

export enum WindowEvents {
	RESIZED = 'RESIZED'

}

export enum Fonts {
	ROUND = 'round',
}

export enum UILayers {
	INGAME_UI = "ingameUI",
	MAIN_MENU = "mainMenu",
	BACKGROUND = "background",
	SPLASH_SCREEN = "splashScreen",
	CONTROLS = "controls",
	LEVEL_SELECT = "levelSelect",
	SPRING_LEVELS = "springLevels",
	SUMMER_LEVELS = "summerLevels",
	FALL_LEVELS = "fallLevels",
	WINTER_LEVELS = "winterLevels",
	OPTIONS = "options",
	HELP = "help",
	CURSOR = "Cursor",
	PAUSE_SCREEN = "PAUSE_SCREEN",
	CLICKED_SUMMER = "CLICKED_SUMMER",
	CLICKED_WINTER = "CLICKED_WINTER"

}

export enum InGameUILayers {
    HEALTH_BAR = "HEALTH_BAR",
    GROWTH_BAR = "GROWTH_BAR",
	MOOD_BAR = "MOOD_BAR",
    WEAPONS_INVENTORY = "WEAPONS_INVENTORY",
    ITEMS_INVENTORY = "ITEMS_INVENTORY",
    INGAMEUILAYER = "InGameUILayer"
}

export enum ButtonNames {
	START = "Start",
	LEVEL_SELECT = "Level Select",
	CONTROLS = "Controls",
	OPTIONS = "Options",
	HELP = "Help"
}

export enum PauseButtonNames {
	RESUME = "Resume",
	CONTROLS = "Controls",
	OPTIONS = "Options",
	QUIT = "Quit"
}

export enum InGame_Events {
    PLAYER_ENEMY_COLLISION = "PlayerEnemyCollsion",
    EQUIPMENT_ENEMY_COLLISION = "EquipmentEnemyCollision",
    PLAYER_ATTACK_ENEMY = "PlayerAttackEnemy",

    // ENEMY_ATTACK_PLAYER = "EnemyAttackPlayer"     // Enemy attacks the player
    PLAYER_DIED = "PlayerDied",
    ENEMY_DIED = "EnemyDied",
    LEVEL_LOADED = "LevelLoaded",
    LEVEL_START = "LevelStart",
    LEVEL_END = "LevelEnd",
    DOING_SWING = "DoingSwing",
    FINISHED_SWING = "FinishedSwing",
    START_SWING = "StartSwing",
    DO_SCREENSHAKE = "DoScreenShake",
    SPAWN_UPPER = "SpawnUpper",
    SPAWN_DOWNER = "SpawnDowner",
    UPDATE_MATERIAL_COUNT = "UPDATE_MATERIAL_COUNT"
}