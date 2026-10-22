import User from "../models/User.js"

export const getAll = async (req, res, next) => {
    try {
        // const { page, limit, search } = req.query
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit
        const searchQuery = {}
        if (req.query.search) {
            searchQuery['$or'] = [
                {
                    nausername: { $regex: req.query.search, $options: 'i' }
                },
                {
                    email: { $regex: req.query.search, $options: 'i' }
                }
            ]
        }
        const result = await User.find({
            ...searchQuery,email: {$ne: req.user.email}
        })
            .limit(limit)
            .skip(skip).sort({ createdAt: -1 }).select('-password')

        const totalRecord = await User.find ({
            ...searchQuery,
            email: {$ne: req.user.email}
         }).countDocuments()

        res.status(200).json({
            success: true,
            result: result,

            totalPage: Math.ceil(totalRecord / limit)
        })
    } catch (error) {
        next(error)
    }
}

export const getOne = async (req, res, next) => {
    try {
        const result = await User.findById(req.params.id)
        if (!result) return res.status(404).json({ success: false, error: "User not found!" })
        res.status(200).json({
            success: true,
            result: result
        })
    } catch (error) {
        next(error)
    }
}
export const update = async (req, res, next) => {
    try {
        const result = await User.findByIdAndUpdate(req.params.id,req.body,{new:true})
         if (!result) return res.status(404).json({ success: false, error: "User not found!" })
        res.status(200).json({
            success: true,
            result:result
        })
    } catch (error) {
        next(error)
    }
}
export const remove = async (req, res, next) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id)
        if (!result) return res.status(404).json({ success: false, error: "User not found!" })
        res.status(201).json({
            success: true,
            result: []
        })
    } catch (error) {
        next(error)
    }
}
