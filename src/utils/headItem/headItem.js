export const RequestHeadItems = {
    // 真实IP
    X_REAL_IP: "X-Real-IP",
    // 用户ID
    X_USER_ID: "X-User-Id",
    // 用户令牌
    X_TOKEN: "X-Token",
    // 用户权限
    X_USER_PERMISSION: "X-User-Permission",
    // 用户角色
    X_USER_ROLE: "X-User-Role",
    // 用户名
    X_USER_NAME: "X-User-Name",
    // 是否已认证
    X_AUTHENTICATED: "X-Authenticated",
    // 转发IP
    X_FORWARDED_FOR: "X-Forwarded-For",
    // 用户代理
    X_USER_AGENT: "X-User-Agent",
    // 数据来源
    X_SOURCE: "X-Source",
    // 数据来源向量
    X_SOURCE_IV: "X-Source-IV",
    // 验证令牌
    X_VERIFY_TOKEN: "X-Verify-Token"
};

// 按需导出（可选，方便单个导入）
export const {
    X_REAL_IP,
    X_USER_ID,
    X_TOKEN,
    X_USER_PERMISSION,
    X_USER_ROLE,
    X_USER_NAME,
    X_AUTHENTICATED,
    X_FORWARDED_FOR,
    X_USER_AGENT,
    X_SOURCE,
    X_SOURCE_IV,
    X_VERIFY_TOKEN
} = RequestHeadItems;