const express =  require("express")
const router =  express.Router();


//@router GET api/posts
// @desc Test Route
//@access Public
router.get('/',(req,res)=>{
     res.send("posts routes")
})




module.exports =  router;