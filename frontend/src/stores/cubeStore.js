import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { vector3D } from '@/utilities/vector';
import { eulerToQuaternion } from '@/utilities/quaternions';


const useCubeStore = defineStore('cubeStore', {
    state: () => {
        let projects;
        return {
            canKeyRotate: true,
            current: vector3D(0, 0, 0),
            home: eulerToQuaternion(0, 0, 0),
            socials: eulerToQuaternion(90, 0, 0),
            resume: eulerToQuaternion(0, 90, 0),
            about: eulerToQuaternion(0, 180, 180),
            skills: eulerToQuaternion(0, 270, 0),
            project: projects = eulerToQuaternion(-90, 0, 0),
            projects,
        }
    },
    actions: {
        getList() {
            return { ...this, keys: ['projects', 'home', 'socials', 'resume', 'about', 'skills'] }
        },
        rotateTo({ name }) {
            if (!this[name]) return;

            this.current = this.current.rotateTo(this[name]);
        },
        reset() {
            const list = this.getList()
            this.current = this.current.reduce(list)
        },
        keyRot(e) {
            if (!this.canKeyRotate) return;
            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    return this.current = this.current.rotate({ x: 90 })

                case 'ArrowLeft':
                case 'KeyA':
                    return this.current = this.current.rotate({ y: -90 })

                case 'ArrowDown':
                case 'KeyS':
                    return this.current = this.current.rotate({ x: -90 })

                case 'ArrowRight':
                case 'KeyD':
                    return this.current = this.current.rotate({ y: 90 })

                default:
                    return
            }

        },
    }
});

export const cubeStore = useCubeStore(pinia);