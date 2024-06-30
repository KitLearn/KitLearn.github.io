// index.js

let BACKGROUNDposX = 0;
let BACKGROUNDposY = 0;
let backgroundMoveCount = 0;
let mouseMoveEnabled = false;

function moveBackground() {
    BACKGROUNDposX += -1;
    BACKGROUNDposY += 1;
    document.body.style.backgroundPosition = `${BACKGROUNDposX}px ${BACKGROUNDposY}px`;

    backgroundMoveCount++;

    // Enable mousemove events after 10 background move events
    if (backgroundMoveCount >= 10) {
        mouseMoveEnabled = false;
        backgroundMoveCount = 0;
    }
}
let background = setInterval(moveBackground, 50);


function play() {
    let kitCode = document.getElementsByClassName("kit")[0].value;
    window.open("/play?" + kitCode);
}