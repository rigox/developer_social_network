const express =  require("express")
const router =  express.Router();
const Profile =  require("../../models/Profile")
const User  =  require("../../models/user")
const auth  = require("../../middleware/auth")
const  {check,validationResult}   =  require('express-validator/check')
const request =  require("request")
const config =  require("config")

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

router.delete('/',auth,async (req,res)=>{
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


//@router PUT  api/profile/experience
//@desc  add profile experience
//@access Private

router.put("/experience",[auth,[
      check("title"," title is  required").not().isEmpty(),
      check("company"," company is  required").not().isEmpty(),
      check("from"," from date is  required").not().isEmpty(),
]
     ],async (req,res)=>{
 const errors =  validationResult(req);
 if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
 }
 const{
      title,
      company,
      location,
      from,
      to,
      current,
      description
 }   =  req.body;

  const newExp  ={
       title,
       company,
       location,
       from,
       to,
       current,
       description
  }
  try {
       const profile =  await Profile.findOne({user:req.user.id});
       profile.experiences.unshift(newExp)


       await profile.save();

       res.json(profile)
       
  } catch (err) {
       console.log(err)
       res.status(500).send("server error")
  }

});


//@router DELETE  api/profile/experience/:exp_id
//@desc  Delete experience from profile
//@access Private
router.delete("/experience/:exp_id",auth,async (req,res)=>{
     try {
          const profile =  await Profile.findOne({user:req.user.id})

         const removeIndex = profile.experiences.map(item=> item.id).indexOf(req.params.exp_id);
         profile.experiences.splice(removeIndex,1)
         await profile.save()

         res.json(profile)
     } catch (err) {
          console.log(err)
          res.status(500).send("server error")
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


//@router DELETE  api/profile/education/:edu_id
//@desc  Delete education from profile
//@access Private
router.delete("/education/:edu_id",auth,async (req,res)=>{
     try {
          const profile =  await Profile.findOne({user:req.user.id})

         const removeIndex = profile.education.map(item=> item.id).indexOf(req.params.edu_id);
         profile.education.splice(removeIndex,1)
         await profile.save()

         res.json(profile)
     } catch (err) {
          console.log(err)
          res.status(500).send("server error")
     }
})

//@router PUT  api/education
//@desc  add profile Education
//@access Private

router.put("/education",[auth,[
      check("school"," school is  required").not().isEmpty(),
      check("degree"," degree is  required").not().isEmpty(),
      check("fieldofstudy"," field of study  is  required").not().isEmpty(),
      check("from"," from date is  required").not().isEmpty()
]
     ],async (req,res)=>{
 const errors =  validationResult(req);
 if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
 }
 const{
     school,
     degree,
     fieldofstudy,
     from,
      to,
      current,
      description
 }   =  req.body;

  const newEdu  = {
       school,
       degree,
       fieldofstudy,
       from,
       to,
       current,
       description
  }
  console.log("ssss",newEdu)
  try {
       const profile =  await Profile.findOne({user:req.user.id});
       profile.education.unshift(newEdu)
       await profile.save();

       res.json(profile)
       
  } catch (err) {
       console.log(err)
       res.status(500).send("server error")
  }

});

//@router  get  api/profile/github/:username
//@desc  Get user github repos
//@access public

router.get('/github/:username',(req,res)=>{
      try {
          const options =  {
                uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubclientid")}&client_secret=${config.get('githubsecret')}`,
               method:'GET',
               headers:{'user-agent':"node.js"}
                    }

            request(options,(error,response,body)=>{
                   if(error){
                         console.log(error)
                   } 
                   if(response.statusCode!=200){return res.status(400).json({msg:"No github profile found"})}

                   res.json(JSON.parse(body))
            });     

      } catch (err) {
           console.log(err)
           res.status(500).send("server error")
      }
})



module.exports =  router;