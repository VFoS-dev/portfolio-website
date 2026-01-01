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

  // Pre-calculate constants
  const maxOpacityDistance = width * 0.8;
  const minOpacityDistance = width;
  const opacityRange = minOpacityDistance - maxOpacityDistance;
  
  // Viewport bounds with padding for stars that might be slightly off-screen
  // Increased padding to allow longer trails to be visible
  const padding = 200;
  const minX = -padding;
  const maxX = width + padding;
  const minY = -padding;
  const maxY = height + padding;

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

    // Early exit: skip stars only if both current and previous positions are off-screen
    // This allows trails that extend into or out of the viewport to be drawn
    const currentInBounds = x >= minX && x <= maxX && y >= minY && y <= maxY;
    const prevInBounds = prevX >= minX && prevX <= maxX && prevY >= minY && prevY <= maxY;
    if (!currentInBounds && !prevInBounds) {
      continue;
    }

    let clampedZ = Math.min(Math.max(star.z, maxOpacityDistance), minOpacityDistance);
    let opacity = (minOpacityDistance - clampedZ) / opacityRange;
    opacity = Math.max(0, Math.min(opacity, 1));

    if (!opacity) continue;

    let trailSegments = getTrailSegments(star.z, width);

    // Set common styles once per star
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    let nextInterpX, nextInterpY, lineWidth;
    let lastOpacity = -1;
    
    // Draw trail segments - optimize by reducing state changes
    for (let j = 0; j < trailSegments; j++) {
      let t = j / (trailSegments - 1);
      let nextT = (j + 1) / (trailSegments - 1);

      let interpX = prevX + (x - prevX) * t;
      let interpY = prevY + (y - prevY) * t;
      nextInterpX = prevX + (x - prevX) * nextT;
      nextInterpY = prevY + (y - prevY) * nextT;

      lineWidth = Math.max(star.size * scale * t, 0.01);
      let trailOpacity = opacity * Math.max(0.1, t);

      // Only update globalAlpha if it changed significantly (reduces state changes)
      if (Math.abs(lastOpacity - trailOpacity) > 0.01) {
        ctx.globalAlpha = trailOpacity;
        lastOpacity = trailOpacity;
      }

      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(interpX, interpY);
      ctx.lineTo(nextInterpX, nextInterpY);
      ctx.stroke();
    }

    // Draw star point
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(nextInterpX, nextInterpY, lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1; // Reset opacity to default after drawing
}

