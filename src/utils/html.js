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

export function dragParentElement(e) {
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;

    let x = e.clientX, y = e.clientY, parent = e.target.parentElement;
    function elementDrag(e) {
        e.preventDefault();
        parent.style.top = `${(parent.offsetTop - (y - (y = e.clientY)))}px`;
        parent.style.left = `${(parent.offsetLeft - (x - (x = e.clientX)))}px`;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}