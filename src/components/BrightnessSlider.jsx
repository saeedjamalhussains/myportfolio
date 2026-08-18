import { useRef, useState } from 'react';
import { clamp } from '../hooks/useLighting';
import styles from './BrightnessSlider.module.css';

/**
 * The Control Center brightness slider, wired up for real.
 *
 * Dragging it dims the page continuously; taking it to the bottom tips the
 * whole site into dark mode. Controlled — the value is owned by useLighting so
 * the desk's light switch stays in sync with it.
 */

const BrightnessSlider = ({ value, isDark, onChange }) => {
    const [dragging, setDragging] = useState(false);
    const trackRef = useRef(null);
    const grab = useRef(null);

    const handlePointerDown = (event) => {
        const track = trackRef.current;

        // Record the grab before capturing the pointer. setPointerCapture can
        // throw (a pointer that is no longer active), and if it did so first it
        // would leave the slider inert for the rest of the gesture.
        grab.current = {
            startY: event.clientY,
            startValue: value,
            height: track.getBoundingClientRect().height,
        };
        setDragging(true);

        // Capture keeps tracking alive once the pointer leaves the track — a
        // 128px target is easy to slide off mid-drag.
        try {
            track.setPointerCapture(event.pointerId);
        } catch {
            // Non-fatal: the drag still works, it just ends if the pointer
            // wanders off the element.
        }
    };

    const handlePointerMove = (event) => {
        if (!grab.current) {
            return;
        }

        const { startY, startValue, height } = grab.current;
        onChange(clamp(startValue + (startY - event.clientY) / height));
    };

    const endDrag = (event) => {
        if (!grab.current) {
            return;
        }

        grab.current = null;
        setDragging(false);

        try {
            trackRef.current?.releasePointerCapture(event.pointerId);
        } catch {
            // Already released, or never captured.
        }
    };

    const handleKeyDown = (event) => {
        const step = event.shiftKey ? 0.1 : 0.05;
        const keys = {
            ArrowUp: () => clamp(value + step),
            ArrowRight: () => clamp(value + step),
            ArrowDown: () => clamp(value - step),
            ArrowLeft: () => clamp(value - step),
            Home: () => 0,
            End: () => 1,
        };

        if (keys[event.key]) {
            event.preventDefault();
            onChange(keys[event.key]());
        }
    };

    return (
        <div
            ref={trackRef}
            className={`${styles.slider} ${dragging ? styles.dragging : ''}`}
            role="slider"
            tabIndex={0}
            aria-label="Brightness — lower it all the way for dark mode"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(value * 100)}
            aria-valuetext={isDark ? 'Off — dark mode' : `${Math.round(value * 100)} percent`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={handleKeyDown}
        >
            <span className={styles.fill} style={{ height: `${value * 100}%` }} />

            <span className={styles.glyph}>
                {isDark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="4.1" />
                        <path d="M12 2.6v2.2M12 19.2v2.2M4.3 4.3l1.6 1.6M18.1 18.1l1.6 1.6M2.6 12h2.2M19.2 12h2.2M4.3 19.7l1.6-1.6M18.1 5.9l1.6-1.6" />
                    </svg>
                )}
            </span>
        </div>
    );
};

export default BrightnessSlider;
