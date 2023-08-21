export function starfieldSetup(canvas, _stars = []) {
    // constants
    const COLOR_SPACE = "#242424";
    const COLOR_STARS = "white";
    const STAR_NUM = 200; // number of stars in the starfield
    const STAR_SIZE = 0.003; // max star size as a fraction of screen width
    const STAR_SPEED = 0.01; // fraction of screen width per second

    // set up the canvas and context
    var ctx = canvas.getContext("2d");
    canvas.height = document.documentElement.clientHeight;
    canvas.width = document.documentElement.clientWidth;

    // set up the stars
    var stars = _stars;
    var starSpeed = STAR_SPEED * canvas.width;
    var yv = -starSpeed;
    if (!stars.length)
        for (let i = 0; i < STAR_NUM; i++) {
            let speedMult = Math.random() * 1.5 + 0.5;
            stars[i] = {
                r: Math.random() * STAR_SIZE * canvas.width / 2,
                x: Math.floor(Math.random() * canvas.width),
                y: Math.floor(Math.random() * canvas.height),
                xv: 0,
                yv: yv * speedMult
            }
        }

    // set up the animation loop
    var timeDelta, timeLast = 0;

    const getStars = () => stars;

    function starloop(timeNow) {
        // calculate the time difference
        timeDelta = timeNow - timeLast;
        timeLast = timeNow;

        // space background
        ctx.fillStyle = COLOR_SPACE;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw the stars
        ctx.fillStyle = COLOR_STARS;
        for (let i = 0; i < STAR_NUM; i++) {
            ctx.beginPath();
            ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, Math.PI * 2);
            ctx.fill();

            // update the star's x position
            stars[i].x += stars[i].xv * timeDelta * 0.001;

            // reposition the star to the other side if it goes off screen
            if (stars[i].x < 0 - stars[i].r) {
                stars[i].x = canvas.width + stars[i].r;
            } else if (stars[i].x > canvas.width + stars[i].r) {
                stars[i].x = 0 - stars[i].r;
            }

            // update the star's y position
            stars[i].y += stars[i].yv * timeDelta * 0.001;

            // reposition the star to the other side if it goes off screen
            if (stars[i].y < 0 - stars[i].r) {
                stars[i].y = canvas.height + stars[i].r;
            } else if (stars[i].y > canvas.height + stars[i].r) {
                stars[i].y = 0 - stars[i].r;
            }
        }

        // call the next frame
        if (window.location.pathname.split('/')[1] !== 'skills') return;
        requestAnimationFrame(starloop);
    }

    function resize() {
        canvas.height = document.documentElement.clientHeight;
        canvas.width = document.documentElement.clientWidth;
    }

    requestAnimationFrame(starloop);

    document.addEventListener('resize', resize)
    return {
        getStars: getStars.bind(this)
    }
}