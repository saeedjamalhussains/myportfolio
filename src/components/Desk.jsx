import { useRef, useState } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import styles from './Desk.module.css';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The resting tilt on the paper rocket. Kept here because the flight has to
// subtract it to work out how far to turn.
const PLANE_TILT = -18;

/**
 * The scattered objects behind the hero. Everything here is drawn in CSS so the
 * site ships with no image payload — swap any body for an <img> when you have
 * real photos.
 *
 * Each item is draggable. `z` is bumped on pick-up so the grabbed object always
 * comes to the front and stays there, the way paper on a real desk does.
 */

// How far, in px, an object can be pulled from where it was laid down. A fixed
// box beats a container ref here: a ref makes Framer Motion measure at mount and
// snap every object back inside the desk, collapsing the whole collage.
const REACH = 260;
const roam = { top: -REACH, bottom: REACH, left: -REACH, right: REACH };

// Apple ships damping 1.0 / response 0.4 for "move or reposition". Framer's
// `bounce` maps to damping, `duration` to response — so no overshoot by default.
const press = { type: 'spring', bounce: 0, duration: 0.4 };

// A release is momentum-driven, so this one earns a little overshoot. `power`
// and `timeConstant` are the momentum projection: where the flick is going,
// not where the finger left off.
const release = {
    power: 0.3,
    timeConstant: 200,
    bounceStiffness: 260,
    bounceDamping: 24,
};

const DeskItem = ({ children, className, style, rotate = 0, delay = 0, innerRef, onActivate }) => {
    const [z, setZ] = useState(1);
    const reduceMotion = useReducedMotion();
    // Every object is draggable, so a release only counts as a tap when no drag
    // happened in between.
    const dragged = useRef(false);

    const handlePointerDown = () => {
        setZ(60);
        dragged.current = false;
    };

    const handleTap = () => {
        if (onActivate && !dragged.current) {
            onActivate();
        }
    };

    return (
        <motion.div
            ref={innerRef}
            className={`${styles.item} ${className}`}
            style={{ ...style, zIndex: z }}
            drag
            dragConstraints={roam}
            dragElastic={0.12}
            dragTransition={release}
            // Pointer-down, not drag-start: the object must come forward the
            // instant it's grabbed, before the drag threshold is crossed.
            onPointerDown={handlePointerDown}
            onDragStart={() => { dragged.current = true; }}
            // Framer's own tap gesture, not onClick: drag installs a
            // capture-phase click blocker, so a React onClick never arrives.
            onTap={handleTap}
            initial={reduceMotion ? { opacity: 0, rotate } : { opacity: 0, scale: 0.9, rotate }}
            animate={{ opacity: 1, scale: 1, rotate }}
            transition={{ duration: reduceMotion ? 0.2 : 0.8, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.03, transition: press }}
            whileTap={{ scale: 1.06, transition: press }}
            whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
        >
            {children}
        </motion.div>
    );
};

