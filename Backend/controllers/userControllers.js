const userModel = require('../models/userModels');
const productModel = require("../models/productModel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const createUser = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password || !phone) {
        return res.json({ success: false, message: "Please enter all fields!" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User Already Exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const emailToken = crypto.randomBytes(32).toString('hex');

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password: hashPassword,
            phone,
            emailToken,
            isVerified: false
        });

        await newUser.save();

        const verifyURL = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;

        // configure transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: email,
            subject: 'Verify your Email',
            html: `
                <h2>Hi ${firstName},</h2>
                <p>Click below to verify your email:</p>
                <a href="${verifyURL}">${verifyURL}</a>
            `
        });

        return res.json({ success: true, message: 'User created. Please verify your email!' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Internal Server Error!" });
    }
};

const loginUser = async (req, res) => {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Please enter all fields!" });
    }

    try {
        const user = await userModel.findOne({ email });
        console.log('Found user:', user);

        if (!user) {
            return res.json({ success: false, message: "User Not Found!" });
        }

        if (!user.isVerified) {
            return res.json({ success: false, message: "Please verify your email before logging in!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValidPassword);
        if (!isValidPassword) {
            return res.json({ success: false, message: "Incorrect Password!" });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        );

        return res.json({
            success: true,
            message: "Login Successful!",
            token,
            userData: user
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.json({ success: false, message: "Internal Server Error!" });
    }
};


const forgotPassword = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        res.status(400).json({
            'success': false,
            'message': 'Please provide phone number!'
        });
    }

    try {
        const user = await userModel.findOne({ phone: phone });
        if (!user) {
            return res.status(400).json({
                'success': false,
                'message': 'User Not Found!'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otpReset = otp;
        user.otpResetExpires = Date.now() + 3600000;
        await user.save();

        res.status(200).json({
            'success': true,
            'message': 'OTP Send Successfully!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            'success': false,
            'message': 'Server Error!'
        });
    }
};

const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
        return res.status(400).json({
            'success': false,
            'message': 'Please provide all the details!'
        });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                'success': false,
                'message': 'User Not Found!'
            });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(400).json({
                'success': false,
                'message': 'Product Not Found!'
            });
        }
        cart = {
            product: productId,
            quantity: quantity,
        }

        user.cart.push(cart)
        await user.save();
        return res.status(200).json({
            'success': true,
            'message': 'Product added to  cart'
        });
    } catch (err) {
        return res.status(400).json({
            'success': false,
            'message': err
        })
    }

}

const getCart = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                'success': false,
                'message': 'Please provide user id!'
            });
        }
        const newUser = await userModel.findById(userId).populate("cart.product");
        const userCart = newUser.cart.filter((item) => item.product !== null)
        const newUserCart = userCart.map((item) => { return { product: item.product._id, quantity: item.quantity } });
        newUser.cart = newUserCart;
        await newUser.save()

        if (!newUser) {
            return res.status(400).json({
                'success': false,
                'message': 'User Not Found!'
            });
        }
        return res.status(200).json({
            success: true,
            cart: userCart
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err
        })

    }
}

const removeFromCart = async (req, res) => {
    console.log(req.body);
    const { userId, productId } = req.body;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(400).json({
                'success': false,
                'message': 'User Not Found!'
            });
        }
        user.cart = user.cart.filter((element) => element.product.toString() !== productId);
        await user.save();
        return res.status(200).json({
            success: true,
            message: "removed sucessfully"
        });
    } catch (error) {

    }

}
const changePassword = async (req, res) => {
    const userId = req.user.id; // Set by auth middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please provide current and new password'
        });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};



const verifyOtpAndSetPassword = async (req, res) => {
    const { phone, otp, newPassword } = req.body;
  
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone, otp and new password",
      });
    }
  
    try {
      const user = await userModel.findOne({ phone: phone });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check if OTP matches and is not expired
      if (
        user.otpReset !== parseInt(otp) ||
        !user.otpResetExpires ||
        Date.now() > user.otpResetExpires
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired OTP",
        });
      }
  
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update password and clear OTP fields
      user.password = hashedPassword;
      user.otpReset = undefined;
      user.otpResetExpires = undefined;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  const verifyEmail = async (req, res) => {
    const { token } = req.query;
  
    if (!token) {
      return res.status(400).send('Invalid verification link');
    }
  
    try {
      const user = await userModel.findOne({ emailToken: token });
  
      if (!user) {
        return res.status(400).send('Invalid or expired token');
      }
  
      user.isVerified = true;
      user.emailToken = undefined; // clear token
      await user.save();
  
      return res.status(200).send('Email verified successfully! You can now login.');
    } catch (error) {
      console.error(error);
      return res.status(500).send('Server error during verification');
    }
  };
  

module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    verifyOtpAndSetPassword,
    addToCart, getCart,
    removeFromCart,
    getCart,
    changePassword,
    verifyEmail
};
