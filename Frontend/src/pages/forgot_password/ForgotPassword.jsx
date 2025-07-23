// import React, { useState } from 'react';
// import { forgotPasswordApi, verifyOtpApi } from '../../apis/Api';
// import { toast } from 'react-toastify';
// import '../../CSS/Forgot.css';
// import { useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//     const [phone, setPhone] = useState('');
//     const [isSent, setIsSent] = useState(false);
//     const [otp, setOtp] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleForgotPassword = (e) => {
//         e.preventDefault();
//         forgotPasswordApi({ phone })
//             .then((res) => {
//                 if (res.status === 200) {
//                     toast.success(res.data.message);
//                     setIsSent(true);
//                 }
//             })
//             .catch((error) => {
//                 if (error.response && error.response.status === 400) {
//                     toast.error(error.response.data.message);
//                 }
//             });
//     };

//     const handleVerify = (e) => {
//         e.preventDefault();
//         const data = {
//             phone: phone,
//             otp: otp,
//             password: password,
//         };
//         verifyOtpApi(data)
//             .then((res) => {
//                 if (res.status === 200) {
//                     toast.success(res.data.message);
//                     navigate('/login'); // Redirect to login after successful password reset
//                 }
//             })
//             .catch((error) => {
//                 if (error.response && error.response.status === 400) {
//                     toast.error(error.response.data.message);
//                 }
//             });
//     };

//     return (
//         <div className="forgot-password-container">
//             <div className="forgot-password-card">
//                 <h3 className="forgot-password-title">Forgot Password</h3>
//                 <form onSubmit={handleForgotPassword}>
//                     <div className="form-group">
//                         <div className="input-group">
//                             <div className="input-group-prepend">
//                                 <span className="input-group-text">+977</span>
//                             </div>
//                             <input
//                                 disabled={isSent}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 className="form-control"
//                                 type="number"
//                                 placeholder="Enter your valid number"
//                             />
//                         </div>
//                     </div>
                    
//                     <button
//                         disabled={isSent}
//                         type="submit"
//                         className="btn btn-primary"
//                     >
//                         Send OTP
//                     </button>

//                     {isSent && (
//                         <>
//                             <div className="otp-info">
//                                 OTP has been sent to <span>{phone}</span> ✅
//                             </div>
//                             <div className="form-group">
//                                 <input
//                                     onChange={(e) => setOtp(e.target.value)}
//                                     type="number"
//                                     className="form-control"
//                                     placeholder="Enter valid OTP"
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <input
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     type="password"
//                                     className="form-control"
//                                     placeholder="Set new Password"
//                                 />
//                             </div>
                            
//                             <button
//                                 onClick={handleVerify}
//                                 className="btn btn-secondary"
//                             >
//                                 Verify OTP & Set Password
//                             </button>
//                         </>
//                     )}
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;
