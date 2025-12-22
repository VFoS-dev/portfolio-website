// Define some common functions for working with vectors
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a, b) => a.x * b.x + a.y * b.y;
const hypot2 = (a, b) => dot(sub(a, b), sub(a, b));

// Function for projecting some vector a onto b
function proj(a, b) {
  const k = dot(a, b) / dot(b, b);
  return { x: k * b.x, y: k * b.y };
}

export function distanceSegmentToPoint(A, B, C) {
  // Compute vectors AC and AB
  const AC = sub(C, A);
  const AB = sub(B, A);

  // Get point D by taking the projection of AC onto AB then adding the offset of A
  const D = add(proj(AC, AB), A);

  const AD = sub(D, A);
  // D might not be on AB so calculate k of D down AB (aka solve AD = k * AB)
  // We can use either component, but choose larger value to reduce the chance of dividing by zero
  const k = Math.abs(AB.x) > Math.abs(AB.y) ? AD.x / AB.x : AD.y / AB.y;

  // Check if D is off either end of the line segment
  if (k <= 0.0) {
    return Math.sqrt(hypot2(C, A));
  } else if (k >= 1.0) {
    return Math.sqrt(hypot2(C, B));
  }

  return Math.sqrt(hypot2(C, D));
}

