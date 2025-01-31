const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const JWT = require("jsonwebtoken");
const otpGenerator = require("otp-generator")
const { handleSendMail } = require("../common/email-config");
const { otpStore } = require("../common/otp-store");

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

        res.cookie('token', token, {
            httpOnly: false,  
            secure: true,   
            maxAge: 3600000, 
            sameSite: 'none',
        });

        return res.status(200).send(username);

    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.");
    }
};

const handleGetUserData = async (req, res) => {
    try {
        const { username } = req.body;
        const userData = await User.findOne({ username: username });

        const data = {
            username: userData?.username,
            email: userData?.email,
            followers: userData?.followers,
            following: userData?.following
        }
        return res.status(200).send(data)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}
const handleGetAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        return res.status(200).send(allUsers)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleFollowUser = async (req, res) => {
    const { userIdToFollow } = req.body;
    const currentUserId = req.user.username;

    try {
        const userToFollow = await User.findOne({ username: userIdToFollow });
        const currentUser = await User.findOne({ username: currentUserId });

        if (!userToFollow || !currentUser) {
            return res.status(404).send("User not found");
        }

        if (currentUser.following.includes(userIdToFollow)) {
            return res.status(400).send("Already following this user");
        }

        currentUser.following.push(userIdToFollow);
        userToFollow.followers.push(currentUserId);

        await currentUser.save();
        await userToFollow.save();

        return res.status(200).send("User followed successfully");
    } catch (error) {
        return res.status(500).send("Internal server error");
    }
};


const handleUnfollowUser = async (req, res) => {
    const { userIdToUnfollow } = req.body;
    const currentUserId = req.user.username;

    try {
        const userToUnfollow = await User.findOne({ username: userIdToUnfollow });
        const currentUser = await User.findOne({ username: currentUserId });

        if (!userToUnfollow || !currentUser) {
            return res.status(404).send("User not found");
        }

        currentUser.following = currentUser.following.filter(
            (id) => id.toString() !== userIdToUnfollow
        );
        userToUnfollow.followers = userToUnfollow.followers.filter(
            (id) => id.toString() !== currentUserId
        );

        await currentUser.save();
        await userToUnfollow.save();

        return res.status(200).send("User unfollowed successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error");
    }
};

const handleUserLogout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: false,
            secure: true,
            maxAge: 0,
            sameSite: 'none',
        });

        return res.status(200).send("Logout successful");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server error. Please try again.");
    }
};

const handleGetDataUser = async (req, res) => {
    if (req.user) {
        return res.status(200).json(req.user)
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
}

const handleMail = async (req, res) => {

    try {
        const { username } = req.body;

        const userExist = await User.findOne({ username });

        if (!userExist) {
            res.status(401).json({ message: 'User does not exist.' });
        }
        const otp = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

        otpStore[username] = otp;
        setTimeout(() => delete otpStore[username], 300000);

        await handleSendMail(userExist.email, otp);

        return res.status(200).send(`One Time Password sent successfully.`)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server not found. Please try again.")
    }
}

const handleVerifyOtp = async (req, res) => {
    try {
        const { username, otp } = req.body;

        if (!username || !otp) {
            return res.status(400).send("Please provide complete details");
        }

        const storedOtp = otpStore[username];

        if (!storedOtp) {
            return res.status(400).send("OTP expired or not found. Please try agin.");
        }

        if (storedOtp !== otp) {
            return res.status(400).send("Invalid OTP");
        }

        delete otpStore[username];

        return res.status(200).send("OTP verified successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error. Please try again.");
    }
};

const handleUpdatePassword = async (req, res) => {
    try {
        const { username, newPassword } = req.body;

        if (!username || !newPassword) {
            return res.status(400).send("Please provide complete details");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send("Password should contain at least 6 characters, including one uppercase and one lowercase letter.");
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).send("Password updated successfully.");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error. Please try again.");
    }
};



module.exports = {
    handleUserSignup,
    handleUserSignin,
    handleGetAllUsers,
    handleGetUserData,
    handleFollowUser,
    handleUnfollowUser,
    handleUserLogout,
    handleGetDataUser,
    handleMail,
    handleVerifyOtp,
    handleUpdatePassword
}