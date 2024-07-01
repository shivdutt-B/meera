const productModel = require('../Models/Product')
exports.showAll = async (req, res) => {
    const products = await productModel.productModel.find()
    // console.log(products.length)
    res.json({ 'products': products })
}
exports.bySearch = async (req, res) => {
    // console.log('code 33', req.body.category)
    const products = await productModel.productModel.find({ 'category': { $in: req.body.category } })
    // find({ name: 'john', age: { $gte: 18 } }).exec()
    res.json({ 'products': products })
    // find({'userID': {$in:array}});
}
exports.addProduct = async (req, res) => {
    const data = req.body
    const product = await productModel.productModel(data)
    // console.log('products',product)
    await product.save()
    res.status(200).json("product added")
}
exports.searchProducts = async (req, res) => {
    try {
        const query = req.body.query
        // const results = await productModel.productModel.title = { $regex: query, $options: "i"};
        const regex = new RegExp(query, 'i'); // 'i' for case-insensitive
        const results = await productModel.productModel.find({
            $or: [
                { title: regex },
                { description: regex },
                { category: regex }
            ]
        });
        res.status(200).json({ searchResults: results })
        // console.log('code 0', results.length);
    } catch (err) {
        console.error(err);
    }
};

