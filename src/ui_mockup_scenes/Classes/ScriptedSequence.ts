import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import AnimatedDialog from "./AnimatedDialog";

export default class ScriptedSequence {
	lines : Array<string> = []; // NOTE: these arrays must be of equal length
	periods: Array<number> = [];
	onEnd: string;
	dialogBox: AnimatedDialog;
    cursor: number = 0;
	scene: Scene;
	isRunning: boolean = false;
	hasStarted: boolean = false;
	hasFinished: boolean = false;
	waitTimer: Timer;
	constructor(scene: Scene, data: Record<string, any>, anchorPosition: Vec2) {
		this.scene = scene;
		let script = data.lines;
		for(let s of script) {
			this.lines.push(s.text);
			this.periods.push(s.time);
		}
		this.dialogBox = new AnimatedDialog(this.lines, anchorPosition, this.scene);
		this.waitTimer = new Timer(2000, () => {
			this.isRunning = true;
			this.dialogBox.start(this.cursor);
			console.log('starting')
		})
	}

	begin(): void {
		this.hasStarted = true;
		this.waitTimer.start()

	}


	advance(): void {
		if (!this.dialogBox.finished) {
			this.dialogBox.incrementText();
		}
		else {
			if(this.cursor+1 === this.lines.length) {
				// ends the scripted sequence
				this.waitTimer = new Timer(this.periods[this.cursor], () => {
					this.end();

					
				});
				this.waitTimer.start();
				this.isRunning = false;
				return;
			}
			else {
				this.waitTimer = new Timer(this.periods[this.cursor], () => {
					this.cursor++;
					this.dialogBox.start(this.cursor);
					this.isRunning = true;
					
				});
				this.waitTimer.start();
				this.isRunning = false;
				
			}

		}
	}

	end(): void {
		this.isRunning = false;
		this.hasFinished = true;
		this.dialogBox.finish();
		this.dialogBox.label.visible = false;
	}
}