import * as yup from "yup";
import Product from "./../models/Product"
import Categories from "./../models/Categories"
import Orders from "./../schemas/Orders"

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
                }
            ]
        })

        const editedProducts = updatedProduct.map(product => {
            const productIndex = request.body.products.findIndex(
                (requestProduct) => requestProduct.id === product.id)
            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                URL: product.url,
                quantity: request.body.products[productIndex].quantity,
            }
            
            return newProduct
        })
        
        const order = {
            user:
            {
                id: request.userId,
                name: request.userName
            },
            product: editedProducts,
            status: "Pedido realizado"
        }

        const orderResponse = await Orders.create(order)

        return response.status(201).json(orderResponse)
    }
}

export default new OrderController