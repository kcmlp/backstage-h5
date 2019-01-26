import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/article/list')
    }]
  },
  {
    path: '/updataModelWindow',
    name: 'updataModelWindow',
    component: () => import('@/components/updataModelWindow')
  },
  {
    path: '/article',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/article/list'),
        meta: { title: '用户列表', icon: 'user' }
      }
      // {
      //   path: 'add',
      //   name: 'add',
      //   component: () => import('@/views/article/add'),
      //   meta: { title: '创建用户', icon: 'table' }
      // }
    ]
  },
  {
    path: '/channel',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/channel/index'),
        meta: { title: '频道列表', icon: 'channel' }
      }
    ]
  },
  {
    path: '/version',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/version/index'),
        meta: { title: '版本设置', icon: 'version' }
      }
    ]
  },
  {
    path: '/binding',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/binding/index'),
        meta: { title: '账户绑定', icon: 'binding' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/task/index'),
        meta: { title: '任务管理', icon: 'task' }
      }
    ]
  },
  {
    path: '/gift',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/gift/index'),
        meta: { title: '礼物管理', icon: 'gift' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
