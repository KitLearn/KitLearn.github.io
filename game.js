let gameCode = decodeURIComponent(window.location.search.substring(1)); // Remove the leading "?" and decode URI components
gameCode = JSON.parse(gameCode);
console.log(gameCode);

let BACKGROUNDposX = 0;
let BACKGROUNDposY = 0;
let backgroundMoveCount = 0;
let mouseMoveEnabled = false;
let playingSong = false;
let songId = null; // Declare songId globally
let map = null;
let songAudio = new Audio;
let cooldown = -1;
let currentArea;

let game;

let mapNum = -1;

let currentMap = [];

let answering = false;

function moveBackground() {
    BACKGROUNDposX += -1;
    BACKGROUNDposY += 1;
    document.body.style.backgroundPosition = `${BACKGROUNDposX}px ${BACKGROUNDposY}px`;

    backgroundMoveCount++;

    // Enable mousemove events after 10 background move events
    if (backgroundMoveCount >= 10) {
        mouseMoveEnabled = false; // Set to true to enable mousemove events
        backgroundMoveCount = 0;
    }
}

let background = setInterval(moveBackground, 50);

document.addEventListener('DOMContentLoaded', function() {
    
    loaded();

    const circle = document.querySelector('.circle');
    const cone = document.querySelector('.cone');
    
    document.body.addEventListener('mousedown', function(event) {
        // Remove the class to cancel any ongoing animation
        circle.classList.remove('clicked');
        
        // Force reflow to restart the animation
        void circle.offsetWidth;
        
        // Add the class to start the animation
        circle.classList.add('clicked');

        if (!playingSong) {
            if (songId == 1073993) {
                songAudio = new Audio('Outlook.mp3');
            }

            if (songId == 1191022) {
                songAudio = new Audio('EndlessWinter.mp3');
            }

            if (songId == 659843) {
                songAudio = new Audio('AnotherWorld.mp3');
            }

            if (songId == 85046) {
                songAudio = new Audio('ChaozFantasy.mp3');
            }

            if (songId == 1210456) {
                songAudio = new Audio('FairyDust.mp3');
            }
            playingSong = true;
            songAudio.play();
            game = setInterval(gameFunction, gameSpeed);
        }

        // Determine the current position of the mouse relative to the center of the screen
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        cone.style.opacity = 0.25;

        // Snap cone to corners based on mouse position relative to the center
        if (mouseX < centerX && mouseY > centerY) {
            currentArea = 2;
            cone.style.transform = `translate(-50%, -50%) rotate(270deg)`; // Bottom-left corner
        } else if (mouseX < centerX && mouseY < centerY) {
            currentArea = 0;
            cone.style.transform = `translate(-50%, -50%) rotate(360deg)`; // Top-left corner
        } else if (mouseX > centerX && mouseY < centerY) {
            currentArea = 1;
            cone.style.transform = `translate(-50%, -50%) rotate(90deg)`; // Top-right corner
        } else if (mouseX > centerX && mouseY > centerY) {
            currentArea = 3;
            cone.style.transform = `translate(-50%, -50%) rotate(180deg)`; // Bottom-right corner
        } else {
            // Calculate angle for other positions
            const rect = circle.getBoundingClientRect();
            const circleCenterX = rect.left + rect.width / 2;
            const circleCenterY = rect.top + rect.height / 2;
            const angle = Math.atan2(mouseY - circleCenterY, mouseX - circleCenterX) * (180 / Math.PI) + 90 + 45;
            
            // Update cone position and rotation for other positions
            cone.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }

        //alert(currentArea);

        // Disable mousemove events for the next 10 background move events
        mouseMoveEnabled = false;
    });

    // Function to update cone rotation based on mouse position
    function updateCone(event) {
        if (!mouseMoveEnabled) {
            return; // Skip updating cone rotation if mousemove is disabled
        }
        
        const rect = circle.getBoundingClientRect();
        const circleCenterX = rect.left + rect.width / 2;
        const circleCenterY = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - circleCenterY, event.clientX - circleCenterX) * (180 / Math.PI) + 90 + 45;
        
        // Update cone position and rotation
        cone.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }

    // Initial setup for cone position
    updateCone({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });

    // Event listener for mousemove to update cone position dynamically
    document.body.addEventListener('mousemove', updateCone);
});


