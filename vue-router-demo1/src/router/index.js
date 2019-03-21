import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
	mode:"history",
  routes: [
    {
			// 我的班课
      path: '/',
      name: 'Index',
      component:resolve => require(['../components/Index.vue'],resolve)
    },
		{
			// 任务中心
			path:'/task',
			name:'Task',
			component:resolve => require(['../components/Task.vue'],resolve)
		},
		{
			//库管理
			path:'/lib',
			name:'Lib',
			component:resolve => require(['../components/Lib.vue'],resolve)
		},
		{
			// 个人中心
			path:'/ucenter',
			name:'UCenter',
			component:resolve => require(['../components/UCenter.vue'],resolve)
		},
		{
			path:'/new_course',
			name:'NewCourse',
				component:resolve => require(['../components/NewCourse.vue'],resolve)
		}
		
  ]
})
