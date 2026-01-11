import request from "@/utils/request.js";

export const getUserInfo = async (userId) => {
    return await request.get('/user/getBlogUserInfo',{
        params:{
            userId: userId,
        }
    })
}