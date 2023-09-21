import { response } from "express"
import * as yup from "yup"
import Product from "../models/Product.js"
import User from "./../models/User.js"
import Categories from "../models/Categories.js"

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

        const{admin: isAdmin}  = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json({message: "You aren't authorized to this access"})
            
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

    async update (request,response) {
        const schema = yup.object().shape({
            name: yup.string(),
            price: yup.number(),
            offer:yup.boolean(),
            category_id: yup.number(),
        })
        
        try{
            await schema.validateSync(request.body, {abortEarly:false})}
            catch(err){
                return response.status(400).json({error: err.errors})
        }

        const{admin: isAdmin}  = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json({message: "You aren't authorized to this access"})
            
        }

        const {id} = request.params
        
        const updateProduct = await Product.findByPk(id)

        if(!updateProduct){
            return response.status(401).json({message:"This product dosen't exist"})
        }

        let path
        if(request.file){
            path = request.file.filename
        }

        const {name, price, offer, category_id}  = request.body
        
      await Product.update ({
            name,
            price,
            offer,
            category_id,
            path,
        },
        {where:{id}}
        )

        console.log(request)

        return response.status(200).json()
    }
}

export default new ProductsController