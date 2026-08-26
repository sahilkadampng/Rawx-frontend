import React, { useRef, useEffect } from 'react';

interface NoiseProps {
    patternSize?: number;
    patternScaleX?: number;
    patternScaleY?: number;
    patternRefreshInterval?: number;
    patternAlpha?: number;
}

const Noise: React.FC<NoiseProps> = ({
    patternSize = 128, // Reduced size for much better performance
    patternScaleX = 1,
    patternScaleY = 1,
    patternRefreshInterval = 2,
    patternAlpha = 15
}) => {
    const grainRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = grainRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let frame = 0;
        let animationId: number;

        // Create an offscreen canvas to hold the noise pattern
        const offscreen = document.createElement('canvas');
        offscreen.width = patternSize;
        offscreen.height = patternSize;
        const offCtx = offscreen.getContext('2d');
        
        if (offCtx) {
            // Generate the noise exactly once
            const imageData = offCtx.createImageData(patternSize, patternSize);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const value = Math.random() * 255;
                data[i] = value;
                data[i + 1] = value;
                data[i + 2] = value;
                data[i + 3] = patternAlpha;
            }
            offCtx.putImageData(imageData, 0, 0);
        }

        const resize = () => {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const drawGrain = () => {
            if (!offCtx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = ctx.createPattern(offscreen, 'repeat') as CanvasPattern;
            
            // Randomly offset the pattern to create the static effect
            const offsetX = Math.random() * patternSize;
            const offsetY = Math.random() * patternSize;
            
            ctx.translate(offsetX, offsetY);
            ctx.fillRect(-offsetX, -offsetY, canvas.width + patternSize, canvas.height + patternSize);
            ctx.translate(-offsetX, -offsetY);
        };

        const loop = () => {
            if (frame % patternRefreshInterval === 0) {
                drawGrain();
            }
            frame++;
            animationId = window.requestAnimationFrame(loop);
        };

        window.addEventListener('resize', resize);
        resize();
        loop();

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(animationId);
        };
    }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

    return (
        <canvas
            className="pointer-events-none fixed top-0 left-0 h-full w-full z-50"
            ref={grainRef}
            style={{
                imageRendering: 'pixelated'
            }}
        />
    );
};

export default Noise;
