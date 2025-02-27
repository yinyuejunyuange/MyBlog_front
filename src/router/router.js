import { createRouter, createWebHistory } from 'vue-router'

import Editor from '@/components/editor/Edtor.vue'
import ReaderPage from "@/components/ReadPage/ReaderPage.vue";
import Home from "@/components/home/Home.vue"

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
    },
    {
        path:'/home',
        name:'Home',
        component:Home,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
