import supertest from "supertest";
import app from "../../src/app";


 describe('group test',()=>{

    test('create group test',async () =>{

        const res = supertest(app).post('/group/create')
        .send({
             name: 'vaibhav',
             adminId: '1',
             memberIds: ['1','2']
        })

        expect((await res).status).toBe(201)
        expect((await res).body.data).toHaveProperty('data')
        
    })

    test('test get all group',async () =>{

        const res = await supertest(app).post('/group')
        expect(res.body.data.length).toBe(1)
    })

 })