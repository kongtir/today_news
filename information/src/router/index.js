import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/pages/Homepage'
import Category from '@/pages/Category'
import Article from '@/pages/Article'
import User from '@/pages/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/homepage',
      component: Homepage
    },{
      path: '/category',
      component: Category
    },{
      path: '/article',
      component: Article
    },{
      path: '/user',
      component: User
    }
  ]
})
