import { createRouter, createWebHistory } from 'vue-router'

import Editor from '@/components/editor/Edtor.vue'
import ReaderPage from "@/components/ReadPage/ReaderPage.vue";
import Home from "@/components/home/Home.vue"
import UserCenter from "@/components/userCenter/UserCenter.vue";
import UserStar from "@/components/userStar/UserStar.vue";
import UserAttention from "@/components/userAttention/UserAttention.vue";
import UserBlogs from "@/components/userBlogs/UserBlogs.vue";
import Search from "@/components/Search/Search.vue";

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
