const express = require('express');
const userModel = require('../models/user');
const app = express();

//Read ALL
//http://localhost:3000/users 
app.get('/users', async (req, res) => {
  // const users = await userModel.find({});
  //Sorting
  //use "asc", "desc", "ascending", "descending", 1, or -1
  //const users = await userModel.find({}).sort({'firstname': -1});
  
  //Select Specific Column
  //const users = await userModel.find({}).select("firstname lastname salary").sort({'salary' : 'desc'});  
  
  //Using Query Helper
  const users = await userModel.find({}).sortByName(1)
  try {
    console.log(users[0].name)
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Read By ID
//http://localhost:3000/user?id=60174acfcde1ab2e78a3a9b0
app.get('/user', async (req, res) => {
  //const users = await userModel.find({_id: req.query.id});
  //const users = await userModel.findById(req.query.id);
  // const users = await userModel.find({_id: req.query.id}).select("name username email");
  const users = await userModel.getUserById(req.query.id);

  try {
    console.log(users[0].getName())
    // console.log(users[0].getFormattedSalary())
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By First Name - PATH Parameter
//http://localhost:3000/users/firstname/pritesh
app.get('/users/name/:name', async (req, res) => {
  const name = req.params.name
  const users = await userModel.find({name : name});
  
  //Using Virtual Field Name
  //console.log(users[0].fullname)

  //Using Instance method
  //console.log(users[0].getFullName())

  //Using Static method
  //const users = await userModel.getuserByFirstName(name)
  
  //Using Query Helper
  //const users = await userModel.findOne().byFirstName(name)
 
  
  try {
    if(users.length != 0){
      res.send(users);
    }else{
      res.send(JSON.stringify({status:false, message: "No data found"}))
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Search By First Name OR Last Name
//http://localhost:3000/users/search?firstname=pritesh&lastname=patel
app.get('/users/search', async (req, res) => {
  //console.log(req.query)
  if(Object.keys(req.query).length != 2){
    res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
  }else{
    const name = req.query.name
    const email = req.query.email
    //{ $or: [{ name: "Rambo" }, { breed: "Pugg" }, { age: 2 }] },
    //const users = await userModel.find({ $and: [{firstname : fname}, {lastname : lname}]});
    const users = await userModel.find({ $or: [{name : name}, {email : email}]});
    ///Use below query for AND condition
    //const users = await userModel.find({firstname : fname, lastname : lname});

    try {
      if(users.length != 0){
        res.send(users);
      }else{
        res.send(JSON.stringify({status:false, message: "No data found"}))
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
});


//Search By salary > 1000
//http://localhost:3000/users/salary?value=1000
// app.get('/users/salary', async (req, res) => {
//   //console.log(req.query)
//   if(Object.keys(req.query).length != 1){
//     res.send(JSON.stringify({status:false, message: "Insufficient query parameter"}))
//   }else{
//     const salary = req.query.value
  
//     //const users = await userModel.find({salary : {$gte : salary}});
//     const users = await userModel.find({}).where("salary").gte(salary);
//     // <= 10000
//     //const users = await userModel.find({salary : {$lte : salary }});
    
//     try {
//       if(users.length != 0){
//         res.send(users);
//       }else{
//         res.send(JSON.stringify({status:false, message: "No data found"}))
//       }
//     } catch (err) {
//       res.status(500).send(err);
//     }
//   }
// });

//Some more test queries
//http://localhost:3000/users/test
app.get('/users/test', async (req, res) => {
  try {
    const users = userModel.
                        find({})
                        .where('name').equals('patel')
                        // .where('salary').gte(1000.00).lte(10000.00)
                        .where('name').in(['Leanne Graham'])
                        .limit(10)
                        .sort('-salary')
                        .select('name username email')
                        .exec((err, data) => {
                          if (err){
                              res.send(JSON.stringify({status:false, message: "No data found"}));
                          }else{
                              res.send(data);
                          }
                        });
    } catch (err) {
      res.status(500).send(err);
    }
});

/*{
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031",
    "website": "http://hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  }
*/

//http://localhost:3000/users 
//http://localhost:3000/user
app.post('/user', async (req, res) => {
  
    console.log(req.body)
    const user = new userModel(req.body);
    
    try {
      await user.save((err) => {
        if(err){
          //Custome error handling
          //console.log(err.errors['firstname'].message)
          //console.log(err.errors['lastname'].message)
          //console.log(err.errors['gender'].message)
          //console.log(err.errors['salary'].message)
          res.send(err)
        }else{
          res.send(user);
        }
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

//Update Record
//http://localhost:3000/user/60174acfcde1ab2e78a3a9b0
app.patch('/user/:id', async (req, res) => {
  try {
    console.log(req.body)
    const user =  await userModel.findOneAndUpdate({ _id: req.params.id}, req.body, {new: true})
    //const user =  await userModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(user)
  } catch (err) {
    res.status(500).send(err)
  }
})

//Delete Record by ID
//http://localhost:3000/user/5d1f6c3e4b0b88fb1d257237
app.delete('/user/:id', async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id)

      if (!user) 
      {
        res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
      }else{
        res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
      }
    } catch (err) {
      res.status(500).send(err)
    }
  })

  //Delete Record using findOneAndDelete()
//http://localhost:3000/user/delete?emailid=5d1f6c3e4b0b88fb1d257237
app.get('/user/delete', async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({email: req.query.emailid})

    if (!user) 
    {
      res.status(404).send(JSON.stringify({status: false, message:"No item found"}))
    }else{
      //user.remove() //Update for Mongoose v5.5.3 - remove() is now deprecated
      res.status(200).send(JSON.stringify({status: true, message:"Record Deleted Successfully"}))
    }
  } catch (err) {
    res.status(500).send(err)
  }
})
module.exports = app

//Insert Multiple Records
/*
userModel.create(
  [{"firstname":"Keriann","lastname":"Qualtro","email":"kqualtro3@mediafire.com","gender":"Female","city":"Ulricehamn","designation":"Nurse Practicioner","salary":"9288.95"},
  {"firstname":"Bette","lastname":"Elston","email":"belston4@altervista.org","gender":"Female","city":"Xinhang","designation":"Staff Accountant III","salary":"3086.99"},
  {"firstname":"Editha","lastname":"Feasby","email":"efeasby5@ovh.net","gender":"Female","city":"San Francisco","designation":"Mechanical Systems Engineer","salary":"1563.63"},
  {"firstname":"Letizia","lastname":"Walrond","email":"lwalrond6@ibm.com","gender":"Male","city":"Ricardo Flores Magon","designation":"Research Associate","salary":"6329.05"},
  {"firstname":"Molly","lastname":"MacTrustrie","email":"mmactrustrie7@adobe.com","gender":"Female","city":"Banjarejo","designation":"Quality Control Specialist","salary":"4059.61"}]
)
*/