import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _714bb7de = () => import('..\\pages\\index.vue' /* webpackChunkName: "pages\\index" */).then(m => m.default || m)
const _9c08a95e = () => import('..\\pages\\index\\index.vue' /* webpackChunkName: "pages\\index\\index" */).then(m => m.default || m)
const _3723640e = () => import('..\\pages\\index\\_id.vue' /* webpackChunkName: "pages\\index\\_id" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/",
			component: _714bb7de,
			children: [
				{
					path: "",
					component: _9c08a95e,
					name: "index"
				},
				{
					path: ":id",
					component: _3723640e,
					name: "index-id"
				}
			]
		}
    ],
    fallback: false
  })
}
