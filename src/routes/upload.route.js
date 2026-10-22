import express from 'express'
import { upload } from '../middlewares/upload.middleware.js'
import { removeImage, uploadFile } from '../controllers/upload.controller.js'
import { Roles } from '../middlewares/permission.midleware.js'

const router = express.Router()

router.post('/', upload.single("image"),Roles("manager"), uploadFile)
router.delete('/:fileName', Roles("manager"),removeImage)

export default router