import express from 'express'
import {Roles} from '../middlewares/permission.midleware.js'
import { generateReport, reportSale30days, saleReport, stockReport } from '../controllers/report.controller.js'
const router = express.Router()

router.get('/general',Roles("manager"),generateReport);
router.get('/salereport',Roles("manager"),saleReport);
router.get('/stock-report',Roles("manager"),stockReport)
router.get('/reportSale30days',Roles("manager"),reportSale30days)


export default router