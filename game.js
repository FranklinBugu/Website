/* =====================================================
   SHADOW STRIKE
   PLAYABLE SHOOTING GAME + LEADERBOARD
===================================================== */


/* =====================================================
   HTML ELEMENTS
===================================================== */

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const startScreen =
    document.getElementById("startScreen");

const gameOverScreen =
    document.getElementById("gameOver");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");

const nameScreen =
    document.getElementById("nameScreen");


const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const leaderboardButton =
    document.getElementById("leaderboardButton");

const startLeaderboardButton =
    document.getElementById("startLeaderboardButton");

const gameOverLeaderboardButton =
    document.getElementById(
        "gameOverLeaderboardButton"
    );

const closeLeaderboard =
    document.getElementById(
        "closeLeaderboard"
    );

const clearLeaderboard =
    document.getElementById(
        "clearLeaderboard"
    );


const saveScoreButton =
    document.getElementById(
        "saveScoreButton"
    );

const playerNameInput =
    document.getElementById(
        "playerName"
    );


const scoreText =
    document.getElementById("score");

const waveText =
    document.getElementById("wave");

const healthBar =
    document.getElementById("healthBar");


const finalScore =
    document.getElementById("finalScore");

const finalWave =
    document.getElementById("finalWave");


const newHighScore =
    document.getElementById(
        "newHighScore"
    );


const leaderboardList =
    document.getElementById(
        "leaderboardList"
    );


/* =====================================================
   CANVAS SIZE
===================================================== */

let width;
let height;


function resizeCanvas() {

    width = window.innerWidth;

    height = window.innerHeight;


    const pixelRatio =
        window.devicePixelRatio || 1;


    canvas.width =
        width * pixelRatio;

    canvas.height =
        height * pixelRatio;


    canvas.style.width =
        width + "px";

    canvas.style.height =
        height + "px";


    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );
}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =====================================================
   GAME VARIABLES
===================================================== */

let running = false;

let score = 0;

let wave = 1;

let health = 100;


let enemies = [];

let bullets = [];

let particles = [];


let keys = {};

let lastTime = 0;

let spawnTimer = 0;

let killsThisWave = 0;

let enemiesNeeded = 8;


/* =====================================================
   MOUSE
===================================================== */

const mouse = {

    x: width / 2,

    y: height / 2,

    down: false

};


canvas.addEventListener(
    "mousemove",
    event => {

        const rect =
            canvas.getBoundingClientRect();


        mouse.x =
            event.clientX -
            rect.left;

        mouse.y =
            event.clientY -
            rect.top;

    }
);


canvas.addEventListener(
    "mousedown",
    event => {

        if (event.button === 0) {

            mouse.down = true;

        }

    }
);


window.addEventListener(
    "mouseup",
    event => {

        if (event.button === 0) {

            mouse.down = false;

        }

    }
);


/* =====================================================
   KEYBOARD
===================================================== */

window.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;


        /* Prevent scrolling with WASD */

        if (
            [
                "w",
                "a",
                "s",
                "d"
            ].includes(
                event.key.toLowerCase()
            )
        ) {

            event.preventDefault();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =====================================================
   PLAYER
===================================================== */

const player = {

    x: width / 2,

    y: height / 2,

    radius: 18,

    speed: 320,

    angle: 0,

    shootCooldown: 0

};


/* =====================================================
   START GAME
===================================================== */

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    leaderboardScreen.classList.add(
        "hidden"
    );

    nameScreen.classList.add(
        "hidden"
    );


    score = 0;

    wave = 1;

    health = 100;


    enemies = [];

    bullets = [];

    particles = [];


    killsThisWave = 0;

    enemiesNeeded = 8;

    spawnTimer = 0;


    player.x =
        width / 2;

    player.y =
        height / 2;

    player.shootCooldown = 0;


    mouse.down = false;


    running = true;


    updateHUD();


    for (
        let i = 0;
        i < enemiesNeeded;
        i++
    ) {

        spawnEnemy();

    }


    lastTime =
        performance.now();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   SPAWN ENEMY
===================================================== */

function spawnEnemy() {

    let x;

    let y;


    const side =
        Math.floor(
            Math.random() * 4
        );


    if (side === 0) {

        x =
            Math.random() *
            width;

        y = -50;

    }

    else if (side === 1) {

        x =
            width + 50;

        y =
            Math.random() *
            height;

    }

    else if (side === 2) {

        x =
            Math.random() *
            width;

        y =
            height + 50;

    }

    else {

        x = -50;

        y =
            Math.random() *
            height;

    }


    enemies.push({

        x: x,

        y: y,

        radius:
            17 +
            Math.random() * 8,

        speed:
            55 +
            wave * 8 +
            Math.random() * 25,

        health: 2

    });

}


/* =====================================================
   SHOOT
===================================================== */

function shoot() {

    if (
        player.shootCooldown > 0
    ) {

        return;

    }


    const dx =
        mouse.x -
        player.x;

    const dy =
        mouse.y -
        player.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance === 0) {

        return;

    }


    const bulletSpeed = 900;


    bullets.push({

        x: player.x,

        y: player.y,

        vx:
            dx /
            distance *
            bulletSpeed,

        vy:
            dy /
            distance *
            bulletSpeed,

        radius: 5,

        life: 1

    });


    player.shootCooldown =
        0.12;


    createParticles(

        player.x +
            Math.cos(
                player.angle
            ) * 30,

        player.y +
            Math.sin(
                player.angle
            ) * 30,

        4

    );

}


