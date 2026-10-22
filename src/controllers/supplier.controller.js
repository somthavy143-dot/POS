import Product from "../models/Product.js"
import Purchase from "../models/Purchase.js"
import Supplier from "../models/Supplier.js"
export const create = async (req, res, next) => {
    try {
        const result = await Supplier.create(req.body)
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}
export const getAll = async (req, res, next) => {
    try {
        // const { page, limit, search } = req.query
        const page = req.query.page || 1
        const limit = req.query.limit || 3
        const skip = (page - 1) * limit
        const searchQuery = {}
        if (req.query.search) {
            searchQuery['$or'] = [
                {
                    name: { $regex: req.query.search, $options: 'i' }
                },
                {
                    phone: { $regex: req.query.search, $options: "i" }
                }
            ]
        }
        const result = await Supplier.find(searchQuery)
            .limit(limit)
            .skip(skip).sort({ createdAt: -1 })
        const totalRecord = await Supplier.countDocuments()

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
        const result = await Supplier.findById(req.params.id)
        if (!result) return res.status(404).json({ success: false, error: "Supplier not found!" })
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
        const result = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!result) return res.status(404).json({ success: false, error: "Supplier not found!" })
        res.status(200).json({
            success: true,
            result: result
        })
    } catch (error) {
        next(error)
    }
}
export const remove = async (req, res, next) => {
    try {
        const result = await Supplier.findByIdAndDelete(req.params.id)
        if (!result) return res.status(404).json({ success: false, error: "Supplier not found!" })
        res.status(201).json({
            success: true,
            result: []
        })
    } catch (error) {
        next(error)
    }
}

export const updatePurchaseStatus = async (req ,res,next)=>{
    try{
        const id = req.params.id
        const {purchaseStatus} = req.body
        //find purchase
        const result = await Purchase.findById(id)
        if (!result) return res.status(404).json({success:false,error:"Purchase record not found"})

        if (result.purchaseStatus == "received") {
            return res.status(400).json({
                success:false,
                error: "Purchase status is ready received"
            })
        }
        //purchase Status == "received"
        
       if (purchaseStatus == "received"){
        for(const item of result.items){
            const product = await Product.findById(item.product)
            product.currentStock = (product.currentStock || 0) + item.quantity
            await product.save()
        }
       }
       const newDoc = await Purchase.findByIdAndUpdate(id,{purchaseStatus})
       res.status(200).json({
        success: true,
        result: newDoc
       })

    }catch (error) {
        next (error)
    }
}
