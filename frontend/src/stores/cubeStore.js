import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { Quaternion } from '@/utilities/quaternions';


const useCubeStore = defineStore('cubeStore', {
    state: () => {
        let projects;
        return {
            canKeyRotate: true,
            rotIntervals: {},
            current: Quaternion.ConvertFromEuler(360, 0, 0),
            home: Quaternion.ConvertFromEuler(360, 0, 0),
            socials: Quaternion.ConvertFromEuler(90, 0, 0),
            resume: Quaternion.ConvertFromEuler(0, 90, 0),
            about: Quaternion.ConvertFromEuler(0, 180, 180),
            skills: Quaternion.ConvertFromEuler(0, 270, 0),
            project: projects = Quaternion.ConvertFromEuler(-90, 0, 0), projects,
        }
    },
    actions: {
        getTransformation() {
            return `matrix3d(${Quaternion.ConvertToMatrix(cubeStore.current).toString()})`
        },
        getList() {
            return ['projects', 'home', 'socials', 'resume', 'about', 'skills']
        },
        rotateTo({ name }) {
            if (!this[name]) return;

            this.current = this.current.rotateTo(this[name]);
        },
        reset() {
            for (const key of this.getList()) {
                const _quaternion = this[key]
                if (Quaternion.SameForward(_quaternion, this.current)) {
                    return this.current = _quaternion;
                }
            }
        },
        rotate({ x = 0, y = 0, z = 0 }) {
            const eulerQuat = Quaternion.ConvertFromEuler(x, y, z);
            this.current = Quaternion.Multiply(this.current, eulerQuat);
        },
        setRotInterval(dir, keyup) {
            const key = Object.keys(dir)
            const exists = this.rotIntervals[key]
            if (exists) {
                if (!keyup) return

                delete this.rotIntervals[key]
                return clearInterval(exists)
            } else {
                this.rotate(dir)
                if (!keyup) {
                    this.rotIntervals[key] = setInterval(this.rotate, 300, dir)
                }
            }
        },
        toggleKeyRotate(bool = !this.canKeyRotate) {
            this.canKeyRotate = bool;
            if (!bool) {
                Object.values(this.rotIntervals).forEach(clearInterval)
            }
        },
        keyRot(e, keyup = false) {
            if (!this.canKeyRotate) return;

            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    return this.setRotInterval({ x: 90 }, keyup);

                case 'ArrowLeft':
                case 'KeyA':
                    return this.setRotInterval({ y: -90 }, keyup);

                case 'ArrowDown':
                case 'KeyS':
                    return this.setRotInterval({ x: -90 }, keyup);

                case 'ArrowRight':
                case 'KeyD':
                    return this.setRotInterval({ y: 90 }, keyup);

                case 'KeyQ':
                    return this.setRotInterval({ z: 90 }, keyup);

                case 'KeyE':
                    return this.setRotInterval({ z: -90 }, keyup);

                default: return;
            }
        },
    }
});

export const cubeStore = useCubeStore(pinia);