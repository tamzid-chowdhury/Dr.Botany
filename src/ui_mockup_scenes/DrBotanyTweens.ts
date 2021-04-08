import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import { TweenableProperties } from "../Wolfie2D/Nodes/GameNode";
import { LabelTweenableProperties } from "../Wolfie2D/Nodes/UIElements/Label";
import { TweenData } from "../Wolfie2D/Rendering/Animations/AnimationTypes"
import Color from "../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../Wolfie2D/Utils/EaseFunctions";
import { UIEvents } from "./DrBotanyEnums";

export function slideXFadeIn(startX: number, delay: number = 0, offset: number): Record<string,any> {
	let tween = {
		startDelay: delay,
		duration: 300,
		effects: [
			{
				property: TweenableProperties.posX,
				start: startX,
				end: startX + offset,
				ease: EaseFunctionType.IN_OUT_QUAD,
				resetOnComplete: true
			},
			{
				property: TweenableProperties.alpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.IN_OUT_QUAD,
				resetOnComplete: true
			},
			{
				property: LabelTweenableProperties.textAlpha,
				start: 0,
				end: 1,
				ease: EaseFunctionType.IN_OUT_QUAD,
				resetOnComplete: true
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
				resetOnComplete: true
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
				resetOnComplete: true
			},
			{
				property: TweenableProperties.posY,
				start: posY,
				end: posY + 300,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},

		],
		onEnd: UIEvents.HIDE_SPLASH_SCREEN
	};
	return tween
}

export function scaleIn(startScale: Vec2, endScale: Vec2): Record<string,any> {
	let tween =  {
		startDelay: 300,
		duration: 300,
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

export function slideUpShrink(startScale: Vec2, posY: number, centerY: number): Record<string,any> {
	let tween =  {
		startDelay: 0,
		duration: 700,
		effects: [
			{
				property: TweenableProperties.posY,
				start: posY,
				end: centerY/3,
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
		onEnd: UIEvents.SHOW_MAIN_MENU
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
			{
				property: TweenableProperties.posX,
				start: xPos,
				end: xPos-2,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
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
			{
				property: TweenableProperties.posX,
				start: xPos,
				end: xPos+2,
				ease: EaseFunctionType.IN_OUT_QUINT,
				resetOnComplete: true
			},
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

