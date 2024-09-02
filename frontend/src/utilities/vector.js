import { eulerToQuaternion, multiplyQuaternions, quaternionToMatrix, areQuaternionsEqual, quaternionToCords } from "./quaternions";

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
        for (const key of quaternions.keys) {
            const _quaternion = quaternions[key]
            if (areQuaternionsEqual(_quaternion, quaternion)) {
                quaternion = _quaternion;
                break;
            }
        }

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