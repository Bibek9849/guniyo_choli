const router=require('express').Router();
const userControllers=require('../controllers/userControllers');
const searchController = require("../controllers/searchController")
const { protect } = require('../middleware/authMiddleware'); // JWT middleware
const { changePassword,verifyEmail } = require('../controllers/userControllers');

// Creating user API
router.post('/create',userControllers.createUser);

// login user api
router.post('/login', userControllers.loginUser)

// forgot password api
router.post('/forgot_password', userControllers.forgotPassword)

//

// verify
router.post('/verify_otp', userControllers.verifyOtpAndSetPassword)
router.post("/add_to_cart",userControllers.addToCart);
router.post("/remove_from_cart",userControllers.removeFromCart);
router.get("/get_cart/:id",userControllers.getCart)
router.get("/search",searchController.searchProducts);
router.get('/verify-email', verifyEmail); // 👈 new route

router.put('/change-password', protect, changePassword);


// exporting
module.exports=router;