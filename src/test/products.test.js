import chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
// import { validatePassword } from '../utils.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe.only("Testing PRODUCTS routes.", () => {
    it("GET petition should not get products without logging in", async  () => {
        const products = await requester.get("/api/products");
        expect(products.status).to.equal(401);
        expect(products.error.text).to.include("You do not have permissions to perform this action");
        expect(products.ok).to.equal(false);
    });

    it.only("GET petition while logged in should get product by ID.", async() => {
        const credentials = {
            email: "premium6@gmail.com",
            password: "asd123"
        }
        const login = await requester.post("/sessions/login").send(credentials)
        expect(login.status).to.equal(200)
        expect(login.ok).to.equal(true)
        console.log("login", login);
        const products = await requester.get("/api/products")
        // console.log(products);
    })
});
