# MADE EASY - PRO — Local Educational Website

## Run
Because browsers may restrict local video/PDF access under `file://`, use a tiny local server.

### Option 1 — Python
Open a terminal inside this folder and run:

    python -m http.server 8000

Then open:

    http://localhost:8000

### Option 2 — VS Code
Install Live Server and open `index.html` with Live Server.

## Add your own classes
Open `config.js`.

For a playable class:

    videoFile: "videos/my-class.mp4",
    available: true

Place the corresponding MP4 inside `/videos`.

For a scheduled class that has no video:

    videoFile: "",
    available: false

It will not appear on the homepage's playable/live area, but it remains visible in the class library/schedule as unavailable.

## CPQ files
Put question and answer-key PDFs inside `/cpq`, then edit their paths in `config.js`.

Example:

    questionFile: "cpq/network-cpq01.pdf",
    answerFile: "cpq/network-cpq01-answer.pdf"

## Scheduling
Use 24-hour time in `HH:MM`, for example:

    scheduledTime: "14:00"

Before 2:00 PM, a video-backed class shows as scheduled.
At/after 2:00 PM, it becomes watchable and is visually marked LIVE.

## Notes
The LIVE label is intentionally a visual classroom-mode indicator for recorded local files. The video is still a normal recorded HTML5 video with browser controls.
