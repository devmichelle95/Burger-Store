import * as yup from "yup"
import Category from "../models/Categories.js"
import User from "../models/User.js"
import Categories from "../models/Categories.js"

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

        const{admin: isAdmin}  = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json({message: "You aren't authorized to this access"})
            
        }

        const {name}  = request.body
        
        const {filename: path} = request.file
      

        const categoryExisting = await Category.findOne ({
            where: {name,},
        })

        if(categoryExisting) {
            return response.status(400).json({message: "Category already exists"})
        }
        
        const {id}= await Category.create ({
           name,
           path
        })

        console.log(request)

        return response.json({name})
    }

    async index (request,response) {
        const category = await Category.findAll()
        return response.json(category)
    }

    async update (request,response) {
        const schema = yup.object().shape({
            name: yup.string(),
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
        const {name }= request.body
        //const {id} = request.params
        
        const updateCategory = await Categories.findByPk(id)

        if(!updateCategory){
            return response.status(401).json({message:"This category dosen't exist"})
        }

        let path
        if(request.file){
            path = request.file.filename
        }

        
      await Category.update ({name,path},{where:{id}})

        return response.status(200).json()
    }

}

export default new CategoryController