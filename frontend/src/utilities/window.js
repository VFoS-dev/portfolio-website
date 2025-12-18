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
  achievementName = '',
  onDragEnd = null
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

    function closeDragElement(e) {
      document.onmousemove = null;
      document.onmouseup = null;
      if (onDragEnd) {
        onDragEnd(parent);
      }
    }

    // Use document-level listeners so dragging works even when mouse leaves browser
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

export function dragParentElementWithTrash(
  thisInstead = false,
  absoluteParent = false,
  onTrashDrop = () => {},
  iconConfig = null,
  onDragEnd = null
) {
  let trashCanElement = null;
  let isOverTrash = false;

  function findTrashCan() {
    if (!trashCanElement) {
      trashCanElement = document.querySelector('[data-is-trash="true"]');
    }
    return trashCanElement;
  }

  function checkTrashOverlap(element) {
    const trash = findTrashCan();
    if (!trash || !element) return false;

    const elementRect = element.getBoundingClientRect();
    const trashRect = trash.getBoundingClientRect();

    return !(
      elementRect.right < trashRect.left ||
      elementRect.left > trashRect.right ||
      elementRect.bottom < trashRect.top ||
      elementRect.top > trashRect.bottom
    );
  }

  function mouseDragSetup(e) {
    e.preventDefault();
    let x = e.clientX,
      y = e.clientY,
      parent = thisInstead ? e.target : e.target.parentElement;
    if (absoluteParent) parent.style.position = 'absolute';

    function elementDrag(e) {
      e.preventDefault();
      parent.style.top = `${parent.offsetTop - (y - (y = e.clientY))}px`;
      parent.style.left = `${parent.offsetLeft - (x - (x = e.clientX))}px`;

      // Check if over trash can
      const wasOverTrash = isOverTrash;
      isOverTrash = checkTrashOverlap(parent);

      // Update trash can visual state
      const trash = findTrashCan();
      if (trash) {
        if (isOverTrash && !wasOverTrash) {
          trash.classList.add('trash-highlight');
        } else if (!isOverTrash && wasOverTrash) {
          trash.classList.remove('trash-highlight');
        }
      }
    }

    function closeDragElement(e) {
      document.onmousemove = null;
      document.onmouseup = null;

      // Check if dropped on trash
      if (isOverTrash && iconConfig && onTrashDrop) {
        onTrashDrop(iconConfig);
        // Don't remove from DOM - let Vue reactivity handle it
      }

      // Reset trash highlight
      const trash = findTrashCan();
      if (trash) {
        trash.classList.remove('trash-highlight');
      }
      isOverTrash = false;
      
      if (onDragEnd) {
        onDragEnd(parent);
      }
    }

    // Use document-level listeners so dragging works even when mouse leaves browser
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
      parent.style.top = `${parent.offsetTop - (y - (y = e.targetTouches[0].clientY))}px`;
      parent.style.left = `${parent.offsetLeft - (x - (x = e.targetTouches[0].clientX))}px`;

      // Check if over trash can
      const wasOverTrash = isOverTrash;
      isOverTrash = checkTrashOverlap(parent);

      // Update trash can visual state
      const trash = findTrashCan();
      if (trash) {
        if (isOverTrash && !wasOverTrash) {
          trash.classList.add('trash-highlight');
        } else if (!isOverTrash && wasOverTrash) {
          trash.classList.remove('trash-highlight');
        }
      }
    }

    function closeDragElement(e) {
      document.ontouchmove = null;
      document.ontouchend = null;

      // Check if dropped on trash
      if (isOverTrash && iconConfig && onTrashDrop) {
        onTrashDrop(iconConfig);
        // Don't remove from DOM - let Vue reactivity handle it
      }

      // Reset trash highlight
      const trash = findTrashCan();
      if (trash) {
        trash.classList.remove('trash-highlight');
      }
      isOverTrash = false;
      
      if (onDragEnd) {
        onDragEnd(parent);
      }
    }

    document.ontouchmove = elementDrag;
    document.ontouchend = closeDragElement;
  }

  return {
    onMousedown: mouseDragSetup,
    onTouchstart: touchDragSetup,
  };
}