/* =====================================================
   UPDATE GAME
===================================================== */

function update(dt) {

    /* =====================
       PLAYER MOVEMENT
    ===================== */

    let moveX = 0;

    let moveY = 0;


    if (keys["w"]) {

        moveY -= 1;

    }


    if (keys["s"]) {

        moveY += 1;

    }


    if (keys["a"]) {

        moveX -= 1;

    }


    if (keys["d"]) {

        moveX += 1;

    }


    const moveLength =
        Math.sqrt(
            moveX * moveX +
            moveY * moveY
        );


    if (moveLength > 0) {

        moveX /=
            moveLength;

        moveY /=
            moveLength;

    }


    player.x +=
        moveX *
        player.speed *
        dt;


    player.y +=
        moveY *
        player.speed *
        dt;


    /* Keep player inside screen */

    player.x =
        Math.max(
            player.radius,

            Math.min(
                width -
                    player.radius,

                player.x
            )
        );


    player.y =
        Math.max(
            player.radius,

            Math.min(
                height -
                    player.radius,

                player.y
            )
        );


    /* =====================
       AIM
    ===================== */

    player.angle =
        Math.atan2(

            mouse.y -
                player.y,

            mouse.x -
                player.x

        );


    /* =====================
       SHOOT
    ===================== */

    if (mouse.down) {

        shoot();

    }


    if (
        player.shootCooldown > 0
    ) {

        player.shootCooldown -= dt;

    }


    /* =====================
       BULLETS
    ===================== */

    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        bullet.x +=
            bullet.vx * dt;

        bullet.y +=
            bullet.vy * dt;


        bullet.life -= dt;


        if (

            bullet.life <= 0 ||

            bullet.x < -100 ||

            bullet.x >
                width + 100 ||

            bullet.y < -100 ||

            bullet.y >
                height + 100

        ) {

            bullets.splice(
                i,
                1
            );

        }

    }


    /* =====================
       ENEMIES
    ===================== */

    for (
        let i =
            enemies.length - 1;

        i >= 0;

        i--
    ) {

        const enemy =
            enemies[i];


        const dx =
            player.x -
            enemy.x;

        const dy =
            player.y -
            enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > 0) {

            enemy.x +=
                dx /
                distance *
                enemy.speed *
                dt;

            enemy.y +=
                dy /
                distance *
                enemy.speed *
                dt;

        }


        /* Enemy hits player */

        if (

            distance <
            player.radius +
            enemy.radius

        ) {

            health -=
                35 * dt;


            if (health <= 0) {

                health = 0;

                endGame();

                return;

            }

        }

    }


    /* =====================
       BULLET COLLISION
    ===================== */

    for (
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        for (
            let j =
                enemies.length - 1;

            j >= 0;

            j--
        ) {

            const enemy =
                enemies[j];


            const dx =
                bullet.x -
                enemy.x;

            const dy =
                bullet.y -
                enemy.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (

                distance <
                bullet.radius +
                enemy.radius

            ) {

                bullets.splice(
                    i,
                    1
                );


                enemy.health--;


                createParticles(
                    enemy.x,
                    enemy.y,
                    8
                );


                if (
                    enemy.health <= 0
                ) {

                    enemies.splice(
                        j,
                        1
                    );


                    score += 100;

                    killsThisWave++;

                }


                break;

            }

        }

    }


    /* =====================
       SPAWN MORE ENEMIES
    ===================== */

    spawnTimer -= dt;


    if (

        enemies.length < 3 &&

        killsThisWave <
            enemiesNeeded &&

        spawnTimer <= 0

    ) {

        spawnEnemy();

        spawnTimer = 0.5;

    }


    /* =====================
       NEXT WAVE
    ===================== */

    if (

        killsThisWave >=
            enemiesNeeded &&

        enemies.length === 0

    ) {

        wave++;

        killsThisWave = 0;


        enemiesNeeded =
            8 + wave * 3;


        health =
            Math.min(
                100,
                health + 20
            );


        for (
            let i = 0;

            i < enemiesNeeded;

            i++
        ) {

            spawnEnemy();

        }

    }


    /* =====================
       PARTICLES
    ===================== */

    for (
        let i =
            particles.length - 1;

        i >= 0;

        i--
    ) {

        const particle =
            particles[i];


        particle.x +=
            particle.vx * dt;

        particle.y +=
            particle.vy * dt;


        particle.life -= dt;


        particle.vx *= 0.96;

        particle.vy *= 0.96;


        if (
            particle.life <= 0
        ) {

            particles.splice(
                i,
                1
            );

        }

    }


    updateHUD();

}


