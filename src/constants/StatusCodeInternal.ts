const statusCodes = [
    { statusCodes: 200, message: "Success" },
    { statusCodes: 201, message: "Created" },
    { statusCodes: 400, message: "Bad Request" },
    { statusCodes: 401, message: "Unauthorized" },
    { statusCodes: 403, message: "Forbidden" },
    { statusCodes: 404, message: "Not Found" },
    { statusCodes: 500, message: "Internal Server Error" },
    { statusCodes: 1000, message: "Error Already Exists" },
    { statusCodes: 1001, message: "Error Not Exists" },
    { statusCodes: 1002, message: "Thông tin đăng nhập không chính xác!" },
    { statusCodes: 1003, message: "Thông tin đăng nhập không chính xác!" },
    { statusCodes: 1004, message: "Role Id Wrong" },
    { statusCodes: 1005, message: "Store Id Wrong" },
    { statusCodes: 1006, message: "Thông tin đăng nhập không chính xác!" },
    { statusCodes: 1007, message: "Refresh token Wrong" },
    { statusCodes: 1008, message: "Thông tin đăng nhập không chính xác!" }
];
const error500 = 'Có lỗi xảy ra, vui lòng thử lại sau';
export {statusCodes, error500};