const Desk = ({ lightsOn, onToggleLights }) => {
    const reduceMotion = useReducedMotion();
    const planeRef = useRef(null);
    const lampRef = useRef(null);
    const flight = useAnimationControls();
    const inFlight = useRef(false);
    const [lampBroken, setLampBroken] = useState(false);
    // Flips false if public/clipping.jpg isn't there, falling back to the
    // drawn clipping.
    const [clipArtOk, setClipArtOk] = useState(true);

    // Tap the paper rocket and it loops out, dives into the lamp, knocks the
    // shade off, then drops out of frame. Everything resets afterwards so it
    // can be done again.
    const launchPlane = async () => {
        if (inFlight.current || !planeRef.current || !lampRef.current) {
            return;
        }

        inFlight.current = true;

        // Measured at launch, not hard-coded: either object may have been
        // dragged somewhere else first.
        const plane = planeRef.current.getBoundingClientRect();
        const lamp = lampRef.current.getBoundingClientRect();
        const dx = lamp.left + lamp.width / 2 - (plane.left + plane.width / 2);
        const dy = lamp.top + 26 - (plane.top + plane.height / 2);

        if (reduceMotion) {
            // No flight path — just the outcome.
            setLampBroken(true);
            await wait(2200);
            setLampBroken(false);
            inFlight.current = false;
            return;
        }

        // Point the nose along the actual line of travel instead of guessing
        // angles. REST is the heading the rocket is drawn at, plus the tilt the
        // desk item already carries.
        const REST = -22 + PLANE_TILT;
        const heading = (Math.atan2(dy, dx) * 180) / Math.PI;
        const aim = heading - REST;

        // 1. Pull back and swing round to face the lamp — the wind-up that makes
        //    the dart read as deliberate rather than a teleport.
        await flight.start({
            x: -dx * 0.06,
            y: -dy * 0.06 - 10,
            rotate: aim,
            transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
        });

        // 2. Dart in, accelerating, with a shallow arc so it isn't a straight
        //    ruler line. Rotation holds — it's already pointing where it's going.
        await flight.start({
            x: [null, dx * 0.5, dx],
            y: [null, dy * 0.5 - 34, dy],
            rotate: [null, aim - 7, aim + 4],
            transition: { duration: 0.42, times: [0, 0.55, 1], ease: [0.5, 0, 0.85, 0.4] },
        });

        setLampBroken(true);

        // 3. Crumple and drop out of frame.
        await flight.start({
            x: dx - 52,
            y: dy + 210,
            rotate: aim + 150,
            scale: 0.72,
            opacity: 0,
            transition: { duration: 0.62, ease: [0.4, 0, 0.9, 0.5] },
        });

        await wait(850);

        flight.set({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 0 });
        setLampBroken(false);
        await flight.start({ opacity: 1, transition: { duration: 0.45 } });

        inFlight.current = false;
    };

    return (
        <div className={styles.desk} aria-hidden="true">
            {/* ---------- left cluster ---------- */}

            <DeskItem
                className={styles.lamp}
                style={{ top: '2%', left: '6%' }}
                rotate={-4}
                delay={0.15}
                innerRef={lampRef}
            >
                <motion.span
                    className={styles.lampShade}
                    animate={
                        lampBroken
                            // Snaps over hard, then hangs and rocks — struck, not eased.
                            ? { rotate: [0, -64, -49, -56], x: [0, -34, -28, -31], y: [0, 24, 19, 22] }
                            : { rotate: 0, x: 0, y: 0 }
                    }
                    transition={
                        lampBroken
                            ? { duration: 0.9, times: [0, 0.3, 0.62, 1], ease: [0.2, 0.9, 0.3, 1] }
                            : { duration: 0.45, ease: 'easeOut' }
                    }
                />
                <span className={`${styles.lampGlow} ${lampBroken ? styles.lampGlowOut : ''}`} />
                <span className={styles.lampStem} />
                <span className={styles.lampBase} />
                {lampBroken ? <span className={styles.impact} /> : null}
            </DeskItem>

            <DeskItem className={styles.clipping} style={{ top: '20%', left: '13%' }} rotate={-7} delay={0.3}>
                {clipArtOk ? (
                    // Cropped to the headline band of the scan. Lives in public/
                    // rather than being imported, so a missing file degrades to
                    // the drawn version below instead of breaking the build.
                    <img
                        // BASE_URL, not a bare "/": under a GitHub Pages
                        // project path this must resolve inside /myportfolio/
                        src={`${import.meta.env.BASE_URL}clipping.png`}
                        alt=""
                        className={styles.clipArt}
                        draggable="false"
                        onError={() => setClipArtOk(false)}
                    />
                ) : (
                    <>
                        <span className={styles.clipHead}>Dreams</span>
                        <span className={styles.clipLine} />
                        <span className={styles.clipLine} style={{ width: '72%' }} />
                        <span className={styles.clipLine} style={{ width: '88%' }} />
                    </>
                )}
            </DeskItem>

            <DeskItem className={styles.notebook} style={{ top: '38%', left: '2%' }} rotate={-9} delay={0.1}>
                {/* Wire loops over a cardboard strip along the top edge */}
                <span className={styles.spiral}>
                    {Array.from({ length: 7 }, (unused, i) => (
                        <span key={i} className={styles.ring} />
                    ))}
                </span>

                {/* Irregular widths so the top of the page reads as written on
                    and the bottom as still blank. */}
                <span className={styles.lines}>
                    {[
                        { w: '92%', written: true },
                        { w: '74%', written: true },
                        { w: '86%', written: true },
                        { w: '45%', written: true },
                        { w: '100%', written: false },
                        { w: '100%', written: false },
                    ].map((line, i) => (
                        <span
                            key={i}
                            className={line.written ? styles.written : styles.rule}
                            style={{ width: line.w }}
                        />
                    ))}
                </span>

                <span className={styles.pen} />
            </DeskItem>

            <DeskItem className={styles.film} style={{ top: '64%', left: '9%' }} rotate={8} delay={0.4}>
                <span className={styles.filmBody}>400</span>
                <span className={styles.filmStrip} />
            </DeskItem>

            <DeskItem className={styles.tube} style={{ top: '78%', left: '22%' }} rotate={-14} delay={0.5}>
                <span className={styles.tubeCap} />
            </DeskItem>

            {/* ---------- right cluster ---------- */}

            <DeskItem className={styles.player} style={{ top: '5%', right: '7%' }} rotate={3} delay={0.2}>
                <span className={styles.vinyl}><span className={styles.vinylLabel} /></span>
                <span className={styles.playerTitle}>São Paulo</span>
                <span className={styles.playerArtist}>The Weeknd</span>
                <span className={styles.playerBar}><span className={styles.playerFill} /></span>
                <span className={styles.playerTimes}>
                    <span>1:24</span>
                    <span>-2:08</span>
                </span>
                <span className={styles.playerControls}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M7 5v14l-1.6 0V5Zm12 .8v12.4L8.6 12Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.playerPlay} aria-hidden="true">
                        <path d="M6.5 3.6v16.8L20 12Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17 5v14l1.6 0V5Zm-12 .8v12.4L15.4 12Z" />
                    </svg>
                </span>
            </DeskItem>

            <DeskItem className={styles.folder} style={{ top: '48%', right: '22%' }} rotate={-5} delay={0.35}>
                <span className={styles.folderTab} />
                <span className={styles.folderName}>final_final_v3</span>
            </DeskItem>

            <DeskItem className={styles.swatch} style={{ top: '66%', right: '10%' }} rotate={6} delay={0.45}>
                <span className={styles.swatchTitle}>AirDrop</span>
                <span className={styles.swatchArt} />
                <span className={styles.swatchActions}>
                    <span className={styles.swatchDecline}>Decline</span>
                    <span className={styles.swatchAccept}>Accept</span>
                </span>
            </DeskItem>

            <DeskItem className={styles.flag} style={{ top: '74%', right: '40%' }} rotate={12} delay={0.55}>
                <svg className={styles.chakra} viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.6" />
                    {/* 24 spokes, one every 15°. They run from the hub's edge
                        outwards, not from the centre — drawn from the centre,
                        24 lines converge and fill in as a solid disc. */}
                    {Array.from({ length: 24 }, (unused, i) => (
                        <line
                            key={i}
                            x1="24"
                            y1="17"
                            x2="24"
                            y2="6"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            transform={`rotate(${i * 15} 24 24)`}
                        />
                    ))}
                    <circle cx="24" cy="24" r="3.8" fill="currentColor" />
                </svg>
            </DeskItem>

            {/* ---------- paper rocket ---------- */}

            <DeskItem
                className={styles.plane}
                style={{ top: '4%', left: '34%' }}
                rotate={PLANE_TILT}
                delay={0.6}
                innerRef={planeRef}
                onActivate={launchPlane}
            >
                {/* An inner layer carries the flight, so the outer item keeps its
                    own drag position and entrance untouched. A div, not the svg
                    itself — x/y on a motion.svg map to SVG attributes, not to a
                    transform, so the flight would silently never move. */}
                <motion.div animate={flight} className={styles.planeFlight}>
                <svg viewBox="0 0 64 64" className={styles.planeSvg}>
                    {/* Far wing sits in shadow, near wing catches the light, and the
                        centre fold runs between them from nose to tail. */}
                    <path d="M3 27 L61 3 L27 37 Z" fill="#e3d5c0" />
                    <path d="M27 37 L61 3 L37 61 Z" fill="#ffffff" />
                    <path d="M27 37 L37 61 L29 49 Z" fill="#f4ebdd" />
                    <path
                        d="M3 27 L61 3 L37 61 L29 49 L27 37 Z"
                        fill="none"
                        stroke="#c9b79f"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                    <path d="M61 3 L27 37" fill="none" stroke="#c9b79f" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                </motion.div>
            </DeskItem>

            {/* ---------- iOS-style bits ---------- */}

            {/* The room's light switch. Shares its state with the dimmer, so
                flicking it also slides the slider to match. */}
            <DeskItem
                className={styles.toggle}
                style={{ top: '14%', right: '30%' }}
                rotate={-8}
                delay={0.65}
                onActivate={onToggleLights}
            >
                <motion.span
                    className={styles.toggleTrack}
                    animate={{ backgroundColor: lightsOn ? '#34c759' : '#8b8177' }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    <motion.span
                        className={styles.toggleKnob}
                        animate={{ x: lightsOn ? 20 : 0 }}
                        transition={{ type: 'spring', bounce: 0.24, duration: 0.35 }}
                    />
                </motion.span>
            </DeskItem>

            <DeskItem className={styles.notif} style={{ top: '38%', right: '2%' }} rotate={4} delay={0.7}>
                <span className={styles.notifIcon}>
                    {/* Reminders: a white tile holding a short list, each row a
                        coloured dot beside a grey rule. Drawn, not Apple's asset. */}
                    <svg viewBox="0 0 48 48" className={styles.notifIconArt}>
                        {[
                            { y: 12, dot: '#ff9500' },
                            { y: 21, dot: '#ff3b30' },
                            { y: 30, dot: '#007aff' },
                            { y: 39, dot: '#aeaeb2' },
                        ].map((row) => (
                            <g key={row.y}>
                                <circle cx="13" cy={row.y} r="3.4" fill={row.dot} />
                                <line
                                    x1="21"
                                    y1={row.y}
                                    x2="38"
                                    y2={row.y}
                                    stroke="#d6d6db"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </g>
                        ))}
                    </svg>
                </span>
                <span className={styles.notifText}>
                    <span className={styles.notifApp}>REMINDERS</span>
                    <span className={styles.notifBody}>Ship the thing</span>
                </span>
            </DeskItem>

            <DeskItem className={styles.appIcon} style={{ top: '60%', right: '32%' }} rotate={9} delay={0.8}>
                {/* Angle brackets, mirrored either side of centre */}
                <svg
                    className={styles.appGlyph}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M8.2 8.2 4.2 12l4 3.8" />
                    <path d="M15.8 8.2 19.8 12l-4 3.8" />
                </svg>
            </DeskItem>

            <DeskItem className={styles.bubbles} style={{ top: '84%', left: '42%' }} rotate={-4} delay={0.85}>
                <span className={styles.bubbleIn}>you up?</span>
                <span className={styles.bubbleOut}>shipping</span>
            </DeskItem>
        </div>
    );
};

export default Desk;