function loaded() {

    songId = gameCode.songId; // Correctly set the global songId
    let song = "song - artist";

    if (songId == 1073993) {
        song = "Outlook - HypercubeRecords";
    }

    if (songId == 1191022) {
        song = "Endless Winter - redcatmusic"; // Changed to "=" for assignment
    }

    if (songId == 659843) {
        song = "Another World - Razorrekker";
    }

    if (songId == 85046) {
        song = "Chaoz Fantasy - ParagonX9";
    }

    if (songId == 1210456) {
        song = "Fairy Dust - X-500"; // Changed to "=" for assignment
    }

    document.getElementsByClassName("songName")[0].textContent = song;
    document.getElementsByClassName("link")[0].href = "https://www.newgrounds.com/audio/listen/" + songId;




    map = gameCode.map;

    console.log(map);
}


// Function to handle game logic
function gameFunction() {
    const cone = document.querySelector('.cone');

    cooldown -= 1;
    if (answering == true) {
        answering = false;
        if (currentArea !== 0) {
            console.log("loose");
            clearInterval(game); // Clear interval if we've processed all maps
            clearImage();
            playingSong = false;
            songAudio.pause();                
            songAudio.currentTime = 0;
            mapNum = -1;
            cone.style.opacity = 0.00;
            clearKit();
            return;
        }
        clearKit();
        cooldown = 0;
    } else if (cooldown <= 0) {


        mapNum++; // Increment mapNum to move to the next map index

        if (mapNum >= map.length) {
            clearInterval(game); // Clear interval if we've processed all maps
            

            if (map[mapNum - 1][currentArea] == 0) {
                console.log("loose");
                clearInterval(game); // Clear interval if we've processed all maps
                clearImage();
                playingSong = false;
                songAudio.pause();
                songAudio.currentTime = 0;
                mapNum = -1;
                cone.style.opacity = 0.00;
                clearKit();
                return;
            }

            clearImage();
        }

        currentMap = map[mapNum]; // Assign current map based on mapNum index




        // Clear any existing images on the screen
        clearImage();

        // Render images based on currentMap values
        for (let i = 0; i < 4; i++) {
            let top = i < 2; // Determine top based on index (0, 1)
            let left = i % 2 === 0; // Determine left based on index (0, 2)

            zoom = "32%"

            // Render spike.png or coin.png based on currentMap[i]
            if (currentMap[i] === 0) {
                renderImage('spike.png', top, left, zoom); // Render spike.png

            } else if (currentMap[i] === 1) {
                renderImage('coin.png', top, left, zoom); // Render coin.png

            } else if (currentMap[i] === 2  ) {
                renderImage('kit.png', top, left, zoom); // Render coin.png
            }
        }

            // Render images based on currentMap values
            for (let i = 0; i < 4; i++) {
                let top = i < 2; // Determine top based on index (0, 1)
                let left = i % 2 === 0; // Determine left based on index (0, 2)
        
                zoom = "22%"
        
                // Render spike.png or coin.png based on currentMap[i]
                if (map[mapNum + 1][i] === 0) {
                    renderImage('spike.png', top, left, zoom); // Render spike.png
        
                } else if (map[mapNum + 1][i] === 1) {
                    renderImage('coin.png', top, left, zoom); // Render coin.png
        
                } else if (map[mapNum + 1][i] === 2  ) {
                    renderImage('kit.png', top, left, zoom); // Render coin.png
                }
            }

                // Render images based on currentMap values
        for (let i = 0; i < 4; i++) {
            let top = i < 2; // Determine top based on index (0, 1)
            let left = i % 2 === 0; // Determine left based on index (0, 2)

            zoom = "13%"

            // Render spike.png or coin.png based on currentMap[i]
            if (map[mapNum + 2][i] === 0) {
                renderImage('spike.png', top, left, zoom); // Render spike.png

            } else if (map[mapNum + 2][i] === 1) {
                renderImage('coin.png', top, left, zoom); // Render coin.png

            } else if (map[mapNum + 2][i] === 2  ) {
                renderImage('kit.png', top, left, zoom); // Render coin.png
            }
        }

        // Example: Alert to show current map (can be replaced with actual game logic)
        console.log("Current Map:", currentMap);

        //     if (map[mapNum - 1][currentArea] !== 0 && map[mapNum - 0][currentArea] !== 0) { } else {}
        if (map[mapNum - 1][currentArea] == 0) {
            console.log("loose");
            clearInterval(game); // Clear interval if we've processed all maps
            clearImage();
            playingSong = false;
            songAudio.pause();
            songAudio.currentTime = 0;
            mapNum = -1;
            cone.style.opacity = 0.00;
            clearKit();
            return;
        }
        

        if (map[mapNum - 1][currentArea] == 2) {
            document.getElementsByClassName("Question")[0].style.top = "10%";

            let RandomKit = gameCode.kit[Math.floor(Math.random() * gameCode.kit.length)];
            
            document.getElementsByClassName("Question")[0].textContent = RandomKit[0];


            for (let i = 0; i < 4; i++) {
                let top = i < 2; // Determine top based on index (0, 1)
                let left = i % 2 === 0; // Determine left based on index (0, 2)
        
                zoom = "16%"
        
                randomKitQuestion = RandomKit[i + 1];

                answering = true;

                renderQuestion(randomKitQuestion, top, left, i)
            }
        }
    }
}

