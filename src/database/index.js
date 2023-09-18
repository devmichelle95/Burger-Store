import Sequelize from "sequelize";
import mongoose from "mongoose";
import configDatabase from '../config/database'
import User from "../app/models/User";
import Product from "../app/models/Product";
import Categories from "../app/models/Categories";

const models = [User, Product, Categories]

class Database {
    constructor() {
        this.init()
        this.mongo()
    }
    init() {
        this.connection = new Sequelize('postgresql://postgres:RUZEym0YpgCJdO9OuQRg@containers-us-west-47.railway.app:7325/railway')
        models
        .map(model => model.init(this.connection))
        .map(
            (model) => model.associate && model.associate(this.connection.models)
        )
    }
    mongo() {
        this.mongoConnection = mongoose.connect('mongodb://mongo:rHm8OG1INJuZ9DIIANFJ@containers-us-west-94.railway.app:6525',{
            useNewUrlParser: true,
            useUnifiedTopology:true
        })
    }
}

export default new Database()