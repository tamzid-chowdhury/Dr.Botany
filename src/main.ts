import Game from "./Wolfie2D/Loop/Game";
import MainMenu from "./ui_mockup_scenes/MainMenu";
import SplashScreen from "./ui_mockup_scenes/SplashScreen";
import InGameUI from "./ui_mockup_scenes/InGameUI";
// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1920, y: 1080},          // The size of the game
        clearColor: {r: 0.9607, g: 0.9333, b: 0.9137},   // The color the game clears to
        inputs: [
            {name: "forward", keys: ["w"]},
            {name: "backward", keys: ["s"]},
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "pickup", keys: ["e"]},
            {name: "drop", keys: ["q"]},
            {name: "slot1", keys: ["1"]},
            {name: "slot2", keys: ["2"]}
        ],
        useWebGL: false,                        // Tell the game we want to use webgl
        showDebug: false                       // Whether to show debug messages. You can change this to true if you want
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(InGameUI, {});
})();

function runTests(){};