import { eulerToQuaternion, multiplyQuaternions, quaternionToMatrix, areQuaternionsEqual, quaternionToCords, normalizeQuaternion } from "./quaternions";

export function vector3D(x = 0, y = 0, z = 0) {
    let quaternion = eulerToQuaternion(x, y, z);

    function getMatrix() {
        return quaternionToMatrix(quaternion)
    }

    function rotateTo(to) {
        quaternion = to
        return compileState()
    }

    function rotate({ x = 0, y = 0, z = 0 }) {
        let eulerQuat = eulerToQuaternion(x, y, z);
        console.log(eulerQuat, quaternion);

        quaternion = multiplyQuaternions(quaternion, eulerQuat);

        return compileState();
    }

    function reduce(quaternions) {
        let closestQuat = null;
        quaternion = normalizeQuaternion(quaternion)
        console.log(quaternions);

        const cords = `${quaternionToCords(quaternion)}`
        const possible = [
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1],
        ]

        found:
        for (const vector of possible) {
            for (const key of quaternions.keys) {
                const _quaternion = quaternions[key]
                const _cords = `${quaternionToCords(_quaternion, vector)}`
                console.log(_cords === cords, areQuaternionsEqual(_quaternion, quaternion), _cords, cords);

                if (_cords === cords) {
                    closestQuat = _quaternion;
                    break found;
                }
            }
        }
        console.log(closestQuat);
        if (closestQuat)
            quaternion = closestQuat;

        return compileState()
    }

    function compileState() {
        return {
            ...quaternion, // x, y, z, w
            getMatrix,
            rotateTo,
            rotate,
            reduce,
        }
    }

    return compileState()
}