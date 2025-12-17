import { inBounds } from '@/utilities/game';

export function initStars(width, height, count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 2 + 5,
    });
  }

  return {
    stars,
  };
}

export function getTrailSegments(z, width) {
  const minSegments = 7;
  const maxSegments = 40;

  let normalizedZ = Math.min(Math.max(z, width * 0.1), width);

  let segmentRatio = 1 - normalizedZ / width;
  let exponentialFactor = 2;
  let trailSegments =
    minSegments + (maxSegments - minSegments) * Math.pow(segmentRatio, exponentialFactor);

  return Math.ceil(trailSegments);
}

export function drawStars(stars, canvas, width, height, mouseX, mouseY, focalX, focalY) {
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];

    star.z -= star.speed;

    let resetThreshold = width * 0.5 * (1 + star.z / width);
    if (star.z <= 0 || star.z > resetThreshold) {
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      star.z = width;
      star.size = Math.random() * 2 + 1;
      star.speed = Math.random() * 2 + 5;
    }

    let scale = width / star.z;
    let x = (star.x - focalX) * scale + focalX;
    let y = (star.y - focalY) * scale + focalY;

    let prevScale = width / (star.z + star.speed * 100);
    let prevX = (star.x - focalX) * prevScale + focalX;
    let prevY = (star.y - focalY) * prevScale + focalY;

    let maxOpacityDistance = width * 0.8;
    let minOpacityDistance = width;

    let clampedZ = Math.min(Math.max(star.z, maxOpacityDistance), minOpacityDistance);

    let opacity = (minOpacityDistance - clampedZ) / (minOpacityDistance - maxOpacityDistance);
    opacity = Math.max(0, Math.min(opacity, 1));

    if (!opacity) continue;

    let trailSegments = getTrailSegments(star.z, width);

    ctx.beginPath();
    ctx.globalAlpha = opacity;

    let nextInterpX, nextInterpY, lineWidth;
    for (let j = 0; j < trailSegments; j++) {
      let t = j / (trailSegments - 1);

      let interpX = prevX + (x - prevX) * t;
      let interpY = prevY + (y - prevY) * t;

      lineWidth = Math.max(star.size * scale * t, 0.01);

      let trailOpacity = opacity * Math.max(0.1, t);

      ctx.globalAlpha = trailOpacity;

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = 'white';

      let nextT = (j + 1) / (trailSegments - 1);
      nextInterpX = prevX + (x - prevX) * nextT;
      nextInterpY = prevY + (y - prevY) * nextT;

      ctx.beginPath();
      ctx.moveTo(interpX, interpY);
      ctx.lineTo(nextInterpX, nextInterpY);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(nextInterpX, nextInterpY, lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  ctx.globalAlpha = 1; // Reset opacity to default after drawing
}
