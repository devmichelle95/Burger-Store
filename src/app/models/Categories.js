import Sequelize, { Model } from "sequelize";

class Categories extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING, 
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `https://api-burger-store-production.up.railway.app/category-file/${this.path}`
                    },
            },
        },
                {
                sequelize
            }
        )
        return this
    }
}

export default Categories