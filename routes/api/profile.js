const express =  require("express")
const router =  express.Router();


//@router GET api/profile
// @desc Test Route
//@access Public
router.get('/',(req,res)=>{
     res.send("profile routes")
})




module.exports =  router;