import ApiError from "../utils/apiError.js"

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if(!result.success) {
        const errors = result.error.errors.map(e => e.message)
        return next(new ApiError(400, errors[0], errors))
    }

    req.body = result.data
    next()
}

export default validate