export function EditableFocusRot() {
    function changeRot(bool) {
        window.dispatchEvent(new CustomEvent("custom-changeRot", { detail: bool }));
    }

    return {
        suppressContentEditableWarning: true,
        contentEditable: true,
        onFocus: () => changeRot(true),
        onBlur: () => changeRot(false),
    }
}

export function TileFlexTouchSupport(forceReset = false, perspective = '500px') {
    let parent = null;
    let scroll = null;

    function setup(e) {
        let classList = [...e.target.classList]
        if (classList.includes('tile')) {
            parent = e.target.parentElement;
        } else if (classList.includes('tile-container')) {
            parent = e.target;
        }
        scroll = document.querySelector('#focused.face');
        document.ontouchmove = handleMove;
        document.ontouchend = handleMoveOut;
    }

    function handleMove(e) {
        const { clientX: x, clientY: y } = e.touches[0];
        const { scrollTop } = scroll;
        let found = false;

        for (const tile of parent.children) {
            const { offsetTop: top, offsetLeft, offsetWidth, offsetHeight, } = tile;
            const offsetTop = top - scrollTop;

            if (found || forceReset || y < offsetTop || y > offsetTop + offsetHeight || x < offsetLeft || x > offsetLeft + offsetWidth) {
                tile.style.transform = `perspective(${perspective}) scale(1) rotateX(0) rotateY(0)`;
                tile.classList.remove('hover')
                continue;
            }
            found = true;

            const yRotation = 20 * ((x - offsetLeft - offsetWidth / 2) / offsetWidth),
                xRotation = -20 * ((y - offsetTop - offsetHeight / 2) / offsetHeight);

            tile.style.transform = `perspective(${perspective}) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
            tile.classList.add('hover')
        }
    }

    function handleMoveOut(e) {
        for (const tile of parent.children) {
            tile.style.transform = `perspective(${perspective}) scale(1) rotateX(0) rotateY(0)`;
            tile.classList.remove('hover')
        }
        document.ontouchmove = null;
        document.ontouchend = null;
    }

    return {
        onTouchStart: setup
    }
}

export function TileFlex(forceReset = false, perspective = '500px') {
    function handleMove(e) {
        var el = e.target;
        if (!el) return;

        if (forceReset) return el.style.transform = `perspective(${perspective}) scale(1) rotateX(0) rotateY(0)`;

        const height = el.clientHeight,
            width = el.clientWidth,
            yRotation = 20 * ((e.nativeEvent.layerX - width / 2) / width),
            xRotation = -20 * ((e.nativeEvent.layerY - height / 2) / height)

        el.style.transform = `perspective(${perspective}) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }

    function handleMoveOut({ target: e }) {
        if (!e.style.transform) return;
        e.style.transform = `perspective(${perspective}) scale(1) rotateX(0) rotateY(0)`;
    }

    return {
        onMouseMove: handleMove,
        onMouseOut: handleMoveOut,
    }
}

export function onDoubleClick(callback = () => { }, params = []) {
    let first = 0;

    function click() {
        let time = new Date()
        if (time - first < 1000) callback(...params)
        first = time;
    }

    return {
        onDoubleClick: () => callback(...params),
        onTouchEnd: click,
    }
}

export function dragParentElement(thisInstead = false, absoluteParent = false) {
    function mouseDragSetup(e) {
        let x = e.clientX, y = e.clientY, parent = thisInstead ? e.target : e.target.parentElement;
        if (absoluteParent) parent.style.position = 'absolute';

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
        let x = e.targetTouches[0].clientX, y = e.targetTouches[0].clientY, parent = thisInstead ? e.target : e.target.parentElement;
        if (absoluteParent) parent.style.position = 'absolute';

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