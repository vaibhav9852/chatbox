import request from 'supertest'
import app from '../src/app'
import test, { describe } from 'node:test';


describe('app test',  () =>{
     
    test('test home page',async () =>{
        const res = await request(app).get('/');
        // expect(res.body).toEqual("Home Page")
    })
})



 

