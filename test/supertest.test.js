import supertest from "supertest";

import { expect } from "chai";

const requester = new supertest("http://localhost:8080");

describe("Tersting de WEB Tienda", () => {

    describe("Testing de productos: ", () => {

        it("EndPoint POST /api/products debe crear un producto y revisar que cuente con el campo _id que se asigna mongo", async () => {

            const product = {
                title: "Producto de TEST",
                description: "Este producto fue cargado desde TEST",
                price: 2,
                code: "PRODUCTTEST",
                stock: 1,
                category: "TEST"
            }

            const { _body } = await requester.post("/api/products").send(product);

            expect(_body).to.have.property("_id");
        })


        it ("Si se quiere crear un producto incompleto (Ej: sin TITLE), se debe responder status 400", async () => {

            const productSinTitle = {
                // title: "Producto de TEST control de STATUS",
                description: "Este producto fue cargado desde TEST",
                price: 2,
                code: "TESTError001",
                stock: 1,
                category: "TEST"
            }

            const { statusCode } = await requester.post("/api/products").send(productSinTitle);

            expect(statusCode).to.equal(400)
        })


        it("Al obtener productos, deben tener el metodo status y payload y payload debe ser un array", async () => {

            const { statusCode, _body } = await requester.get("/api/products");

            expect(statusCode).to.equal(200);
            expect(_body.products.docs).that.is.an("array")
        })


        it ("El metodo PUT actualiza un producto", async () => {

            const idProduct = "66a98710313a11e3cf986dbe";

            const productUpload = {
                title: "Producto de TEST Modificado",
                description: "Este producto fue cargado desde TEST",
                price: 45,
                stock: 758,
                category: "TEST"
            }


            const { statusCode } = await requester.put(`/api/products/${idProduct}`).send(productUpload)

            expect(statusCode).to.equal(200);
        })
    })

    describe("Testing de Carritos: ", () => {

        it ("Revisar que el carrito exista y que el campo products sea un Array", async () => {

            const idCarrito = "6671d714c5a1e3ca88e854de";

            const { statusCode, _body } = await requester.get(`/api/carts/${idCarrito}`);

            expect(statusCode).to.equal(200);

            expect(_body.products).that.is.an("array")
        })


        it ("confirmar redireccion (status 302), luego de agregar un producto al carrito", async () => {
            
            const idCarrito = "6671d714c5a1e3ca88e854de";
            const idProducto = "66509254edcb5ddf142d2f84";

            const { statusCode } = await requester.post(`/api/carts/${idCarrito}/product/${idProducto}`);

            expect(statusCode).to.equal(302);
        })


        it ("Al vaciar el carrito, el array de products, debe quedar vacio", async () => {

            const idCarrito = "6671d714c5a1e3ca88e854de";

            const{ _body } = await requester.delete(`/api/carts/${idCarrito}`);

            expect(_body.products).to.deep.equal([])
        })
    })

    describe("Testing de SESSION: ", () => {

        let cookie;

        it("registro de usuario", async () => {

            const mockUser = {
                first_name: "usuario",
                last_name: "Test",
                password: "1234",
                repassword: "1234",
                age: 35,
                email: "usuario@test.com"
            }

            const {body} = await requester.post("/api/users/register").send(mockUser);

            expect(body).to.be.ok;

        })

        it("loguin de usuario y recupero de cookie", async () => {

            const mockUser = {
                email: "usuario@test.com",
                password: "1234"
            }

            const resultado = await requester.post("/api/sessions/login").send(mockUser);

            const cookieResultado = resultado.headers["set-cookie"][0];

            expect(cookieResultado).to.be.ok;

            cookie = {
                name: cookieResultado.split("=")[0],
                value: cookieResultado.split("=")[1]
            }

            expect(cookie.name).to.be.ok.and.equal("coderCookieToken");
            expect(cookie.value).to.be.ok;

        })

        // it ("enviamos cookie del usuario", async () => {

        //     const { _body } = await requester.get("/profile").set("coderCookieToken", [`${cookie.name}=${cookie.value}`]);

        //     expect(_body.payload.email).to.be.equal("user@algo.com")
        // })

    })
})








