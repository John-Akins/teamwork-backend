import responseUtility from "../utilities/responseUtility"
import { validationResult } from "express-validator"

const validateRequest = (req, res, next) => {
    const errors = validationResult(req)
    if ( !errors.isEmpty() ) {
        return responseUtility.error(res, 422, errors.array())
    }
    next()
}

export default validateRequest