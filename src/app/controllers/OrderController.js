import * as yup from "yup";
import Product from "./../models/Product.js"
import Categories from "./../models/Categories.js"
import Orders from "./../schemas/Orders.js"
import User from "./../models/User.js"

class OrderController {
    async store(request, response) {
        const schema = yup.object().shape({
            products: yup.array()
                .required()
                .of(
                    yup.object().shape({
                        id: yup.number().required(),
                        quantity: yup.number().required(),
                    })
                ),
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
        }
        catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const productsId = request.body.products.map(product => product.id)

        const updatedProduct = await Product.findAll({
            where: { id: productsId },
            include: [
                {
                    model: Categories,
                    as: 'category',
                    attributes: ['name']
                },
            ],
        })

        const editedProduct = updatedProduct.map((product) => {
            const productIndex = request.body.products.findIndex(
                (requestProduct) => requestProduct.id === product.id)

            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                url: product.url,
                quantity: request.body.products[productIndex].quantity,
            }

            return newProduct
        })

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: editedProduct,
            status: 'Orders Placed',
        }

        const orderResponse = await Orders.create(order)

        return response.status(201).json(orderResponse)
    }

    async index(request, response) {
        const orders = await Orders.find()
        return response.json(orders)
    }

    async update(request, response) {
        const schema = yup.object().shape({
            status: yup.string().required(),
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
        }
        catch (err) {
            return response.status(400).json({ error: err.errors })
        }
        const{admin: isAdmin}  = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json({message: "You aren't authorized to this access"})
            
        }


        const { id } = request.params
        const { status } = request.body

        try {
            await Orders.updateOne({
                _id: id
            },
                { status })
            return response.json({ message: "Status updated successfully" })
        }
        catch (err) {
            return response.status(400).json({ error: err.message })
        }


    }
}

export default new OrderController