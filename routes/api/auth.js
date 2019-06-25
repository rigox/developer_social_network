const express =  require("express")
const router =  express.Router();
const auth = require('../../middleware/auth');
const  User =  require("../../models/user")
const jsonwebtoken = require("jsonwebtoken")
const config =  require("config")
const  {check,validationResult}   =  require('express-validator/check')
const bcrypt = require("bcryptjs");


//@router GET api/auth
// @desc Test Route
//@access Public
router.get('/',auth,async (req,res)=>{
  try{
          const user =  await  User.findById(req.user.id).select('-password')
          res.json(user)
  }catch(err){
        console.log(err)
        res.status(500).send("server error")
  }
})

//@router GET api/auth
// @desc  authenticate & get token
//@access Public
router.post('/',[
    check('email',"please include a valid email").isEmail(),
    check("password","Please enter password with six or more characters").exists()
], async (req,res)=>{
console.log("HERER")
const errors =  validationResult(req);
if(!errors.isEmpty()){
    return  res.status(400).json(({erros:errors.array()}))
}
const  {email,password} = req.body || req.query  
try{
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({errors:[{msg:"invalid credintials"}]})
    }
const isMatch   = await bcrypt.compare(password,user.password);
if(!isMatch){
    return res.status(400).json({errors:[{msg:"invalid credintials"}]})
}

const payload = {
      user:{
           id:user.id
      }
}
jsonwebtoken.sign(payload,config.get("jwtSecret"),{expiresIn:360000},(err,token)=>{
     if(err){throw err}
     res.json({ token })
    })

//return the json webtoken

}catch(err){
console.log(err.message)
res.status(500).send("server error")
}



})










module.exports =  router;