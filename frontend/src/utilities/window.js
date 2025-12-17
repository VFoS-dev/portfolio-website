export function createKey(currentkeys = []) {
  const l = 'abcdefghijklmnopqurstuvwyz';
  const key = [...l].map(() => l[Math.floor(Math.random() * l.length)]).join('');
  return !currentkeys.includes(key) ? key : createKey(currentkeys);
}

export function onDoubleClick(callback = () => {}, params = []) {
  let first = 0;

  function click() {
    const time = new Date();
    if (time - first < 1000) callback(...params);
    first = time;
  }

  return {
    onDblclick: () => callback(...params),
    onTouchend: click,
  };
}

export function dragParentElement(
  thisInstead = false,
  absoluteParent = false,
  checkAchievement = () => {},
  achievementName = ''
) {
  function mouseDragSetup(e) {
    e.preventDefault();
    let x = e.clientX,
      y = e.clientY,
      parent = thisInstead ? e.target : e.target.parentElement;
    if (absoluteParent) parent.style.position = 'absolute';

    function elementDrag(e) {
      e.preventDefault();
      checkAchievement(achievementName);
      parent.style.top = `${parent.offsetTop - (y - (y = e.clientY))}px`;
      parent.style.left = `${parent.offsetLeft - (x - (x = e.clientX))}px`;
    }

    function closeDragElement() {
      document.onmousemove = document.onmouseup = null;
    }

    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
  }

  function touchDragSetup(e) {
    e.preventDefault();
    let x = e.targetTouches[0].clientX,
      y = e.targetTouches[0].clientY,
      parent = thisInstead ? e.target : e.target.parentElement;
    if (absoluteParent) parent.style.position = 'absolute';

    function elementDrag(e) {
      e.preventDefault();
      checkAchievement(achievementName);
      parent.style.top = `${parent.offsetTop - (y - (y = e.targetTouches[0].clientY))}px`;
      parent.style.left = `${parent.offsetLeft - (x - (x = e.targetTouches[0].clientX))}px`;
    }

    function closeDragElement() {
      document.ontouchmove = document.ontouchend = null;
    }

    document.ontouchmove = elementDrag;
    document.ontouchend = closeDragElement;
  }

  return {
    onMousedown: mouseDragSetup,
    onTouchstart: touchDragSetup,
  };
}

export function editableFocusRot() {
  function changeRot(bool) {
    window.dispatchEvent(new CustomEvent('custom-changeRot', { detail: bool }));
  }

  return {
    contentEditable: true,
    onFocus: () => changeRot(true),
    onBlur: () => changeRot(false),
  };
}
