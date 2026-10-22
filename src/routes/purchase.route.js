import express from 'express'

import { Roles } from '../middlewares/permission.midleware.js'
import { create, getAll, getOne } from '../controllers/purchase.controller.js'
const router = express.Router()

router.post('/', Roles("manager"),create)
router.get('/', Roles("manager"),getAll)
router.get('/:id',Roles("manager"), getOne)
// router.put('/:id',Roles("manager"), update)
// router.delete('/:id',Roles("manager"), remove)


export default router