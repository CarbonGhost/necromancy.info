import type { Component } from "solid-js";
import FadeIn from "../components/atomic/FadeIn";

export default function CuriousMainPageFullOfWhimsy() {
	return (
		<div class="h-full flex flex-col items-center justify-center" id="spooky-div">
            <FadeIn delay={1000} staggerDelay={10} scaleStart={0}>
                {/* The FadeIn component now handles the squares internally */}
            </FadeIn>
		</div>
	);
};