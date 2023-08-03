import { response } from "express"
import * as yup from "yup"
import Product from "../models/Product"
import Categories from "../models/Categories"

class ProductsController {
    async store (request,response) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            price: yup.number().required(),
            category_id: yup.number().required(),
        })
        
        try{
            await schema.validateSync(request.body, {abortEarly:false})}
            catch(err){
                return response.status(400).json({error: err.errors})
        }

        const {filename: path} = request.file
        const {name, price, category_id}  = request.body
        
        const product = await Product.create ({
            name,
            price,
            category_id,
            path,
        })

        console.log(request)

        return response.json({product})
    }

    async index (request,response) {
        const products = await Product.findAll({
            include:[{
                model: Categories,
                as: 'category',
                attributes: ['id','name']
            }]
        })
        return response.json(products)
    }

}

export default new ProductsController