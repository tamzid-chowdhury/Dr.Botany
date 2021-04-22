import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import { LabelTweenableProperties } from "../../Wolfie2D/Nodes/UIElements/Label";
import { TweenData } from "../../Wolfie2D/Rendering/Animations/AnimationTypes"
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import InGameUI from "../Layers/InGameUI/InGameUILayer";
import { InGame_Events, UIEvents } from "./Enums";


export function healthBarSlideX(xPos: number, newXPos: number) : Record<string,any> {
	let tween = {
		startDelay: 100,
		duration: 300,
		effects: [
			{
				property: TweenableProperties.posX,
				start: xPos,
				end: newXPos,
				ease: EaseFunctionType.OUT_SINE,
			},


		],

	};
	return tween
}

export function healthBarScaleDown(scaleX:number, newScaleX:number) : Record<string,any> {
	let tween = {
		startDelay: 100,
		duration: 300,
		effects: [
			{
				property: TweenableProperties.scaleX,
				start: scaleX,
				end: newScaleX,
				ease: EaseFunctionType.OUT_SINE,
			},
			// {
			// 	property: TweenableProperties.scaleY,
			// 	start: scale.y,
			// 	end: scale.y + 0.2,
			// 	ease: EaseFunctionType.IN_SINE,
			// },

		],
	};
	return tween
}


export function indicatorSlideX(xPos: number, newXPos: number) : Record<string,any> {
	let tween = {
		startDelay: 400,
		duration: 300,
		effects: [
			{
				property: TweenableProperties.posX,
				start: xPos,
				end: newXPos,
				ease: EaseFunctionType.OUT_SINE,
			},


		],

	};
	return tween
}

export function indicatorScaleUpDown(scale: Vec2) : Record<string,any> {
	let tween = {
		startDelay: 400,
		duration: 300,
		effects: [
			{
				property: TweenableProperties.scaleX,
				start: scale.x,
				end: scale.x - 1,
				ease: EaseFunctionType.OUT_SINE,
			},
			// {
			// 	property: TweenableProperties.scaleY,
			// 	start: scale.y,
			// 	end: scale.y + 0.2,
			// 	ease: EaseFunctionType.IN_SINE,
			// },

		],
	};
	return tween
}

export function itemIncrement(size: number) : Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 300,
		effects: [
			{
				property: LabelTweenableProperties.textSize,
				start: size*2,
				end: size,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},

		],
		// reverseOnComplete: true
	};
	return tween
}

export function announce(startX: number, offset: number): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 300,
		effects: [
			{
				property: TweenableProperties.posX,
				start: startX,
				end: startX + offset,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},

			{
				property: LabelTweenableProperties.textAlpha,
				start: 0,
				end: 1,
				resetOnComplete: true,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
		],
	};
	return tween
}

