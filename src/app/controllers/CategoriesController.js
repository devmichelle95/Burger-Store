import { response } from "express"
import * as yup from "yup"
import Category from "../models/Categories"
import { where } from "sequelize"

class CategoryController {
    async store (request,response) {
        const schema = yup.object().shape({
            name: yup.string().required(),
        })
        
        try{
            await schema.validateSync(request.body, {abortEarly:false})}
            catch(err){
                return response.status(400).json({error: err.errors})
        }
        const {name}  = request.body

        const categoryExisting = await Category.findOne ({
            where: {name,},
        })

        if(categoryExisting) {
            return response.status(400).json({message: "Category already exists"})
        }
        
        const {id}= await Category.create ({
           name
        })

        console.log(request)

        return response.json({name})
    }

    async index (request,response) {
        const category = await Category.findAll()
        return response.json(category)
    }

}

export default new CategoryController