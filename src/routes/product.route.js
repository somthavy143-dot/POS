import express from 'express'
import { create, getAll, getOne, remove, update } from '../controllers/product.controller.js'
import { Roles } from '../middlewares/permission.midleware.js'
const router=express.Router()
router.post('/',Roles("manager"),create)
router.get('/',Roles ("manager","cashier"),getAll)
router.get('/:id',Roles ("manager","cashier"),getOne)
router.put('/:id',update)
router.delete('/:id',remove)
export default router