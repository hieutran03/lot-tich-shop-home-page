const {Product} = require('../models/product')
const {Category} = require('../models/category')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
    //Filter and get products by category
    //localhost:3000/api/v1/products?categories=id1,id2,id3
    let filter = {};
    if (req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }

    const productList = await Product.find(filter).select('-_id -__v');

    if (!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
})

router.get('/:id', async(req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid Product ID')
    }

    const product = await Product.findById(req.params.id).populate('category');

    if (!product){
        res.status(500).json({success: false})
    }
    res.send(product);
})

router.post('/', async(req, res) => {
    if (!mongoose.isValidObjectId(req.body.category)){
        return res.status(400).send('Invalid Category ID')
    }

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        dateCreated: req.body.dateCreated
    })
    product = await product.save();

    if (!product){
        return res.status(500).send('The product cannot be created!')
    }

    res.send(product)
})

router.put('/:id', async(req, res) => {
    
    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.body.category)){
        return res.status(400).send('Invalid Product ID / Category ID')
    }

    const category = await Category.findById(req.body.category);

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            dateCreated: req.body.dateCreated
        },
        { new: true}
    )
    if (!product){
        res.status(500).json({message: 'Cannot update product!'});
    }
    
    res.status(200).send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product){
            return res.status(200).json({success: true, message: 'The product is deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'The product not found!. Check ID again!'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

router.get('/get/count', async(req, res) =>{
    const productCount = await Product.countDocuments({}, { hint: "_id_" });

    if (!productCount){
        res.status(500).json({success: false})
    }

    res.send({
        productCount: productCount
    })
})

module.exports = router;