import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
// import { validatePassword } from '../utils.js';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe.only("Testing PRODUCTS routes.", () => {
    it("GET petition should not get products without logging in", async () => {
        const products = await requester.get("/api/products");
        expect(products.status).to.equal(401);
        expect(products.error.text).to.include(
            "You do not have permissions to perform this action"
        );
        expect(products.ok).to.equal(false);
    });

    it("GET petition while logged in should get product by ID.", async () => {
        const credentials = {
            email: "premium10@gmail.com",
            password: "asd123",
        };
        const login = await requester.post("/sessions/login").send(credentials);
        // console.log("login", login.header);
        expect(login.status).to.equal(200);
        expect(login.ok).to.equal(true);
        expect(login.body).to.include({ status: "success" });
        const products = await requester
            .get("/api/products")
            .set(
                "Cookie",
                "connect.sid=s%3AIhtpKSnjttKMKY9qrtypsWWIMY_-TjLw.JDmC9%2FrG7HW0CROMcUaxw5TWVy4Qt660If3FOkfP9P4; Path=/; HttpOnly"
            );

        expect(products.text).to.not.be.empty;
        // expect(products.text).to.be.a(String)
        console.log(products.body);
    });

    it.only("POST petition should allow to create product only with cookie session.", async () => {
    const product = {
            title: "alguna marca random",
            description: " soy un producto premium 4",
            price: 0.5,
            code: "lrm",
            stock: 100,
            category: "premium",
            owner: "premium10@gmail.com",
        };
        
        const postedProduct = await requester.post('/api/products').send(product).set(
            "Cookie",
            "connect.sid=s%3AIhtpKSnjttKMKY9qrtypsWWIMY_-TjLw.JDmC9%2FrG7HW0CROMcUaxw5TWVy4Qt660If3FOkfP9P4; Path=/; HttpOnly"
        );
        // console.log(postedProduct);
        expect(postedProduct.status).to.equal(200);
        expect(postedProduct.body?.addedProduct).to.be.an("object")
        const secondProduct = await requester.post('/api/products').send(product)
        expect(secondProduct.status).to.equal(500);
    });
});
