import { useCallback, useEffect, useState } from 'react';

/**
 * One source of truth for how lit the page is.
 *
 * Two controls share it: the slider is the dimmer, the desk switch is the
 * on/off. Because both read and write the same value they can never disagree —
 * flicking the switch off slides the dimmer to the bottom, and vice versa.
 */

// Below this the page stops dimming and commits to the dark palette.
export const DARK_BELOW = 0.03;

// Where the switch puts things when the lights come back on.
export const FULL = 0.88;

const MAX_DIM = 0.58;

export const clamp = (n) => Math.min(1, Math.max(0, n));

// Squared so the top of the range is visually untouched — the page must look
// correct at rest, and only start dimming once it's genuinely turned down.
const dimFor = (value) => MAX_DIM * (1 - value) ** 2;

export const useLighting = (initial = FULL) => {
    const [brightness, setBrightness] = useState(initial);
    const isDark = brightness <= DARK_BELOW;

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.theme = isDark ? 'dark' : 'light';
        // Dark mode is its own palette, so the dimming veil switches off there
        // rather than stacking on top of it.
        root.style.setProperty('--dim', isDark ? '0' : dimFor(brightness).toFixed(3));
    }, [brightness, isDark]);

    const toggleLights = useCallback(() => {
        setBrightness((current) => (current <= DARK_BELOW ? FULL : 0));
    }, []);

    return { brightness, setBrightness, isDark, toggleLights };
};
