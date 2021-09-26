const express = require('express')

const ItemController = require('../controllers/item-controller')

const router = express.Router()

router.post('/item', ItemController.createItem)
router.put('/item/:id', ItemController.updateItem)
router.delete('/item/:id', ItemController.deleteItem)
router.get('/item/:id', ItemController.getItemById)
router.get('/items', ItemController.getItems)

module.exports = router