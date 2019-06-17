const express = require("express")
const users =  require("./routes/api/users")
const posts =  require("./routes/api/posts")
const profile = require('./routes/api/profile')
const auth  = require('./routes/api/auth')

const PORT =  process.env.PORT || 5000
const connectDB =  require('./config/db')
const app =  express()

//init middleware
app.use(express.urlencoded(),express.json())
//set up routes 
app.use('/api/users',users)
app.use('/api/posts',posts)
app.use('/api/profile',profile)
app.use('/api/auth',auth)
//connection to the database
connectDB();


app.get('/',(req,res)=>{res.send("welcome")})


app.listen(PORT,()=>{
     console.log(`Server on PORT ${PORT}`)
})
