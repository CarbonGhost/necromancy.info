import type { Component } from "solid-js";
import { createSignal, onCleanup } from "solid-js";
import FadeIn from "../components/atomic/FadeIn";
import SON_OF_GOD from "../assets/glorious_glorp.webp"
import SON_OF_GOD_WHO_IS_QUITE_AMUSED from "../assets/glorious_and_also_quite_happy_glorp_with_his_tiny_tootsies_out.webp"

import GLORP_VOICE from "../assets/glorpvoice.mp3"
import './curioustylesheet.css';

export default function CuriousMainPageFullOfWhimsy() {
	let audioRef: HTMLAudioElement | undefined;
	const [isSpeaking, setIsSpeaking] = createSignal(false);
	const [isDragging, setIsDragging] = createSignal(false);
	const [position, setPosition] = createSignal({ x: 0, y: 0 });
	const [velocity, setVelocity] = createSignal({ x: 0, y: 0 });
	
	let lastMousePos = { x: 0, y: 0 };
	let animationFrame: number;

	const springStrength = 0.1;
	const dampening = 0.8;

	const updateSpring = () => {
		if (!isDragging()) {
			const springForceX = -position().x * springStrength;
			const springForceY = -position().y * springStrength;
			let newVelX = (velocity().x + springForceX) * dampening;
			let newVelY = (velocity().y + springForceY) * dampening;
			setPosition({
				x: position().x + newVelX,
				y: position().y + newVelY
			});

			setVelocity({ x: newVelX, y: newVelY });
		}

		animationFrame = requestAnimationFrame(updateSpring);
	};

	const handleMouseDown = (e: MouseEvent) => {
		if(!audioRef) return;
		audioRef.currentTime = 0;
		audioRef.play();
		setIsSpeaking(true);
		setIsDragging(true);
		lastMousePos = { x: e.clientX, y: e.clientY };
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging()) {
			const deltaX = e.clientX - lastMousePos.x;
			const deltaY = e.clientY - lastMousePos.y;
			
			setPosition({
				x: position().x + deltaX,
				y: position().y + deltaY
			});

			setVelocity({
				x: deltaX,
				y: deltaY
			});

			lastMousePos = { x: e.clientX, y: e.clientY };
		}
	};

	const handleMouseUp = () => {
		if(!audioRef) return;
		audioRef.pause();
		setIsSpeaking(false);
		setIsDragging(false);
	};

	animationFrame = requestAnimationFrame(updateSpring);
	onCleanup(() => {
		cancelAnimationFrame(animationFrame);
	});

	return (
		<div class="h-full flex flex-col items-center justify-center" id="spooky-div">
			<FadeIn delay={1000} staggerDelay={10} scaleStart={0}/>
			<button 
				aria-label="Glorp"
				id="glorp" 
				class={`opacity-0 animate-[fadeIn_1500ms_ease-in-out_forwards] ${isSpeaking() ? 'speaking' : ''}`}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onMouseMove={handleMouseMove}
				style={{
					transform: `translate(calc(-50% + ${position().x}px), calc(${position().y}px))`
				}}
			>
				<img src={isDragging() ? SON_OF_GOD_WHO_IS_QUITE_AMUSED : SON_OF_GOD} alt="" />
			</button>
			<audio ref={el => audioRef = el} src={GLORP_VOICE} preload="auto" loop />
		</div>
	);
};