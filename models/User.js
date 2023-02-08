const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required:[true, "name is required"],
    trim:true,
    lowercase:true

  },
  username: {
    type: String,
    required:true,
    trim:true,
    lowercase:true, 
    min :4 
  },
  email: {
    type: String,
    required:true,
    trim:true,
    lowercase:true,
    unique:true
  },
  address: {
    street:{
        type: String,
        required:true,
        trim:true,
        lowercase:true
    },
    suite:{
        type: String,
        required:true,
        trim:true,
        lowercase:true
    },
    city:{ //only alphabets and space
    type: String,
    required:true,
    trim:true,
    lowercase:true,
    match: [/^[A-Za-z ]+$/, 'city is invalid']
    },
    zipcode:{ //DDDDD-DDDD
        type: String,
        required:true,
        trim:true,
        lowercase:true,
        match: [/\d{5}([ \-]\d{4})/, 'zip code is invalid']
    },
    geo:{
        lat:{
            type: String,
            required:true,
            trim:true,
            lowercase:true

        },
        lng:{
            type: String,
            required:true,
            trim:true,
            lowercase:true
        }        
    },
    
  },
  phone: { //D-DDD-DDD-DDD
    type: String,
    required:true,
    match: [/^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'phone is invalid']
  },
  website: { //http or https is valid
    type: String,
    required:true,
    match: [/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/, 'website invalid, Only Http or Https']

  },
  company: {
    name: {
        type: String,
        required:true,
        trim:true,
        lowercase:true
    },
     catchPhrase: {
        type: String,
        required:true,
        trim:true,
        lowercase:true
    },
     bs: {
        type: String,
        required:true,
        trim:true,
        lowercase:true
    },
  },
  
  created: { 
    type: Date,
    default: Date.now
  },
  updatedat: { 
    type: Date,
    default: Date.now
  },
});

//Declare Virtual Fields
// UserSchema.virtual("fullname")
// .get(function(){
//   return `${this.firstname} ${this.lastname}`
// })

//Custom Schema Methods
//1. Instance Method Declaration

// UserSchema.methods.getFullName = function(){
//   return `${this.firstname} ${this.lastname}`
// }

// UserSchema.methods.getFormattedSalary = function(){
//   return `$${this.salary}`
// }
//2. Static method declararion
// UserSchema.statistics.getUserById = function(uid){
//   return this.find({_id: uid}).select("name username email");
// }


//Writing Query Helpers
UserSchema.query.sortByName = function(flag){ //flag 1 or -1
  return this.sort({'name': flag});
}

UserSchema.query.byUserName = function(name){
  return this.where({'username': name});
}


UserSchema.pre('save', (next) => {
  console.log("Before Save")
  let now = Date.now()
   
  this.updatedat = now
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now
  }
  
  // Call the next function in the pre-save chain
  next()
});

UserSchema.pre('findOneAndUpdate', (next) => {
  console.log("Before findOneAndUpdate")
  let now = Date.now()
  this.updatedat = now
  console.log(this.updatedat)
  next()
});


UserSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

UserSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

UserSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

UserSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const User = mongoose.model("User", UserSchema);
module.exports = User;