// Sourced from github.com/saeedjamalhussains. Edit freely — these two lists
// drive the "Recently Made" and "Other Work" sections entirely.

// Big cards near the top. `tint` is the card background, `art` is optional —
// drop an image path in and it renders instead of the initials monogram.
export const recentWork = [
    {
        title: 'Volatility 3 GUI',
        blurb: 'A desktop front-end for memory forensics — analysing raw memory dumps, crash dumps, and VM snapshots through an async PyQt interface.',
        year: '2026',
        tint: '#e4e8f2',
        art: null,
        href: 'https://github.com/saeedjamalhussains/Volatility_3_GUI',
    },
    {
        title: 'V-Bank',
        blurb: 'A banking application secured with Zero Trust Network Access: a contextual risk engine and a seven-tier role hierarchy.',
        year: '2026',
        tint: '#e7f2ea',
        art: null,
        href: 'https://github.com/saeedjamalhussains/Skill_Palavar',
    },
    {
        title: 'Maigret GUI',
        blurb: 'An OSINT username search across 3000+ sites, streaming results live by importing Maigret as a library instead of shelling out to it.',
        year: '2026',
        tint: '#f2ece0',
        art: null,
        href: 'https://github.com/saeedjamalhussains/gui_maigret',
    },
    {
        title: 'Premiere',
        blurb: 'A premiere-first video broadcasting platform with real-time rooms over WebSockets, built on the MERN stack.',
        year: '2026',
        tint: '#f0e6f2',
        art: null,
        href: 'https://github.com/saeedjamalhussains/VOD_Live_Broadcasting',
    },
];

// Expandable rows lower down. `detail` shows when a row is opened.
export const otherWork = [
    {
        title: 'Sherlock GUI',
        meta: 'OSINT · PyQt6 | 2026',
        blurb: 'A threaded desktop interface for the Sherlock username investigator.',
        detail:
            'Built on Sherlock’s native Python API rather than its CLI, so searches run on background threads and the table fills in as results arrive. Status-coloured rows, a dark/light switch, CSV and JSON export, and cancellation that aborts safely mid-search.',
        href: 'https://github.com/saeedjamalhussains/gui_sherlock',
    },
    {
        title: 'GitFive GUI',
        meta: 'OSINT · PyQt6 | 2026',
        blurb: 'A desktop wrapper for the GitFive GitHub investigation tool.',
        detail:
            'Tabs for user lookup, reverse email lookup, and bulk investigation from a file. Parsed summaries of usernames, emails, repos, and SSH keys sit alongside an interactive tree browser for the raw JSON. Commands run on a background thread with immediate cancellation.',
        href: 'https://github.com/saeedjamalhussains/gui_gitfive',
    },
    {
        title: 'This site',
        meta: 'React · Vite | 2026',
        blurb: 'The portfolio you are reading, built without a template.',
        detail:
            'The hero collage is drawn entirely in CSS and SVG, so the page ships with almost no image payload. Every object on the desk is draggable, the paper rocket flies when tapped, and the brightness slider genuinely dims the page — take it to zero and the whole site switches to dark mode. Built with Vite and deployed to GitHub Pages from Actions.',
        href: 'https://github.com/saeedjamalhussains/myportfolio',
    },
    {
        title: 'TuneUp',
        meta: 'Music streaming | 2026',
        blurb: 'A music streaming platform, currently being rebuilt.',
        detail:
            'A streaming service with library management and an administrative back end. The architecture and design system are being reworked from the ground up, so treat the current state as a checkpoint rather than a finished build.',
        href: 'https://github.com/saeedjamalhussains/Music_Streaming_System',
    },
    {
        title: 'Job Portal',
        meta: 'Full-stack · MERN | 2026',
        blurb: 'Job listings, applications, and résumé uploads.',
        detail:
            'React and Tailwind over an Express and MongoDB back end, with JWT authentication, hashed credentials, and multipart file upload for résumés.',
        href: 'https://github.com/saeedjamalhussains/Job_Portal',
    },
];

export const links = {
    email: 'connect.ssjh@gmail.com',
    github: 'https://github.com/saeedjamalhussains',
    linkedin: 'https://www.linkedin.com/in/saeedjamalhussainshaik/',
    instagram: 'https://www.instagram.com/saeedjamalhussains/',
};
