
const axios = require('axios')

const sendOtp = async (phone, otp) => {

    let isSent = false;

    // third party service provider
    const url = 'https://api.managepoint.co/api/sms/send'

    // payload
    const payload = {
    'apiKey': process.env.SMS_API_KEY,
        'to' : phone,
        'message' : `Your OTP for Verification is ${otp}`
    }

    try {
        const res = await axios.post(url,payload)
        if(res.status == 200){
            isSent = true;
        }
        
    } catch (error) {
        console.log('OTP Sending Fail : ', error.message)
    }

    return isSent;

}


module.exports = sendOtp
//