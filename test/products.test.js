import mongoose from "mongoose";
import assert from "assert";
import Products from "../src/daos/manager/dbMongo/products.mongo.js"

mongoose.connect("mongodb+srv://javiermammana:test@coderhouse.vv0r5fa.mongodb.net/test?retryWrites=true&w=majority")

describe("Test DAO de Products", function() {

    before(function() {
        this.productsDao = new Products();
    })

    beforeEach(async function() {
        await mongoose.connection.collections.products.drop()
    })

    it("El GET de productos me retorna un array", async function () {
        const resultado = await this.productsDao.getAllProducts();
        assert.strictEqual(Array.isArray(resultado), true);
    })

    //test 01:
    it("El DAO Debe poder agregar un producto a la base", async function() {
        let product = {
            title: "Producto de TEST",
            description: "Este producto fue cargado desde TEST",
            price: 2,
            code: "TEST001",
            stock: 1,
            category: "TEST"
        }

        const resultado = await this.productsDao.createProduct(product);
        assert.ok(resultado._id);
    })

    //test 02:
    it("Validamos que el producto tenga un array de notify vacio", async function() {
        let product = {
            title: "Producto de TEST",
            description: "Este producto fue cargado desde TEST",
            price: 2,
            code: "TEST001",
            stock: 1,
            category: "TEST"
        }
        const resultado = await this.productsDao.createProduct(product);
        assert.deepStrictEqual(resultado.notify, []);
    })

    //test03:
    it("El DAO puede obtener un usuario por el CODE", async function () {
        let product = {
            title: "Producto de TEST",
            description: "Este producto fue cargado desde TEST",
            price: 2,
            code: "TEST001",
            stock: 1,
            category: "TEST"
        }
        await this.productsDao.createProduct(product);
        const prodCODE = await this.productsDao.getProductByCode({code: product.code});
        assert.strictEqual(typeof prodCODE, "object");
    })


    after(async function() {
        await mongoose.disconnect();
    })
})