// Function to clear all temporary images
function clearImage() {
    const tempImages = document.body.getElementsByClassName("tempImage");
    while (tempImages.length > 0) {
        tempImages[0].remove(); // Remove the first image in the list
    }
}

function clearKit() {
    const questionForKits = document.body.getElementsByClassName("questionForKit");
    while (questionForKits.length > 0) {
        questionForKits[0].remove(); // Remove the first image in the list
    }

    document.body.getElementsByClassName("Question")[0].style.top = "-1000%";
}

// Function to render an image onto the screen
function renderImage(imageSrc, top, left) {
    // Create a new image element
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Image'; // Optional: Add alt text for accessibility
    img.className = "tempImage"; // Use className to set the class, not img.class

    // Set position based on top and left flags
    if (top) {
        img.style.top = zoom;
    } else {
        img.style.bottom = zoom;
    }

    if (left) {
        img.style.left = zoom;
    } else {
        img.style.right = zoom;
    }

    // inner 32
    // middle 22
    // outer 13

    // Append the image to the body or a specific container
    document.body.getElementsByClassName("image-container")[0].appendChild(img);
}


// Function to render an image onto the screen
function renderQuestion(text, top, left, backgroundColor) {
    // Create a new image element
    const question = document.createElement('span');
    question.textContent = text;
    question.className = "questionForKit"; // Use className to set the class, not img.class

    if (backgroundColor == 0) {
        question.style.backgroundColor = "blueviolet";
    }

    if (backgroundColor == 1) {
        question.style.backgroundColor = "darkgoldenrod";
    }

    if (backgroundColor == 2) {
        question.style.backgroundColor = "red";
    }

    if (backgroundColor == 3) {
        question.style.backgroundColor = "green";
    }

    question.id = backgroundColor;

    // Set position based on top and left flags
    if (top) {
        question.style.top = zoom;
    } else {
        question.style.bottom = zoom;
    }

    if (left) {
        question.style.left = zoom;
    } else {
        question.style.right = zoom;
    }

    // inner 32
    // middle 22
    // outer 13

    // Append the image to the body or a specific container
    document.body.getElementsByClassName("image-container")[0].appendChild(question);
}

let gameSpeed = 500;