'use strict'

const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/product.controllers')
const { authentication } = require('../../auth/authUtils')
const { asyncHandler } = require('../../helpers/asyncHandler')

router.use(authentication)
router.post('/', asyncHandler(ProductController.createProduct))

module.exports = router