const express =  require("express")
const router =  express.Router();
const Profile =  require("../../models/Profile")
const User  =  require("../../models/user")
const auth  = require("../../middleware/auth")
const  {check,validationResult}   =  require('express-validator/check')


//@router GET api/profile/me
//@desc get current user profile
//@access Public
router.get('/me',auth, async (req,res)=>{

     try{
          profile  = await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])

          if(!profile){
                return res.status(400).json({msg:"there is no profile for this user"})
          }

          res.json(profile)

     }catch(err){
          console.log(err.message)
          res.status(500).send("Server error")

     }
     

});

//@router POST api/profile/
//@desc create or update a users profile
//@access Provate
router.post('/',[auth,
  check('status',"Status is required").not().isEmpty(),
  check("skills","skills is required").not().isEmpty()
], async (req,res)=>{
  const errors =  validationResult(req)
  if(!errors.isEmpty()){
        return  res.status(400).json({erros: errors.array()})
  }
   const {
     company,
     website,
     location,
     bio,
     status,
     githubusername,
     skills,
     youtube,
     facebook,
     twitter,
     instagram,
     linkedin
   }  = req.body;

  // Build Profile Object

  const profileFields  ={};
  profileFields.user=  req.user.id;

  if(company) profileFields.company = company
  if(website) profileFields.website = website
  if(location) profileFields.location = location
  if(bio) profileFields.bio = bio
  if(status) profileFields.status = status
  if(githubusername) profileFields.githubusername = githubusername

  if(skills){
        profileFields.skills  = skills.split(',').map(skill=> skill.trim())     
  }

 // build  social  object
profileFields.social = {}

if(youtube) profileFields.social.youtube = youtube
if(facebook) profileFields.social.facebook = facebook
if(twitter) profileFields.social.twitter = twitter
if(instagram) profileFields.social.instagram = instagram
if(linkedin) profileFields.social.linkedin = linkedin

try{
  let profile = await Profile.findOne({user:req.user.id})

if(profile){
     profile  = await   Profile.findByIdAndUpdate(
          {user:req.user.id},
          {$set:profileFields},
          {new : true}
          );
          return res.json(profile)
     }
//create a profile

profile = new Profile(profileFields);
await profile.save()
res.json(profile);
}catch(err){
      console.log(err.message)
      res.status(500).send("Server Error")
}


res.send("hello")

});


//@router GET api/profile
//@desc gets all profiles
//@access Public
router.get('/', async (req,res)=>{
      try {
           const profiles =  await  Profile.find().populate('user',['name','avatar'])
           res.json(profiles);
      } catch(err) {
          console.log(err.message)
          res.status(500).send("Server Error") 
      }
})


//@router GET api/profile/user/:user_id
//@desc gets  profile by user  id
//@access Public
router.get('/user/:user_id', async (req,res)=>{
     try {
          const profile =  await  Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
          
          if(!profile) return res.status(400).json({msg:"there is no profile for this user"})
          

          res.json(profile);
     } catch(err) {
         console.log(err.message)
         if(err.kind =="ObjectId"){
          res.status(400).send("Profile was not found") 

         }
         res.status(500).send("Server Error") 
     }
})


//@router DELETE  api/profile
//@desc  Delete profile , user & post
//@access Private

router.delete('/', auth,async (req,res)=>{
     try {
          // remove profile
          await  Profile.findOneAndRemove({user:req.user.id})
          //removes user
          await  User.findOneAndRemove({_id:req.user.id})

          res.json({msg:"user deleted"});
     } catch(err) {
         console.log(err.message)
         res.status(500).send("Server Error") 
     }
})



module.exports =  router;