/* =====================================================
   PARTICLES
===================================================== */

function createParticles(
    x,
    y,
    amount
) {

    for (
        let i = 0;

        i < amount;

        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            50 +
            Math.random() *
            180;


        particles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 0.35,

            maxLife: 0.35,

            size:
                2 +
                Math.random() * 4

        });

    }

}


/* =====================================================
   DRAW BACKGROUND
===================================================== */

function drawBackground() {

    ctx.fillStyle =
        "#070707";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Grid */

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    const grid = 50;


    for (
        let x = 0;

        x < width;

        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let y = 0;

        y < height;

        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }

}


/* =====================================================
   DRAW PLAYER
===================================================== */

function drawPlayer() {

    ctx.save();


    ctx.translate(
        player.x,
        player.y
    );


    ctx.rotate(
        player.angle
    );


    /* Gun */

    ctx.fillStyle =
        "#aaa";


    ctx.fillRect(
        5,
        -5,
        35,
        10
    );


    ctx.fillStyle =
        "#555";


    ctx.fillRect(
        25,
        -3,
        20,
        6
    );


    /* Body */

    ctx.beginPath();


    ctx.arc(
        0,
        0,
        player.radius,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#e50914";


    ctx.fill();


    /* Center */

    ctx.beginPath();


    ctx.arc(
        0,
        0,
        9,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#151515";


    ctx.fill();


    ctx.restore();

}


/* =====================================================
   DRAW BULLETS
===================================================== */

function drawBullets() {

    for (
        const bullet
        of bullets
    ) {

        ctx.beginPath();


        ctx.arc(
            bullet.x,
            bullet.y,
            bullet.radius,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ffffff";


        ctx.fill();

    }

}


/* =====================================================
   DRAW ENEMIES
===================================================== */

function drawEnemies() {

    for (
        const enemy
        of enemies
    ) {

        /* Body */

        ctx.beginPath();


        ctx.arc(
            enemy.x,
            enemy.y,
            enemy.radius,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#8b0000";


        ctx.fill();


        ctx.strokeStyle =
            "#ff3333";


        ctx.lineWidth = 2;


        ctx.stroke();


        /* Eyes */

        ctx.fillStyle =
            "white";


        ctx.fillRect(
            enemy.x - 7,
            enemy.y - 5,
            4,
            4
        );


        ctx.fillRect(
            enemy.x + 3,
            enemy.y - 5,
            4,
            4
        );

    }

}


/* =====================================================
   DRAW PARTICLES
===================================================== */

function drawParticles() {

    for (
        const particle
        of particles
    ) {

        const alpha =
            particle.life /
            particle.maxLife;


        ctx.globalAlpha =
            alpha;


        ctx.beginPath();


        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ff3030";


        ctx.fill();

    }


    ctx.globalAlpha = 1;

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop(time) {

    if (!running) {

        return;

    }


    const dt =
        Math.min(

            (time - lastTime) /
                1000,

            0.033

        );


    lastTime = time;


    update(dt);


    drawBackground();

    drawBullets();

    drawEnemies();

    drawParticles();

    drawPlayer();


    requestAnimationFrame(
        gameLoop
    );

}


/* =====================================================
   HUD
===================================================== */

function updateHUD() {

    scoreText.textContent =
        score;


    waveText.textContent =
        wave;


    healthBar.style.width =
        health + "%";

}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    running = false;

    mouse.down = false;


    finalScore.textContent =
        score;


    finalWave.textContent =
        wave;


    /* Check whether score
       qualifies for leaderboard */

    const scores =
        getLeaderboard();


    const qualifies =
        scores.length < 10 ||
        score >
            scores[
                scores.length - 1
            ].score;


    if (qualifies) {

        newHighScore.classList.remove(
            "hidden"
        );

    }

    else {

        newHighScore.classList.add(
            "hidden"
        );

    }


    gameOverScreen.classList.remove(
        "hidden"
    );


    /* If score qualifies,
       ask for name */

    if (qualifies) {

        setTimeout(
            () => {

                gameOverScreen.classList.add(
                    "hidden"
                );

                nameScreen.classList.remove(
                    "hidden"
                );

                playerNameInput.value =
                    "";

                playerNameInput.focus();

            },
            700
        );

    }

}


/* =====================================================
   LEADERBOARD STORAGE
===================================================== */

const LEADERBOARD_KEY =
    "shadowStrikeLeaderboard";


function getLeaderboard() {

    const saved =
        localStorage.getItem(
            LEADERBOARD_KEY
        );


    if (!saved) {

        return [];

    }


    try {

        const scores =
            JSON.parse(saved);


        if (
            !Array.isArray(scores)
        ) {

            return [];

        }


        return scores
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            )
            .slice(0, 10);

    }

    catch (error) {

        console.error(
            "Could not load leaderboard:",
            error
        );


        return [];

    }

}


/* =====================================================
   SAVE LEADERBOARD
===================================================== */

function saveLeaderboard(
    scores
) {

    localStorage.setItem(

        LEADERBOARD_KEY,

        JSON.stringify(scores)

    );

}


/* =====================================================
   ADD SCORE
===================================================== */

function addScore(
    name,
    scoreValue,
    waveValue
) {

    const scores =
        getLeaderboard();


    scores.push({

        name:
            name.trim() ||
            "Player",

        score:
            scoreValue,

        wave:
            waveValue,

        date:
            new Date().toLocaleDateString()

    });


    scores.sort(
        (a, b) =>
            b.score -
            a.score
    );


    const topTen =
        scores.slice(
            0,
            10
        );


    saveLeaderboard(
        topTen
    );


    displayLeaderboard();

}


/* =====================================================
   DISPLAY LEADERBOARD
===================================================== */

function displayLeaderboard() {

    const scores =
        getLeaderboard();


    leaderboardList.innerHTML =
        "";


    if (
        scores.length === 0
    ) {

        leaderboardList.innerHTML = `

            <div class="empty-leaderboard">

                🏆 No scores yet.

                <br><br>

                Be the first player
                to make the leaderboard!

            </div>

        `;

        return;

    }


    scores.forEach(
        (entry, index) => {

            let medal = "";


            if (index === 0) {

                medal = "🥇";

            }

            else if (index === 1) {

                medal = "🥈";

            }

            else if (index === 2) {

                medal = "🥉";

            }

            else {

                medal =
                    "#" +
                    (index + 1);

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "leaderboard-row";


            row.innerHTML = `

                <div class="rank">

                    ${medal}

                </div>

                <div>

                    <div class="player-name">

                        ${escapeHTML(
                            entry.name
                        )}

                    </div>

                    <div class="player-date">

                        Wave ${entry.wave}
                        &nbsp; • &nbsp;
                        ${entry.date}

                    </div>

                </div>

                <div class="player-score">

                    ${entry.score.toLocaleString()}

                </div>

            `;


            leaderboardList.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   PROTECT LEADERBOARD
   FROM HTML INJECTION
===================================================== */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =====================================================
   OPEN LEADERBOARD
===================================================== */

function openLeaderboard() {

    running = false;

    mouse.down = false;


    startScreen.classList.add(
        "hidden"
    );

    gameOverScreen.classList.add(
        "hidden"
    );

    nameScreen.classList.add(
        "hidden"
    );


    displayLeaderboard();


    leaderboardScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
   CLOSE LEADERBOARD
===================================================== */

function closeLeaderboardScreen() {

    leaderboardScreen.classList.add(
        "hidden"
    );


    /*
       If the player came from
       the start screen, return there.
    */

    if (
        score === 0 &&
        !running
    ) {

        startScreen.classList.remove(
            "hidden"
        );

    }

    else {

        gameOverScreen.classList.remove(
            "hidden"
        );

    }

}


/* =====================================================
   LEADERBOARD EVENTS
===================================================== */

leaderboardButton.addEventListener(
    "click",
    openLeaderboard
);


startLeaderboardButton.addEventListener(
    "click",
    openLeaderboard
);


gameOverLeaderboardButton.addEventListener(
    "click",
    openLeaderboard
);


closeLeaderboard.addEventListener(
    "click",
    closeLeaderboardScreen
);


/* =====================================================
   SAVE SCORE BUTTON
===================================================== */

saveScoreButton.addEventListener(
    "click",
    saveCurrentScore
);


playerNameInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            saveCurrentScore();

        }

    }
);


function saveCurrentScore() {

    let name =
        playerNameInput.value.trim();


    if (!name) {

        name = "Player";

    }


    name =
        name.substring(
            0,
            15
        );


    addScore(
        name,
        score,
        wave
    );


    nameScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =====================================================
   CLEAR LEADERBOARD
===================================================== */

clearLeaderboard.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Are you sure you want to delete all leaderboard scores?"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            LEADERBOARD_KEY
        );


        displayLeaderboard();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

updateHUD();

displayLeaderboard();

