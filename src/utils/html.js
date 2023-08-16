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