# Microsoft Word

the word document is made with 5 functions: newWindow, set, getTime changePage, and dragParentElement

## New Window
```js
function newWindow() {
    let { windows } = this.state;
    let keys = []
    
    // remove focus from all of the other windows
    windows.forEach(w => {
        w.focused = false;
        keys.push(w.key);
    })

    // add a new window 
    windows.push({
        focused: true,
        minimized: false,
        fullscreened: false,
        key: createKey(keys)
    })

    this.setState({ windows });
}
```

## Set
```js
function set(info, value = null) {
    const [id, index] = info.split('-');
    let { windows } = this.state;
    
    // update a window specific variable
    switch (id) {
        case 'closed':
            windows.splice(index, 1);
            break;
        case 'focused':
            windows[index].minimized = false;
            windows = windows.map((w, i) => ({ ...w, focused: i == index }));
            break;
        case 'minimized':
            windows[index].focused = false;
        default:
            windows[index][id] = value === null ? !windows[index][id] : value;
            break;
    }

    this.setState({ windows });
}
```

## Get Time
```js
const getTime = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
```

## Change Page
```js
function changePage(nav) {
    const [_, page, secret] = window.location.pathname.split('/');

    if (nav !== page) {
        const _newPage = nav || "intro"; // just incase if the new page is root
        window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);
        this.props.updatePage(page, _newPage);
    }
}
```

## Drag Parent Element
```js
// drag support for both mouse and touch controls
function dragParentElement(thisInstead = false) {
    function mouseDragSetup(e) {
        let x = e.clientX, 
            y = e.clientY, 
            parent = thisInstead ? 
                e.target : 
                e.target.parentElement;

        function elementDrag(e) {
            parent.style.top = `${(parent.offsetTop - (y - (y = e.clientY)))}px`;
            parent.style.left = `${(parent.offsetLeft - (x - (x = e.clientX)))}px`;
        }

        function closeDragElement() {
            document.onmousemove = document.onmouseup = null;
        }

        document.onmousemove = elementDrag;
        document.onmouseup = closeDragElement;
    }

    function touchDragSetup(e) {
        let x = e.targetTouches[0].clientX, 
            y = e.targetTouches[0].clientY, 
            parent = thisInstead ? 
                e.target : 
                e.target.parentElement;

        function elementDrag(e) {
            parent.style.top = `${(parent.offsetTop - (y - (y = e.targetTouches[0].clientY)))}px`;
            parent.style.left = `${(parent.offsetLeft - (x - (x = e.targetTouches[0].clientX)))}px`;
        }

        function closeDragElement() {
            document.ontouchmove = document.ontouchend = null;
        }

        document.ontouchmove = elementDrag;
        document.ontouchend = closeDragElement;
    }

    return {
        onMouseDown: mouseDragSetup,
        onTouchStart: touchDragSetup,
    }
}
```