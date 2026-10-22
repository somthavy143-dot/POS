import { calculatePaymentStatus } from "../helpers/calculatePaymentStatus.js"
import Product from "../models/Product.js"
import Purchase from "../models/Purchase.js"


export const create = async (req, res, next)=> {
    try{
          const {totalCost,items,purchaseStatus } = req.body

          const paymentStatus = calculatePaymentStatus(totalCost,0)
          // auto upadate stock product if purchaseStaus == "received"
            if (purchaseStatus == 'received'){
                for (const item of items){
                    const product = await Product.findById(item.product)
                    product.currentStock = (product.currentStock || 0) + item.quantity
                    await product.save()
                }
            }

            // insert data

        const result = await Purchase.create({
            ...req.body,
            user: req.user._id,
            items,
            dueAmount: totalCost,
            paymentStatus,
            purchaseStatus
        })
        res.status(201).json({
            success: true,
            result :result
        })
    }catch (error) {
        next (error)
    }
}

export const getAll = async (req, res, next) => {
    try {
        // const { page, limit, search } = req.query
        const page = req.query.page || 1
        const limit = req.query.limit || 1
        const skip = (page - 1) * limit
        const searchQuery = {}
        if (req.query.search) {
            searchQuery['$or'] = [
                {
                    invoiceNumber: { $regex: req.query.search, $options: 'i' }
                }
            ]
        }
        const result = await Purchase.find(searchQuery)
                .populate("user","username role")
                .populate("supplier","name phone")
                .populate({
                    path: "items",
                    populate:{
                        path: "product",
                        select: "name image_url"
                    }
                })


            .limit(limit)
            .skip(skip).sort({ createdAt: -1 })
        const totalRecord = await Purchase.countDocuments()

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
        const result = await Purchase.findById(req.params.id)
                .populate("user","username role")
                .populate("supplier","name phone")
                .populate({
                    path: "items",
                    populate:{
                        path: "product",
                        select: "name image_url"
                    }
    })

        if (!result) return res.status(404).json({ success: false, error: "Purchase not found!" })
        res.status(200).json({
            success: true,
            result: result
        })
    } catch (error) {
        next(error)
    }
}