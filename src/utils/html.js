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

    function handleMoveOut(e) {
        if (!e.style.transform) return;
        e.style.transform = `perspective(${perspective}) scale(1) rotateX(0) rotateY(0)`;
    }

    return {
        onMouseMove: handleMove,
        onMouseOut: (e) => handleMoveOut(e.target),
    }
}

export function onDoubleClick(callback) {
    let first = 0;

    function click() {
        let time = new Date()
        if (time - first < 1000) callback()
        first = time;
    }

    return {
        onDoubleClick: callback,
        onTouchStart: click,
    }
}

export function dragParentElement() {
    function mouseDragSetup(e) {
        let x = e.clientX, y = e.clientY, parent = e.target.parentElement;

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
        let x = e.targetTouches[0].clientX, y = e.targetTouches[0].clientY, parent = e.target.parentElement;

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