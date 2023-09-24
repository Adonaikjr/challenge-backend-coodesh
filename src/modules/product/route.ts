import { Router } from 'express'
import ProductController from './controller'

const router = Router()

router.post('/import', ProductController.createStream)
router.get('/', ProductController.findAll)
router.get('/:code', ProductController.findOne)
router.put('/:code', ProductController.updateProduct)
router.delete('/:code', ProductController.updateProductTrash)

export default router
