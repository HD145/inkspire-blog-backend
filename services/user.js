const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const JWT = require("jsonwebtoken")

const handleUserSignup = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).send("Please enter complete details");
        }

        const isUserExist = await User.findOne({ email })

        if (isUserExist) {
            return res.status(400).send("User already exists with this mail.");
        }

        const isUsernameExist = await User.findOne({ username })

        if (isUsernameExist) {
            return res.status(400).send("User already exists with this username.");
        }

        const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!mailRegex.test(email)) {
            return res.status(400).send("Please check the entered email.");
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send("Password should contain atleast 6 letters, one uppercase and one lowercase letter.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            email, username, password: hashedPassword
        })

        return res.status(200).send("Transaction completed successfully.")

    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}
const handleUserSignin = async (req, res) => {
    console.log(req.body);
    
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("Please enter complete details");
        }

        const userData = await User.findOne({ username });
        if (!userData) {
            return res.status(400).send("Incorrect username.");
        }

        const passwordCompare = await bcrypt.compare(password, userData.password);

        if (!passwordCompare) {
            return res.status(400).send("Incorrect password.");
        }

        const secretKey = 'yourSecretKey'; 
        const payload = { username };
        const options = { expiresIn: '1h' };

        const token = JWT.sign(payload, secretKey, options);
        console.log(token);
        
        res.cookie('token', token, {
            httpOnly: false,  // Prevent JavaScript access to the cookie
            secure: true,   // Set this to true when you move to HTTPS
            maxAge: 3600000, // 1 hour
            sameSite: 'none', // Allow cross-origin requests
        });

        return res.status(200).send("Success");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.");
    }
};


const handleGetAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        return res.status(200).send(allUsers)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}
module.exports = {
    handleUserSignup,
    handleUserSignin,
    handleGetAllUsers
}