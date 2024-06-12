const productModel = require('../Models/Product')
exports.showAll = async (req, res) => {
    const products = await productModel.productModel.find()
    console.log(products.length)
    res.json({'products':products})
}
exports.bySearch = async (req, res) => {
    console.log(req.body.category)
    const products = await productModel.productModel.find({'category': {$in:req.body.category}})
    // find({ name: 'john', age: { $gte: 18 } }).exec()
    res.json({'products': products})
    // find({'userID': {$in:array}});
}
exports.addProduct = async (req, res) => {
    const data = req.body
    const product = await productModel.productModel(data)
    // console.log('products',product)
    await product.save()
    res.status(200).json("product added")
}