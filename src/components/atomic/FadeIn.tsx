import { Component, createEffect, onMount, onCleanup } from "solid-js";
import { createSignal } from "solid-js";
import GOD from "../../assets/wise_mysitcal_tree.webp"

interface FadeInProps {
  delay: number;
  staggerDelay?: number;
  scaleStart?: number;
  children?: any;
}

const FadeIn: Component<FadeInProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [isResizing, setIsResizing] = createSignal(false);
  const [gridDimensions, setGridDimensions] = createSignal({ cols: 0, rows: 0 });
  const SQUARE_SIZE = 64;
  const PADDING = 16;
  const DEBOUNCE_DELAY = 250;
  const staggerDelay = props.staggerDelay || 50;
  const scaleStart = props.scaleStart || 0.5;

  let debounceTimeout: number | undefined;

  const calculateGrid = () => {
    const viewportWidth = window.innerWidth - (PADDING * 2);
    const viewportHeight = window.innerHeight - (PADDING * 2);
    
    const cols = Math.floor(viewportWidth / SQUARE_SIZE);
    const rows = Math.floor(viewportHeight / SQUARE_SIZE);
    
    setGridDimensions({ cols, rows });
    const spookyDiv = document.getElementById('spooky-div');
    if (spookyDiv) {
      spookyDiv.style.opacity = '1';
    }
    setIsResizing(false);
  };

  const debouncedCalculateGrid = () => {
    setIsResizing(true);
    const spookyDiv = document.getElementById('spooky-div');
    if (spookyDiv) {
      spookyDiv.style.opacity = '0';
    }
    window.clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(calculateGrid, DEBOUNCE_DELAY);
  };

  onMount(() => {
    setTimeout(() => setIsVisible(true), props.delay);
    calculateGrid();
    window.addEventListener('resize', debouncedCalculateGrid);
  });

  onCleanup(() => {
    window.clearTimeout(debounceTimeout);
    window.removeEventListener('resize', debouncedCalculateGrid);
  });

  return (
    <div class="transition-all duration-1000 ease-out rounded-lg overflow-hidden bg-green-800 border-8 border-green-900">
      <div 
        class={`grid gap-0 transition-opacity duration-200 ${isResizing() ? 'opacity-0' : 'opacity-100'}`}
        style={{
          "grid-template-columns": `repeat(${gridDimensions().cols}, ${SQUARE_SIZE}px)`,
          "grid-template-rows": `repeat(${gridDimensions().rows}, ${SQUARE_SIZE}px)`,
        }}
      >
        {Array(gridDimensions().cols * gridDimensions().rows)
          .fill(null)
          .map((_, i) => (
            <div 
              class="bg-slate-600 hover:bg-slate-500 transition-colors duration-200 opacity-0"
              style={{ 
                width: `${SQUARE_SIZE}px`, 
                height: `${SQUARE_SIZE}px`,
                animation: isVisible() && !isResizing() ? `scaleIn 500ms ease-out forwards ${i * staggerDelay}ms` : 'none'
              }} 
            >
                <img src={GOD} alt="Wise Mysitcal Tree" />
            </div>
          ))}
      </div>
      <style>
        {`
          #spooky-div {
            transition: opacity 200ms ease-out;
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(${scaleStart});
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FadeIn;