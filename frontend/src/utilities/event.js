export function createEvent() {
  const subscribers = new Set();

  function event() {
    subscribers.forEach(callback => {
      if (typeof callback === 'function') callback(...arguments);
      else subscribers.delete(callback);
    });
  }

  event.subscribe = callback => subscribers.add(callback);
  event.unsubscribe = callback => subscribers.delete(callback);

  return event;
}
