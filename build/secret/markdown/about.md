# Duck Hunt

This game is comprised of 7 functions: AddDucks, addDuck, moveDucks, duckRespawn, hitDuck, visualizeDucks, and componentWillUnmount

## Add Ducks
```js
// this function is designed to populate all of the missing ducks
async function AddDucks(n) {
    await timeout(0); // put at the end of the stack, to prevent rendering and updating state change
    if (window.location.pathname.split('/')[1] !== 'about') return; // escape if not the active page

    this.setState({ addingDucks: true }); // prevent this function to be ran multiple times
    while (this.state.ducks.length < n) {
        await timeout(500); // set an interval of 1 second offset by .5s seconds to begin with
        if (window.location.pathname.split('/')[1] !== 'about') return; // escape if not the active page
        
        // generate a new duck and populate it into the data set
        const { ducks, ducksKeys } = this.state;
        var newduck = this.addDuck();

        this.setState({
            ducks: [...ducks, newduck],
            ducksKeys: [...ducksKeys, newduck.id]
        });
        await timeout(500);
    }
    this.setState({ addingDucks: false }); // allow this function to be ran again
}
```

## Add Duck
```js
// this creates a singular duck with random settings
function addDuck() {
    const { ducksKeys } = this.state;
    const rand = Math.floor(Math.random() * 5);
    var right, top, angle = rand - 2;

    // set the direction of the the bird and the velocity
    const dir = {
        0: { top: 0,    right: 1,    ani: 'left'     },
        1: { top: -0.7, right: -0.7, ani: 'up-right' },
        2: { top: -1,   right: 0,    ani: 'up'       },
        3: { top: -0.7, right: 0.7,  ani: 'up-left'  },
        4: { top: 0,    right: -1,   ani: 'right'    },
    }[rand];

    // set the type of bird
    const type = {
        0: 'green', 1: 'blue', 2: 'brown',
    }[Math.floor(3 * Math.random())];

    // set the position of the bird based on the given random direction
    switch (rand) {
        case 0: // left   -- results as a 0
        case 4: // right  -- results as a 1
            top = 20 + 60 * Math.random()
            right = 50 + (!rand ? -1 : 1) * 60
            break;
        default: // up-any
            top = 100
            right = !angle ?
                10 + 80 * Math.random() :
                50 + 20 * angle * Math.random() 
            break;
    }

    return { 
        dir, type, 
        pos: { 
            right, 
            top 
        }, 
        dead: false, 
        noise: 20 * Math.random(),
        speed: 0.2 + 0.2 * Math.random(),
        id: createKey(ducksKeys) 
    };
}
```

## Move Ducks
```js
async function moveDucks() {
    await timeout(0); // end of stack to make sure it does push an state change during a render
    if (window.location.pathname.split('/')[1] !== 'about') return;

    // disable this function from getting called again
    this.setState({ duckAni: true });

    while (this.state.ducks.length > 0) {
        await timeout(24); // max 42 frames a second
        if (window.location.pathname.split('/')[1] !== 'about') return;
        
        const { ducks } = this.state;
        this.setState({
            ducks: ducks.map(a => {
                // if the duck goes out of bounds regenerate a new duck in its place
                if (a.pos.top < -5 - a.noise || a.pos.right < -5 - a.noise || a.pos.right > 105 + a.noise)
                    return this.addDuck();

                // else if the duck is alive update its state, 
                // otherwise leave it in the same spot so the css can animate its death in one spot
                return {
                    ...a,
                    pos: a.dead ? a.pos : {
                        right: a.pos.right + a.speed * a.dir.right,
                        top: a.pos.top + a.speed * a.dir.top
                    },
                };
            })
        })
    }

    // enable the function to get called again
    this.setState({ duckAni: false });
}
```

## Duck Respawn
```js
// this function is after the death animation finishes
function duckRespawn(id) {
    const { ducks, limited } = this.state;
    
    // if duck hunt is catching the ducks dont respawn the ducks instead filter them out of the array
    if (limited) {
        let _ducks = ducks.filter(a => (a.id !== id));
        this.setState({ 
            ducks: _ducks, 
            ducksKeys: _ducks.map(a => a.id) 
        });
    } else {
        // replace the duck that matches the given id
        this.setState({ 
            ducks: ducks.map(a => (a.id === id ? this.addDuck() : a)) 
        });
    }
}
```

## Hit Duck
```js
// clicking the duck
function hitDuck(id) {
    const { ducks, hitDucks } = this.state;

    // mark the current duck as dead, and increase the max ducks based on the total ducks hit
    this.setState({
        ducks: ducks.map(d => ((id === d.id) ? { ...d, dead: true } : d)),
        hitDucks: hitDucks + 1,
        maxDuck: Math.min(25, 2 + Math.floor(hitDucks / 5))
    });
}
```

## Visualize Ducks
```js
// populate the ducks in react
function visualizeDucks() {
    const { ducks } = this.state;
    return ducks.map(d => (
        <div id={d.id} key={d.id} onAnimationEnd={(e) => (this.duckRespawn(e.target.id))} onClick={(e) => this.hitDuck(e.target.id)}
            className={`bird ${d.dead ? "death" : ""}`} style={{ top: `${d.pos.top}vh`, right: `${d.pos.right}vw` }} 
        >
            <div id={d.id} className='crosshair' />
            <div id={d.id} className={`${d.type} ${d.dead ? "hit" : ""} ${d.dir.ani}`} style={{ scale: '3' }} />
        </div>
    ));
}
```

## Component Will Unmount
```js
// this function is to save the cookie for the highscore
function componentWillUnmount() {
    const { activePage } = this.props;
    const { hitDucks } = this.state;
    if (!activePage) return;

    // update the highscore if leaving the about page
    if (hitDucks > (parseInt(getCookie('about-score')) || 0)) setCookie('about-score', hitDucks, 365)
}
```