export function starfield(state = true) {
    // constants
    const COLOR_SPACE = "#242424";
    const COLOR_STARS = "white";
    const STAR_NUM = 200; // number of stars in the starfield
    const STAR_SIZE = 0.003; // max star size as a fraction of screen width
    const STAR_SPEED = 0.01; // fraction of screen width per second
    let ctx, active = state, stars, starSpeed, yv, canvas, timeDelta = 0, timeLast = 0;

    function setUp(_canvas) {
        canvas = _canvas;
        const { clientHeight, clientWidth } = document.documentElement;

        // set up the canvas and context
        canvas.height = clientHeight;
        canvas.width = clientWidth;

        ctx = canvas.getContext("2d");
        stars = [];
        starSpeed = STAR_SPEED * clientWidth;
        yv = -starSpeed;

        // set up the stars
        for (let i = 0; i < STAR_NUM; i++) {
            let speedMult = Math.random() * 1.5 + 0.5;
            stars.push({
                r: Math.random() * STAR_SIZE * clientWidth / 2,
                x: Math.floor(Math.random() * clientWidth),
                y: Math.floor(Math.random() * clientHeight),
                xv: 0,
                yv: yv * speedMult * 0.001
            })
        }

        requestAnimationFrame(starloop);
    }

    function disableStars() {
        active = false;
        document.removeEventListener('resize', resize)
    }


    function starloop(timeNow) {
        const { clientHeight, clientWidth } = document.documentElement;
        // calculate the time difference
        timeDelta = timeNow - timeLast;
        timeLast = timeNow;
        if (isNaN(timeDelta)) timeDelta = 1;

        // space background
        ctx.fillStyle = COLOR_SPACE;
        ctx.fillRect(0, 0, clientWidth, clientHeight);

        // draw the stars
        ctx.fillStyle = COLOR_STARS;

        for (let i = 0; i < STAR_NUM; i++) {
            ctx.beginPath();
            ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
            ctx.fill();

            // update the star's x position
            // stars[i].x += stars[i].xv * timeDelta * 0.001;
            // reposition the star to the other side if it goes off screen
            if (stars[i].x < 0 - stars[i].r) {
                stars[i].x = clientWidth + stars[i].r;
            } else if (stars[i].x > clientWidth + stars[i].r) {
                stars[i].x = 0 - stars[i].r;
            }

            // update the star's y position
            stars[i].y += stars[i].yv * timeDelta;

            // reposition the star to the other side if it goes off screen
            if (stars[i].y < 0 - stars[i].r) {
                stars[i].y = clientHeight + stars[i].r;
            } else if (stars[i].y > clientHeight + stars[i].r) {
                stars[i].y = 0 - stars[i].r;
            }
        }

        // call the next frame
        if (active) requestAnimationFrame(starloop);
    }

    function resize() {
        canvas.height = document.documentElement.clientHeight;
        canvas.width = document.documentElement.clientWidth;
    }

    document.addEventListener('resize', resize)
    return {
        setUp,
        disableStars,
    }
}