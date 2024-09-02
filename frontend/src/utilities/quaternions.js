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

// Quaternion multiplication function (q1 * q2)
export function multiplyQuaternions(q1, q2) {
    return {
        w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
        x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
        y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
        z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
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

export function approximateVector({ x, y, z }) {
    let magnitude = Math.sqrt(x * x + y * y + z * z);

    return {
        x: Math.round(x / magnitude) || 0,
        y: Math.round(y / magnitude) || 0,
        z: Math.round(z / magnitude) || 0,
    };
}

export function areQuaternionsEqual(q1, q2) {
    // Normalize both quaternions
    let normalizedQ1 = getForwardVector(q1);
    let normalizedQ2 = getForwardVector(q2);

    console.log(normalizedQ1, normalizedQ2);

    // Check if the quaternions are equal or negations of each other
    return (normalizedQ1.x === normalizedQ2.x &&
        normalizedQ1.y === normalizedQ2.y &&
        normalizedQ1.z === normalizedQ2.z);
}

// Function to get the conjugate (inverse for unit quaternions)
function quaternionConjugate(q) {
    return { w: q.w, x: -q.x, y: -q.y, z: -q.z };
}

// Function to rotate a vector by a quaternion
function rotateVectorByQuaternion(v, q) {
    // Convert the vector to a quaternion with w = 0
    let vectorQuat = { w: 0, x: v.x, y: v.y, z: v.z };

    // Get the conjugate (inverse) of the quaternion
    let qInverse = quaternionConjugate(q);

    // Perform the rotation: q * v * q^-1
    let rotatedQuat = multiplyQuaternions(multiplyQuaternions(q, vectorQuat), qInverse);

    // Return the rotated vector part

    return {
        x: Math.round(rotatedQuat.x) || 0,
        y: Math.round(rotatedQuat.y) || 0,
        z: Math.round(rotatedQuat.z) || 0,
    };
}

// Function to get the forward vector from a quaternion
function getForwardVector(q) {
    // World-space forward vector (0, 0, 1)
    let forward = { x: 0, y: 0, z: 1 };

    // Rotate the forward vector by the quaternion
    return rotateVectorByQuaternion(forward, q);
}