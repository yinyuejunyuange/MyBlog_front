import request from "@/utils/request.js";


export const uploadFile = async () => {
    return await request.get('/blog/read',{
        params:{
            id: blogId,
        }
    })
}

export const mergeFile = async (blogId) => {
    return await request.get('/blog/getComments',{
        params:{
            blogId:blogId,
        }
    })
}