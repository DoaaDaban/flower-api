'use strict'

const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const PORT= process.env.PORT


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/flowerDb', {useNewUrlParser: true, useUnifiedTopology: true});

const flowerSchema = new mongoose.Schema({
    name: String,
    instructions: String,
    photo: String,
  });

  const ownerSchema = new mongoose.Schema({
    userEmail: String,
    flowers: [flowerSchema]
  });

  const ownerModel = mongoose.model('flower', ownerSchema);

  // routes

 // http://localhost:3001/

//  server.get('/test', testHandler);

server.get('/getAllFlowers', getAllFlowersHandler)
server.post('/addFlowersR', addFlowersRHandler)
server.get('/getFavFlowers', getFavFlowersHandler)
server.delete('/deleteFlowers/:idx', deleteFlowersHandlers)
server.put('/updateFlowers/:idx', updateFlowersHandlers)




  // handlers

  function getAllFlowersHandler(req,res){
      const URL=`https://flowers-api-13.herokuapp.com/getFlowers`

      axios.get(URL)
      .then(result => {
          res.send(result.data.flowerslist)
      })
  }

  function addFlowersRHandler(req,res){
      const {userEmail, flowerObj} = req.body

      ownerModel.findOne({userEmail: userEmail}, (err, result)=> {
          if(!result){
              const newOwner= new ownerModel({
                userEmail: userEmail,
                flowers: [flowerObj]
              })
              newOwner.save();
          }else{
              result.flowerslist.unshift(flowerObj)
              result.save();
          }
      })
  }

  function getFavFlowersHandler(req,res){

    const {userEmail} = req.query

    ownerModel.findOne({userEmail: userEmail}, (err, result)=>{
        res.send(result.flowerslist)
    })
  }

  function deleteFlowersHandlers(req,res){

    const {idx} =req.params;
    const {userEmail} = req.query;

    ownerModel.findOne({userEmail:userEmail}, (err, result)=> {
        result.flowerslist.splice(idx,1)
        result.save().then(
            res.send(result.flowerslist)
        )
    })
  }

  function updateFlowersHandlers(req,res){
    const {idx} =req.params;
    const {userEmail,flowerObj} = req.body;

    ownerModel.findOne({userEmail:userEmail},(err, result)=>{
        result.flowerslist[idx]=flowerObj
        result.save().then(
            res.send(result.flowerslist)
        )
    })
  }

//    function testHandler(req,res){
//      res.send('RR')
//  }


  server.listen(PORT , ()=>{
      console.log(`listing on PORT ${PORT}`)
  })