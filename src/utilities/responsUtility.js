const responsUtility = {}
responseUtility.success = (res, data) => {
    return res.status(200).json({
        status: "success",
        data: data
    });
}
responseUtility.error = (res, code, msg) => {
    return res.status(code).json({
        status: "error",
        error: msg
    });
}
export default responsUtility