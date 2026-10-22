import express from 'express'
import { create, getAll, getOne, remove, update } from '../controllers/category.controller.js'
import { Roles } from '../middlewares/permission.midleware.js'
const router = express.Router()

router.post('/', Roles("manager"),create)
router.get('/', Roles("manager"),getAll)
router.get('/:id',Roles("manager"), getOne)
router.put('/:id',Roles("manager"), update)
router.delete('/:id',Roles("manager"), remove)


export default router