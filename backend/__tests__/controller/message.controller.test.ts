import supertest from "supertest";
import app from "../../src/app"
import test, { describe } from "node:test";


describe('message test',()=>{
     test('test create message',async () =>{
         let res = await supertest(app).post('/create')
         .send({})
         expect(res.status).toHaveProperty('201')
        // expect(res.body).to 
     })
})



