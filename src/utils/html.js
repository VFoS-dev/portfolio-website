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

        const height = el.clientHeight;
        const width = el.clientWidth;

        const yRotation = 20 * ((e.nativeEvent.layerX - width / 2) / width);
        const xRotation = -20 * ((e.nativeEvent.layerY - height / 2) / height);

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