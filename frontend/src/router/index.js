import Fragment from '@/components/Fragment.vue';
import { useCubeStore } from '@/stores/cubeStore';
import { useNavStore } from '@/stores/navStore';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'home',
      component: Fragment,
    },
    {
      path: '/socials',
      name: 'socials',
      component: Fragment,
    },
    {
      path: '/resume',
      name: 'resume',
      component: Fragment,
    },
    {
      path: '/about',
      name: 'about',
      component: Fragment,
    },
    {
      path: '/skills',
      name: 'skills',
      component: Fragment,
    },
    {
      path: '/projects',
      children: [
        {
          path: '',
          name: 'projects',
          component: Fragment,
        },
        {
          path: ':name',
          name: 'project',
          component: Fragment,
        },
      ],
    },
  ],
});

export default router;

router.afterEach(to => {
  const cubeStore = useCubeStore();
  const navStore = useNavStore();
  cubeStore.rotateTo(to);
  navStore.navigated();
});

router.beforeResolve(() => {
  const cubeStore = useCubeStore();
  cubeStore.beforeRoute();
});
