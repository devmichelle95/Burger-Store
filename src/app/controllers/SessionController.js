import * as yup from "yup";
import User from "../models/User";
import jwt from "jsonwebtoken";
import autoConfig from "../../config/auth"

class SessionController{
    async store(request, response) {
        const schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().required(),
        })
        if (!(await schema.isValid(request.body))) {
            return response.status(401).json({ error: "Your e-mail or password are incorrect" })
        }

        const { email, password } = request.body

        const user = await User.findOne({
            where: { email },
        })

        if (!user) {
            return response.status(401).json({ error: "Your e-mail or password are incorrect" })
        }

        await user.checkPassword(password)

        if (!await user.checkPassword(password)) {
            return response.status(401).json({ error: "Your e-mail or password are incorrect" })
        }

        return response.json({
            id: user.id,
            email,
            name: user.name,
            admin: user.admin,
            token: jwt.sign({ id: user.id, name: user.name },
                autoConfig.secret, {
                expiresIn: autoConfig.expiresIn,
            })
        })
    }
}
export default new SessionController