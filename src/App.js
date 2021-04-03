function handleMove(e) {
  var el = e.target;
  const height = el.clientHeight;
  const width = el.clientWidth;

  const xVal = e.nativeEvent.layerX;
  const yVal = e.nativeEvent.layerY;

  const yRotation = 40 * ((xVal - width / 2) / width)
  const xRotation = -40 * ((yVal - height / 2) / height)

  const string = 'perspective(500px) scale(1.1) rotateX(' + xRotation + 'deg) rotateY(' + yRotation + 'deg)'

  el.style.transform = string
}

function handleMoveOut(e) {
  e.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
}

function random() {
  var page = `/page${Math.floor(Math.random() * 120)}`
  window.history.pushState(page, 'Title', page);
}

function App() {
  return (
    <div
      id="tilt"
      onMouseMove={handleMove}
      onMouseOut={(e) => handleMoveOut(e.target)}
      onClick={random}
    />
  );
}

export default App;