export function slideXFadeIn(startX: number, startY: number, delay: number = 0, offset: number, duration: number = 300): Record<string,any> {
	let tween = {
		startDelay: delay,
		duration: duration,
		effects: [
			{
				property: TweenableProperties.posX,
				start: startX,
				end: startX + offset+2,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
			// {
			// 	property: TweenableProperties.posY,
			// 	start: startY,
			// 	end: startY + 2,
			// 	ease: EaseFunctionType.IN_OUT_QUAD,
			// },
			// {
			// 	property: TweenableProperties.alpha,
			// 	start: 0,
			// 	end: 1,
			// 	ease: EaseFunctionType.IN_OUT_QUAD,
			// },
			{
				property: LabelTweenableProperties.textAlpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
		],
	};
	return tween
}



export function spriteSlideXFadeIn(startX: number, startY: number, delay: number = 0, offset: number, duration: number = 300): Record<string,any> {
	let tween = {
		startDelay: delay,
		duration: duration,
		effects: [
			{
				property: TweenableProperties.posX,
				start: startX,
				end: startX + offset+2,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
			{
				property: TweenableProperties.posY,
				start: startY,
				end: startY ,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
			{
				property: TweenableProperties.alpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
		],
	};
	return tween
}

export function spriteSlideIn(startX: number, startY: number, delay: number = 0, offset: number, duration: number = 300): Record<string,any> {
	let tween = {
		startDelay: delay,
		duration: duration,
		effects: [
			{
				property: TweenableProperties.posX,
				start: startX,
				end: startX + offset+2,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
			{
				property: TweenableProperties.posY,
				start: startY,
				end: startY ,
				ease: EaseFunctionType.IN_OUT_QUAD,
			},
		],
	};
	return tween
}


export function fadeIn(): Record<string,any> {
	let tween =  {
		startDelay: 700,
		duration: 700,
		effects: [
			{
				property: LabelTweenableProperties.textAlpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.IN_OUT_QUINT,
				// resetOnComplete: true
			},
		]
	};
	return tween
}

export function fadeOut(posY: number): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 600,
		effects: [
			{
				property: LabelTweenableProperties.textAlpha,
				start: 1,
				end: 0,
				ease: EaseFunctionType.IN_OUT_QUINT,
				// resetOnComplete: true
			},
			{
				property: TweenableProperties.posY,
				start: posY,
				end: posY + 1000,
				ease: EaseFunctionType.IN_OUT_QUINT,
				// resetOnComplete: true
			},

		]
	};
	return tween
}

export function scaleIn(startScale: Vec2, endScale: Vec2, delay: number = 300, duration = 300): Record<string,any> {
	let tween =  {
		startDelay: delay,
		duration: duration,
		effects: [
			{
				property: TweenableProperties.scaleX,
				start: startScale.x,
				end: endScale.x,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
			{
				property: TweenableProperties.scaleY,
				start: startScale.y,
				end: endScale.y,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
		]
	};
	return tween;
};

export function scaleInText(size: number, delay: number = 300, duration = 300): Record<string,any> {
	let tween =  {
		startDelay: delay,
		duration: duration,
		effects: [
			{
				property: LabelTweenableProperties.textSize,
				start: 0,
				end: size,
				ease: EaseFunctionType.IN_OUT_QUINT,
			},
		]
	};
	return tween;
};

export function scaleOutText(size: number, delay: number = 300, duration = 300): Record<string,any> {
	let tween =  {
		startDelay: delay,
		duration: duration,
		effects: [
			{
				property: LabelTweenableProperties.textSize,
				start: size,
				end: 0,
				ease: EaseFunctionType.IN_OUT_QUINT,
			},
		],
		onEnd: UIEvents.SHOW_MAIN_MENU
	};
	return tween;
};




export function slideUpShrink(startScale: Vec2, posY: number, centerY: number): Record<string,any> {
	let tween =  {
		startDelay: 0,
		duration: 700,
		effects: [
			{
				property: TweenableProperties.posY,
				start: posY,
				end: centerY/4,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
			{
				property: TweenableProperties.scaleX,
				start: startScale.x,
				end: startScale.x*0.5,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
			{
				property: TweenableProperties.scaleY,
				start: startScale.y,
				end: startScale.y*0.5,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
			
		],
		onEnd: UIEvents.FIRST_RENDER
	};
	return tween;
};

export  function slideUpLeft(xPos: number, yPos: number): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 100,
		effects: [
			{
				property: TweenableProperties.posY,
				start: yPos,
				end: yPos-2,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
			// {
			// 	property: TweenableProperties.posX,
			// 	start: xPos,
			// 	end: xPos-2,
			// 	ease: EaseFunctionType.IN_OUT_QUINT,
			// 	resetOnComplete: true
			// },
		]
	
	}
	return tween;
}

export  function slideDownRight(xPos: number, yPos: number): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 100,
		effects: [
			{
				property: TweenableProperties.posY,
				start: yPos,
				end: yPos+2,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
			// {
			// 	property: TweenableProperties.posX,
			// 	start: xPos,
			// 	end: xPos+2,
			// 	ease: EaseFunctionType.IN_OUT_QUINT,
			// 	resetOnComplete: true
			// },
		]
	
	}
	return tween;
}

export  function changeColor(startColor: Color, endColor: Color): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 100,
		effects: [
			{
				property: LabelTweenableProperties.bgRedChannel,
				start: startColor.r,
				end: endColor.r,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
			{
				property: LabelTweenableProperties.bgGreenChannel,
				start: startColor.g,
				end: endColor.g,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
			{
				property: LabelTweenableProperties.bgBlueChannel,
				start: startColor.b,
				end: endColor.b,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
		]
	
	}
	return tween;
}


export  function swing(sprite: Sprite, dir: number): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 100,
		effects: [
			{
				property:TweenableProperties.rotation,
				start: sprite.rotation,
				end: sprite.rotation + (dir*3.14 ),
				ease: EaseFunctionType.OUT_SINE,
			},

		],
		// onEnd: .,
		// reverseOnComplete: true
	}
	return tween;
}


export function spriteFadeOut(duration: number = 400): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: duration,
		effects: [
			{
				property:TweenableProperties.alpha,
				start: 1,
				end: 0 ,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
		]
		// onEnd: InGame_Events.FINISHED_SWING
	}
	return tween
}

export function spriteFadeIn(duration: number = 400): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: duration,
		effects: [
			{
				property:TweenableProperties.alpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
		]
		// onEnd: InGame_Events.FINISHED_SWING
	}
	return tween
}

export function spriteMoveAndShrink(pos: Vec2, dir: Vec2): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 150,
		effects: [
			{
				property:TweenableProperties.scaleX,
				start: 1,
				end: 0.8 ,
				ease: EaseFunctionType.OUT_SINE,
			},
			{
				property:TweenableProperties.scaleY,
				start: 1,
				end: 1.8 ,
				ease: EaseFunctionType.OUT_SINE,
			},
			{
				property:TweenableProperties.posX,
				start: pos.x,
				end: pos.x + (20 * dir.x) ,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
			{
				property:TweenableProperties.posY,
				start: pos.y,
				end: pos.y + (20 * dir.y) ,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},

		],
		onEnd: InGame_Events.FINISHED_SWING
	}
	return tween
}

export function knockBack(velocity: Vec2): Record<string,any> {
	let tween = {
		startDelay: 0,
		duration: 400,
		effects: [
			{
				property:TweenableProperties.velocityX,
				start: velocity.x,
				end: 0 ,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
			{
				property:TweenableProperties.velocityY,
				start: velocity.y,
				end: 0 ,
				ease: EaseFunctionType.OUT_SINE,
				resetOnComplete: true
			},
		]
		// onEnd: InGame_Events.FINISHED_SWING
	}
	return tween
}


// export function HealthScaleDownSlideX(xScale: number, newXScale: number, xPos: number, newXPos: number) : Record<string,any> {
// 	let tween = {
// 		startDelay: 400,
// 		duration: 300,
// 		effects: [
// 			{
// 				property: TweenableProperties.scaleX,
// 				start: xScale,
// 				end: newXScale,
// 				ease: EaseFunctionType.OUT_SINE,
// 			},
// 			{
// 				property: TweenableProperties.posX,
// 				start: xPos,
// 				end: newXPos,
// 				ease: EaseFunctionType.OUT_SINE,
// 			}
// 		],

// 	};
// 	return tween
// }

