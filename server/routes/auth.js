const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

//register

router.post("/register", async(req, res)=>{
    try{
        const{ email, password} = req.body;

         //check if user alr exists
    const existing = await User.findOne({email})
    if(existing) return res.status(400).json({error: "Email is already in use"})

        //hass PW
        const hashed = await bcrypt.hash(password, 10)

        //save user
        const user = await User.create({email, password: hashed})

        //create tkn
        const token = jwt.sign({is: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.json({token})
    }catch(err){
        res.status(500).json({error: "Register failed"})
    }

})

//login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: "User not found" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: "Wrong password" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({ token })
  } catch (err) {
    res.status(500).json({ error: "Login failed" })
  }
})

module.exports = router