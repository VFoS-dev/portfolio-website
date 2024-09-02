import { degreesToRadians } from "./conversions";

export class Quaternion {
    static ConvertFromEuler(xDeg = 0, yDeg = 0, zDeg = 0) {
        // Convert degrees to radians
        const x = degreesToRadians(xDeg);
        const y = degreesToRadians(yDeg);
        const z = degreesToRadians(zDeg);

        // Calculate the half angles
        const cx = Math.cos(x / 2);
        const sx = Math.sin(x / 2);
        const cy = Math.cos(y / 2);
        const sy = Math.sin(y / 2);
        const cz = Math.cos(z / 2);
        const sz = Math.sin(z / 2);

        // Combine rotations in quaternion form
        const qx = sx * cy * cz - cx * sy * sz;
        const qy = cx * sy * cz + sx * cy * sz;
        const qz = cx * cy * sz - sx * sy * cz;
        const qw = cx * cy * cz + sx * sy * sz;

        return {
            x: qx,
            y: qy,
            z: qz,
            w: qw,
        };
    }

    static ConvertToMatrix({ x, y, z, w }) {
        return [
            [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0],
            [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0],
            [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), 0],
            [0, 0, 0, 1],
        ];
    }

    static #Multiply(q1, q2) {
        return {
            w: q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z,
            x: q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y,
            y: q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x,
            z: q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w
        };
    }

    static Multiply(...quaternions) {
        // Base case: start with the first quaternion
        let result = quaternions[0];

        // Iterate through the quaternions and multiply them
        for (let i = 1; i < quaternions.length; i++) {
            result = this.#Multiply(result, quaternions[i]);
        }

        return result;
    }

    static Forward(q) {
        // World-space forward vector (0, 0, 1)
        const forward = { x: 0, y: 0, z: 1 };

        // Rotate the forward vector by the quaternion
        return this.RotateVector(forward, q);
    }


    static Conjugate({ x, y, z, w }) {
        return { w, x: -x, y: -y, z: -z };
    }


    // Function to rotate a vector by a quaternion
    static RotateVector({ x, y, z }, quaternion) {
        // Convert the vector to a quaternion with w = 0
        const vectorQuat = { w: 0, x, y, z };

        // Get the conjugate (inverse) of the quaternion
        const qInverse = this.Conjugate(quaternion);

        // Perform the rotation: q * v * q^-1
        const rotatedQuat = this.Multiply(quaternion, vectorQuat, qInverse);

        // Return the rotated vector part
        return rotatedQuat;
    }

    static SnapToVector({ x, y, z }) {
        return {
            x: Math.round(x) || 0,
            y: Math.round(y) || 0,
            z: Math.round(z) || 0,
        }
    }

    static SameForward(q1, q2) {
        // Normalize both quaternions
        let fq1 = this.SnapToVector(this.Forward(q1));
        let fq2 = this.SnapToVector(this.Forward(q2));

        for (const key in fq1) {
            if (fq1[key] !== fq2[key]) return false
        }

        return true;
    }
}