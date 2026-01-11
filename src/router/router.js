import { createRouter, createWebHistory } from 'vue-router'

import Editor from '@/components/editor/Edtor.vue'
import ReaderPage from "@/view/ReadPage/ReaderPage.vue";
import Home from "@/view/home/Home.vue"
import UserCenter from "@/view/userCenter/UserCenter.vue";
import UserStar from "@/view/userStar/UserStar.vue";
import UserAttention from "@/view/userAttention/UserAttention.vue";
import UserBlogs from "@/view/userBlogs/UserBlogs.vue";
import Search from "@/view/Search/Search.vue";

const routes = [
    {
        path:'/editor',
        name:'Editor',
        component:Editor,
    },
    {
        path:'/reader',
        name:'Reader',
        component:ReaderPage,
    },{
        path:'/userStar',
        name:'userStar',
        component:UserStar,
    },
    {
        path:'/',
        redirect:'/home',
    },
    {
        path:'/home',
        name:'Home',
        component:Home,
    },{
        path:'/userCenter',
        name:'UserCenter',
        component:UserCenter,
        children: [
            {
                path:'userStar',
                name:'UserStar',
                component:UserStar,
            },{
                path:'userAttention',
                name:'UserAttention',
                component:UserAttention,
            },{
                path:'userBlogs',
                name:'UserBlogs',
                component:UserBlogs,
            }
        ]
    },
    {
        path: '/searchPage',
        name:'SearchPage',
        component: Search,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
