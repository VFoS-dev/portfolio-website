import { degreesToRadians } from "./conversions";

export function eulerToQuaternion(xDeg, yDeg, zDeg) {
    // Convert degrees to radians
    let x = degreesToRadians(xDeg);
    let y = degreesToRadians(yDeg);
    let z = degreesToRadians(zDeg);

    // Calculate the half angles
    let cx = Math.cos(x / 2);
    let sx = Math.sin(x / 2);
    let cy = Math.cos(y / 2);
    let sy = Math.sin(y / 2);
    let cz = Math.cos(z / 2);
    let sz = Math.sin(z / 2);

    // Combine rotations in quaternion form
    let qx = sx * cy * cz - cx * sy * sz;
    let qy = cx * sy * cz + sx * cy * sz;
    let qz = cx * cy * sz - sx * sy * cz;
    let qw = cx * cy * cz + sx * sy * sz;

    return {
        x: qx,
        y: qy,
        z: qz,
        w: qw,
    };
}

export function quaternionToMatrix({ x, y, z, w }) {
    let matrix = [
        [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0],
        [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0],
        [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0],
        [0, 0, 0, 1],
    ];

    return matrix;
}

export function multiplyQuaternions(q1, q2) {
    const { x: x1, y: y1, z: z1, w: w1 } = q1;
    const { x: x2, y: y2, z: z2, w: w2 } = q2;

    return {
        x: w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
        y: w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
        z: w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
        w: w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2,
    };
}

export function quaternionDistance(q1, q2) {
    // Dot product of the normalized quaternions
    let dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

    // Ensure the dot product is in the range [-1, 1]
    dot = Math.max(-1, Math.min(1, dot));

    // Compute the angle between the quaternions
    let angle = 2 * Math.acos(Math.abs(dot));

    return angle;
}

export function quaternionTo3x3Matrix({ x, y, z, w }) {
    // Compute the rotation matrix from quaternion components
    let xx = x * x;
    let xy = x * y;
    let xz = x * z;
    let xw = x * w;

    let yy = y * y;
    let yz = y * z;
    let yw = y * w;

    let zz = z * z;
    let zw = z * w;

    let matrix = [
        [1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw)],
        [2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw)],
        [2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy)]
    ];

    return matrix;
}

export function quaternionToCords(quaternion, vector = [0, 0, 1]) {
    const matrix = quaternionTo3x3Matrix(quaternion)
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        result[i] = 0;
        for (let j = 0; j < matrix[i].length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}

export function normalizeQuaternion({ x, y, z, w }) {
    // Compute the norm (magnitude) of the quaternion
    let norm = Math.sqrt(x * x + y * y + z * z + w * w);

    // Check if the norm is not zero to avoid division by zero
    if (norm === 0) {
        throw new Error('Cannot normalize a quaternion with zero magnitude');
    }

    // Normalize each component
    return {
        x: x / norm,
        y: y / norm,
        z: z / norm,
        w: w / norm
    };
}

export function areQuaternionsEqual(q1, q2) {
    // Normalize both quaternions
    let normalizedQ1 = normalizeQuaternion(q1);
    let normalizedQ2 = normalizeQuaternion(q2);
    console.log(normalizedQ1, normalizedQ2);


    // Check if the quaternions are equal or negations of each other
    return (normalizedQ1.x === normalizedQ2.x &&
        normalizedQ1.y === normalizedQ2.y &&
        normalizedQ1.z === normalizedQ2.z &&
        normalizedQ1.w === normalizedQ2.w) ||
        (normalizedQ1.x === -normalizedQ2.x &&
            normalizedQ1.y === -normalizedQ2.y &&
            normalizedQ1.z === -normalizedQ2.z &&
            normalizedQ1.w === -normalizedQ2.w);
}