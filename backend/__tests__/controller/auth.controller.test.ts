import supertest from "supertest";
import app from "../../src/app";

describe('authenticate test',()=>{

    test('signup test',async ()=>{
        let res = supertest(app).post('/auth/signup')
        .send({
            name:"vaibhav",
            email:"vk@gmail.com",
            password:"Vks@1234"
        })
        expect((await res).status).toBe(201)
        expect((await res).body).toHaveProperty('token')
        expect((await res).body.data).toHaveProperty('id')
    })

    test('signin successful',async ()=>{
        let res = supertest(app).post('/auth/signup')
        .send({
            email:"vk@gmail.com",
            password:"Vks@1234"
        })
        expect((await res).status).toBe(200)
        expect((await res).body).toHaveProperty('token')
        expect((await res).body.data).toHaveProperty('id')

        
    })

    test('signin fail',  ()=>{
        describe('' , async ()=>{
            let failRes = supertest(app).post('/auth/signup')
            .send({
                email:"vk@gmail.com",
                password:"1234"
            })
            expect((await failRes).status).toBe(400)
            expect((await failRes).body).toHaveProperty('status')
        })
    })

})

