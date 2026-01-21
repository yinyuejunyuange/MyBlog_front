import request from "@/utils/request.js";

/**
 * 阅读博客
 * @param blogId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const readBlog = async (blogId) => {
    return await request.get('/blog/read',{
        params:{
            id: blogId,
        }
    })
}
/**
 * 获取博客评论
 * @param blogId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getBlogComments = async (blogId) => {
    return await request.get('/blog/getComments',{
        params:{
            blogId:blogId,
        }
    })
}

/**
 * 首页博客信息
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const homeBlogs = async () => {
    return await request.get('/blog/homeBlogs')
}

/**
 * 根据作者ID 查询博客信息
 * @param userId
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getBlogBySelectUserId = async (userId) => {
    return await request.get('/blog/getBlogBySelect',{
        params:{
            userId: userId
        }
    })
}

/**
 * 根据类别查询博客信息
 * @param typeList
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getBlogBySelectTypeList = async (typeList) => {
    return await request.get('/blog/getBlogBySelect',{
        params:{
            typeList: typeList
        }
    })
}

export const testUploadFile = async (data) => {
    return await request.post('/blog/testUploadFile',data,{
        headers: {
            'Content-Type': 'multipart/form-data' // 显式指定，确保后端能解析
        }
    })
}

export const testMergeFile = async (data) => {
    return await request.post('/blog/testMergeFile',data)
}