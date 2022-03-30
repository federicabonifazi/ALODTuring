const ASCII = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const ASCIIup = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const ASCIIdo = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const desired = 'ALAN TURING';
const target = 'ALOD TURING';

// Time initially waited before the encrypted string appears (in milliseconds)
const INITIAL_MILLIS = 600;
// Time between one char fade and the next one during "build up"
const BUILDUP_MILLIS = 100;
// How many encrypted sequences to roll during first sequence
const NUMROLLS = 25;
// How much time between consecutive rolls
const ROLL_MILLIS = 120;
// How much time after desired is reached change to target
const FINAL_MILLIS = 1000;

// Colors of text
const BASIC = 'white'; //basic text color (change to black if the background is light)
const ACCENT = '#dc3545'; 

function getRandomString(len) {

    var container = Array(len); // Empty container
    for (var i = 0; i < len; i++) {
        var randomIndex = Math.floor(Math.random() * ASCIIup.length);
        container[i] = ASCIIup[randomIndex];
    }
    return container.join(''); // joins the chars in the arrays
}

function animate() {
    // Get handle for the h1 title element
    var title = document.getElementById('title');

    // Generate first random string
    var encoded = getRandomString(desired.length);

    // Fill title DOM element with one child per character
    var handles = Array(desired.length);
    for (var i = 0; i < desired.length; i++) {
        var span = document.createElement('span');          // A <span> element contains each character
        var textNode = document.createTextNode(encoded[i]); // A textNode contains the text content
        span.classList.add('anim');                         // Makes transitions when changing character color
        span.appendChild(textNode);
        title.appendChild(span);
        handles[i] = span;
    }

    // Initial transition when the encoding appears
    setTimeout(() => {
        // Fade-in in black
        handles[0].style.color = BASIC;
        for (var i = 1; i < desired.length; i++) {
            var callback = (sel) => { handles[sel].style.color = BASIC; };
            setTimeout(callback.bind(null, i), i * BUILDUP_MILLIS);
        }
    }, INITIAL_MILLIS);
    // Now the full first encryption is shown

    // Show subsequent random encryptions
    var timeOffset = INITIAL_MILLIS + desired.length * BUILDUP_MILLIS + 500;
    for (var i = 0; i < NUMROLLS; i++) {
        var callback = (rndmString) => {
            for (var j = 0; j < desired.length; j++) {
                handles[j].textContent = rndmString[j];
            }
        };
        setTimeout(callback.bind(null, getRandomString(desired.length)), (i + 1) * ROLL_MILLIS + timeOffset);
    }

    // Start reveling the desired word
    timeOffset += ROLL_MILLIS * NUMROLLS;                   // Time delay due to previous animations
    for (var i = 0; i < desired.length; i++) {
        var callback = (rndmString, k) => {
            for (var j = 0; j < desired.length; j++) {
                if (j <= k) {
                    handles[j].textContent = desired[j];
                } else {
                    handles[j].textContent = rndmString[j];
                }
            }
        };
        setTimeout(callback.bind(null, getRandomString(desired.length), i), (i + 1) * ROLL_MILLIS + timeOffset);
    }
    // Finally change to the target
    timeOffset += ROLL_MILLIS * desired.length + FINAL_MILLIS;
    for (var i = -1; i < 4; i++) {
        var callback = (rndmString, k) => {
            for (var j = 0; j < desired.length; j++) {
                if (k == -1) {
                    handles[j].classList.remove('anim');
                    if (j < 4) {
                        handles[j].textContent = rndmString[j];
                        handles[j].style.color = BASIC;
                    } else {
                        handles[j].textContent = desired[j];
                        handles[j].style.color = BASIC;
                    }
                    continue;
                }
                if (j <= k) {
                    handles[j].textContent = target[j];
                    if (j >= 1 && j < 4) {
                        handles[j].style.color = ACCENT;
                    }
                } else if (j > k && j < 4) {
                    handles[j].textContent = rndmString[j];
                } else {
                    handles[j].textContent = desired[j];
                }
            }
        };
        setTimeout(callback.bind(null, getRandomString(desired.length), i), (i + 1) * (2 * ROLL_MILLIS) + timeOffset);
    }
}
