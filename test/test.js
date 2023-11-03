// https://medium.com/@akanksha17/getting-started-with-writing-api-tests-in-node-js-96eb2c694cad

// this might be better
// https://medium.com/@it.ermias.asmare/node-js-express-with-jest-and-supertest-e58aaf4c4514

const express = require('express');
// const chai = require('chai');
const request = require('supertest');
const app = express();



describe('login', () => {
    it('should create wallet for the user', () => {
        request(app)
        .post('piazza/user/login')
        .send({
            "email": "joseph.ketterer@gmail.com",
            "password": "hellothere1"
        })
        .expect(201)
    //     .then((res) => {
    //      expect(res.headers.location).to.be.eql('123456/wallet');
    //      // more validations can be added here as required
    // });
 });
});


// describe('POST Create User Wallet', () => {
//     it('should create wallet for the user', () => {
//         request(app)
//         .post('123456/wallet')
//         .send({})
//         .expect(201)
//         .then((res) => {
//          expect(res.headers.location).to.be.eql('123456/wallet');
//          // more validations can be added here as required
//     });
//  });
// });