# lightsabers
## User Scrolled
```js
async function userScrolled() {
    await timeout(0); // end of stack
    if (window.location.pathname.split('/')[1] !== 'skills') return;
    const f = document.getElementById("focused");

    // check to see if the skill catagories are on the screen

    this.setState({
        scrolled: this.props.scrolled,
        updatedRefs: true,
        onScreen: skillData.map((_, i) => {
            const { current: c } = this[`ref${i}`]
            return (f?.scrollTop + document.documentElement.clientHeight > c?.offsetTop + document.documentElement.clientHeight * 1 / 4) || 
                   (f?.scrollTop + document.documentElement.clientHeight > f?.scrollHeight - 100);
        })
    })
}
```

# Stars
## Setup Starfield
```js
async function setupStarfield() {
    await timeout(0); // do this at the end of the stack
    const { activePage } = this.props;
    
    // generate a new set of stars if this is not the leaving page
    let stars = activePage ? [] : JSON.parse(localStorage.getItem("skills-stars"));
    const { getStars } = starfieldSetup(this.canvas.current, stars);
    this.setState({ starfield: true, getStars });
}
```

## Starfield Setup
```js
function starfieldSetup(canvas, _stars = []) {
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
```

## Component Will Unmount
```js
function componentWillUnmount() {
    const { activePage } = this.props;
    if (!activePage) return;

    // if this page is the original page, save a copy of the stars to rerender them on the leaving page
    const { getStars } = this.state;
    localStorage.setItem("skills-stars", JSON.stringify(getStars()));
}
```