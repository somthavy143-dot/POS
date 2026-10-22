import express from 'express'
import { getAll,getOne,remove,update } from '../controllers/user.controller.js'
import router from './auth.route.js'

router.get ('/',getAll)
router.get('/:id',getOne)
router.put('/:id',update)
router.delete('/:id',remove)

export default router