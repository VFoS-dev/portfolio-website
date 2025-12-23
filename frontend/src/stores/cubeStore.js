import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { Quaternion } from '@/utilities/quaternions';
import router from '@/router';
import { prefersLessMotion } from '@/services/motion-service';
import sides from '@/enums/sides';

const useCubeStore = defineStore('cubeStore', {
  state: () => {
    let projects;
    return {
      state: { animated: true, expand: true, instant: false, [sides.home]: true },
      scrolls: {
        defaults: {},
        [sides.projects]: 1,
        [sides.home]: 1,
        [sides.socials]: 1,
        [sides.resume]: 1,
        [sides.about]: 1,
        [sides.skills]: 1,
      },
      fromMound: true,
      canKeyRotate: true,
      rotIntervals: {},
      focus: sides.home,
      current: Quaternion.ConvertFromEuler(360, 0, 0),
      home: Quaternion.ConvertFromEuler(360, 0, 0),
      socials: Quaternion.ConvertFromEuler(90, 0, 0),
      resume: Quaternion.ConvertFromEuler(0, 90, 0),
      about: Quaternion.ConvertFromEuler(0, 180, 180),
      skills: Quaternion.ConvertFromEuler(0, 270, 0),
      project: (projects = Quaternion.ConvertFromEuler(-90, 0, 0)),
      projects,
    };
  },
  getters: {
    getActiveScroll(state) {
      const { scrolls, focus } = state;
      return scrolls[focus];
    },
  },
  actions: {
    activeGame(bool) {
      this.canKeyRotate = !bool;
    },
    reducedMotion(bool) {
      this.state.animated = !bool;
      this.state.instant = bool;
      this.canKeyRotate = !bool;
    },
    getTransformation() {
      return `matrix3d(${Quaternion.ConvertToMatrix(cubeStore.current).toString()})`;
    },
    getList() {
      return Object.values(sides);
    },
    resized() {
      if (this.state.instant) return;
      this.state.instant = true;
      setTimeout(() => (this.state.instant = false), 0);
    },
    updateFocus(name) {
      delete this.state[this.focus];
      this.focus = name;
      this.state[name] = true;
    },
    beforeRoute() {
      this.state.expand = false;
    },
    rotateTo({ name }) {
      if (!this[name]) return;
      this.scrolls = {
        ...this.scrolls,
        ...this.scrolls.defaults,
      };
      
      // On first mount, set rotation instantly without animation
      if (this.fromMound) {
        this.state.instant = true;
        this.current = this[name];
        this.updateFocus(name);
        this.fromMound = false;
        this.state.expand = true;
        // Reset instant flag after a brief moment to allow normal animations
        setTimeout(() => {
          this.state.instant = false;
        }, 0);
      } else {
        this.current = this[name];
        this.updateFocus(name);
        // Set expand to true after rotation completes
        // If instant mode, expand immediately; otherwise wait for transition
        if (this.state.instant) {
          this.state.expand = true;
        } else {
          // Set expand after transition duration as a backup
          // reset() will also set it when transition ends, but this ensures it happens
          setTimeout(() => {
            this.state.expand = true;
          }, 500); // Match the transition duration (0.5s)
        }
      }
      
      // Reset the resetting flag after navigation completes
      this._resetting = false;
    },
    reset() {
      // Prevent multiple rapid resets
      if (this._resetting) return;
      this._resetting = true;
      
      this.state.expand = true;
      for (const name of this.getList()) {
        const _quaternion = this[name];
        if (Quaternion.SameForward(_quaternion, this.current)) {
          this.updateFocus(name);
          router.push({ name }).finally(() => {
            this._resetting = false;
          });
          return;
        }
      }
      this._resetting = false;
    },
    rotate({ x = 0, y = 0, z = 0 }) {
      this.state.expand = false;
      const eulerQuat = Quaternion.ConvertFromEuler(x, y, z);
      this.current = Quaternion.Multiply(this.current, eulerQuat);

      if ((this.state.instant = !this.state.animated)) {
        this.reset();
      }
    },
    setRotInterval(dir, keyup) {
      const key = Object.keys(dir);
      const exists = this.rotIntervals[key];
      if (exists) {
        if (!keyup) return;

        delete this.rotIntervals[key];
        return clearInterval(exists);
      } else {
        this.rotate(dir);
        if (!keyup) {
          this.rotIntervals[key] = setInterval(this.rotate, 300, dir);
        }
      }
    },
    toggleKeyRotate(bool = !this.canKeyRotate) {
      this.canKeyRotate = bool;
      if (!bool) {
        Object.values(this.rotIntervals).forEach(clearInterval);
      }
    },
    keyRot(e) {
      if (!this.canKeyRotate) return;
      const keyup = e.type == 'keyup';

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

        default:
          return;
      }
    },
    updateScroll(side, percent, base = false) {
      if (base) {
        this.scrolls.defaults[side] = 0;
        this.scrolls[side] = 0;
      } else this.scrolls[side] = percent;
    },
  },
});

export const cubeStore = useCubeStore(pinia);
prefersLessMotion.subscribe(cubeStore.reducedMotion);
