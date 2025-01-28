import { Component, createEffect, onMount } from "solid-js";
import { createSignal } from "solid-js";

interface FadeInProps {
  delay: number;
  children: any;
}

const FadeIn: Component<FadeInProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setTimeout(() => setIsVisible(true), props.delay);
  });

  return (
    <div
      class={`transform opacity-0 translate-y-4 transition-all duration-100 ease-out bg-slate-700 ${isVisible() ? "opacity-100 translate-y-0" : ""}`}
    >
      {props.children}
    </div>
  );
};

export default FadeIn;