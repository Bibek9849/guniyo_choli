// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { registerUserApi } from '../../apis/Api';
// import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
// import '../../CSS/Register.css';

// const Register = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phone, setPhone] = useState('');
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPasswordStrength, setShowPasswordStrength] = useState(false);
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

//   const navigate = useNavigate();

//   const validatePassword = (password, userInfo) => {
//     const errors = [];
    
//     if (password.length < 8) {
//       errors.push('Password must be at least 8 characters long');
//     }
//     if (!/[A-Z]/.test(password)) {
//       errors.push('Password must contain at least one uppercase letter');
//     }
//     if (!/[a-z]/.test(password)) {
//       errors.push('Password must contain at least one lowercase letter');
//     }
//     if (!/\d/.test(password)) {
//       errors.push('Password must contain at least one number');
//     }
//     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
//       errors.push('Password must contain at least one special character');
//     }
//     if (/(.)\1{2,}/.test(password)) {
//       errors.push('Password should not contain repeated characters');
//     }
//     if (/(123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)) {
//       errors.push('Password should not contain sequential characters');
//     }

//     // Common passwords check
//     const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
//     if (commonPasswords.includes(password.toLowerCase())) {
//       errors.push('Password is too common. Please choose a more secure password');
//     }

//     // User info check
//     if (userInfo.firstName && password.toLowerCase().includes(userInfo.firstName.toLowerCase())) {
//       errors.push('Password should not contain your first name');
//     }
//     if (userInfo.lastName && password.toLowerCase().includes(userInfo.lastName.toLowerCase())) {
//       errors.push('Password should not contain your last name');
//     }
//     if (userInfo.email && password.toLowerCase().includes(userInfo.email.split('@')[0].toLowerCase())) {
//       errors.push('Password should not contain your email address');
//     }

//     return errors;
//   };

//   const validate = () => {
//     const newErrors = {};
    
//     // Basic field validation
//     if (!firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     } else if (firstName.trim().length < 2) {
//       newErrors.firstName = 'First name must be at least 2 characters';
//     } else if (!/^[a-zA-Z\s]+$/.test(firstName.trim())) {
//       newErrors.firstName = 'First name can only contain letters and spaces';
//     }
    
//     if (!lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     } else if (lastName.trim().length < 2) {
//       newErrors.lastName = 'Last name must be at least 2 characters';
//     } else if (!/^[a-zA-Z\s]+$/.test(lastName.trim())) {
//       newErrors.lastName = 'Last name can only contain letters and spaces';
//     }
    
//     if (!email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
//       newErrors.phone = 'Please enter a valid phone number';
//     } else if (phone.replace(/\D/g, '').length < 10) {
//       newErrors.phone = 'Phone number must be at least 10 digits';
//     }
    
//     // Password validation
//     if (!password.trim()) {
//       newErrors.password = 'Password is required';
//     } else {
//       const passwordErrors = validatePassword(password, { firstName, lastName, email });
//       if (passwordErrors.length > 0) {
//         newErrors.password = passwordErrors[0]; // Show first error
//       }
//     }
    
//     if (!confirmPassword.trim()) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (password !== confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     // Terms and privacy validation
//     if (!agreedToTerms) {
//       newErrors.terms = 'You must agree to the Terms of Service';
//     }
    
//     if (!agreedToPrivacy) {
//       newErrors.privacy = 'You must agree to the Privacy Policy';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validate()) {
//       toast.error('Please fix the errors below');
//       return;
//     }

//     setIsLoading(true);
    
//     const data = { 
//       firstName: firstName.trim(), 
//       lastName: lastName.trim(), 
//       email: email.trim().toLowerCase(), 
//       password, 
//       phone: phone.trim() 
//     };
    
//     try {
//       const res = await registerUserApi(data);
//       if (!res.data.success) {
//         if (res.data.errors) {
//           // Handle validation errors from backend
//           const backendErrors = {};
//           res.data.errors.forEach(error => {
//             const field = error.toLowerCase();
//             if (field.includes('email')) backendErrors.email = error;
//             else if (field.includes('password')) backendErrors.password = error;
//             else if (field.includes('phone')) backendErrors.phone = error;
//           });
//           setErrors(backendErrors);
//         }
//         toast.error(res.data.message);
//       } else {
//         toast.success(res.data.message);
//         // Clear form
//         setFirstName('');
//         setLastName('');
//         setEmail('');
//         setPassword('');
//         setConfirmPassword('');
//         setPhone('');
//         setAgreedToTerms(false);
//         setAgreedToPrivacy(false);
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Registration error:', error);
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message);
//       } else {
//         toast.error('Registration failed. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const userInfo = { firstName, lastName, email };

//   return (
//     <div className="register-container">
//       <div className="register-card">
//         <h1 className="register-title">Create an Account</h1>
//         <p className="register-subtitle">Join us and enjoy secure shopping with advanced protection</p>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="firstName">First Name *</label>
//               <input
//                 type="text"
//                 className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
//                 id="firstName"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 placeholder="Enter your first name"
//                 disabled={isLoading}
//                 required
//               />
//               {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="lastName">Last Name *</label>
//               <input
//                 type="text"
//                 className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
//                 id="lastName"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 placeholder="Enter your last name"
//                 disabled={isLoading}
//                 required
//               />
//               {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Email Address *</label>
//             <input
//               type="email"
//               className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email address"
//               disabled={isLoading}
//               required
//             />
//             {errors.email && <div className="invalid-feedback">{errors.email}</div>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="phone">Phone Number *</label>
//             <input
//               type="tel"
//               className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
//               id="phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="Enter your phone number"
//               disabled={isLoading}
//               required
//             />
//             {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password *</label>
//             <input
//               type="password"
//               className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//               id="password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 setShowPasswordStrength(e.target.value.length > 0);
//               }}
//               placeholder="Create a strong password"
//               disabled={isLoading}
//               required
//             />
//             {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            
//             {showPasswordStrength && (
//               <PasswordStrengthIndicator password={password} userInfo={userInfo} />
//             )}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password *</label>
//             <input
//               type="password"
//               className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
//               id="confirmPassword"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm your password"
//               disabled={isLoading}
//               required
//             />
//             {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
//           </div>
          
//           <div className="form-group">
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
//                 id="agreedToTerms"
//                 checked={agreedToTerms}
//                 onChange={(e) => setAgreedToTerms(e.target.checked)}
//                 disabled={isLoading}
//                 required
//               />
//               <label className="form-check-label" htmlFor="agreedToTerms">
//                 I agree to the <Link to="/terms" target="_blank" className="text-primary">Terms of Service</Link> *
//               </label>
//               {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
//             </div>
//           </div>
          
//           <div className="form-group">
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 className={`form-check-input ${errors.privacy ? 'is-invalid' : ''}`}
//                 id="agreedToPrivacy"
//                 checked={agreedToPrivacy}
//                 onChange={(e) => setAgreedToPrivacy(e.target.checked)}
//                 disabled={isLoading}
//                 required
//               />
//               <label className="form-check-label" htmlFor="agreedToPrivacy">
//                 I agree to the <Link to="/privacy" target="_blank" className="text-primary">Privacy Policy</Link> *
//               </label>
//               {errors.privacy && <div className="invalid-feedback d-block">{errors.privacy}</div>}
//             </div>
//           </div>
          
//           <div className="security-notice">
//             <div className="security-icon">🔒</div>
//             <div className="security-text">
//               <strong>Your Security Matters</strong>
//               <p>We use advanced encryption and security measures to protect your data. Your account will be protected with email verification and optional two-factor authentication.</p>
//             </div>
//           </div>
          
//           <button 
//             type="submit" 
//             className="btn btn-primary w-100"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                 Creating Account...
//               </>
//             ) : (
//               'Create Account'
//             )}
//           </button>
//         </form>
        
//         <div className="register-footer">
//           <p className="text-center">
//             Already have an account? <Link to="/login" className="text-primary">Sign In</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../apis/Api';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import '../../CSS/Register.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password, userInfo) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password should not contain repeated characters');
    }
    if (/(123|234|345|456|567|678|789|abc|bcd|cde|def)/i.test(password)) {
      errors.push('Password should not contain sequential characters');
    }

    // Common passwords check
    const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123'];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password');
    }

    // User info check
    if (userInfo.firstName && password.toLowerCase().includes(userInfo.firstName.toLowerCase())) {
      errors.push('Password should not contain your first name');
    }
    if (userInfo.lastName && password.toLowerCase().includes(userInfo.lastName.toLowerCase())) {
      errors.push('Password should not contain your last name');
    }
    if (userInfo.email && password.toLowerCase().includes(userInfo.email.split('@')[0].toLowerCase())) {
      errors.push('Password should not contain your email address');
    }

    return errors;
  };

  const validate = () => {
    const newErrors = {};
    
    // Basic field validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters and spaces';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters and spaces';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    } else if (phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    
    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(password, { firstName, lastName, email });
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0]; // Show first error
      }
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms and privacy validation
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service';
    }
    
    if (!agreedToPrivacy) {
      newErrors.privacy = 'You must agree to the Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    
    const data = { 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: email.trim().toLowerCase(), 
      password, 
      phone: phone.trim() 
    };
    
    try {
      const res = await registerUserApi(data);
      if (!res.data.success) {
        if (res.data.errors) {
          // Handle validation errors from backend
          const backendErrors = {};
          res.data.errors.forEach(error => {
            const field = error.toLowerCase();
            if (field.includes('email')) backendErrors.email = error;
            else if (field.includes('password')) backendErrors.password = error;
            else if (field.includes('phone')) backendErrors.phone = error;
          });
          setErrors(backendErrors);
        }
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        // Clear form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setAgreedToTerms(false);
        setAgreedToPrivacy(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const userInfo = { firstName, lastName, email };

  // Password strength calculation function
  const getPasswordStrength = (password) => {
    if (!password) return { level: 'None', color: '#ccc' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noRepeat: !/(.)\1{2,}/.test(password)
    };

    // Calculate score
    Object.values(checks).forEach(check => {
      if (check) score += 1;
    });

    // Additional length bonus
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    let level, color;
    if (score <= 2) {
      level = 'Very Weak';
      color = '#ff4444';
    } else if (score <= 4) {
      level = 'Weak';
      color = '#ff8800';
    } else if (score <= 6) {
      level = 'Medium';
      color = '#ffaa00';
    } else if (score <= 7) {
      level = 'Strong';
      color = '#88cc00';
    } else {
      level = 'Very Strong';
      color = '#00cc44';
    }

    return { level, color, score };
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Create an Account</h1>
        <p className="register-subtitle">Join us and enjoy secure shopping with advanced protection</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                disabled={isLoading}
                required
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                disabled={isLoading}
                required
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={isLoading}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              disabled={isLoading}
              required
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          
          <div className="password-section">
            <div className="password-input-container">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowPasswordStrength(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowPasswordStrength(password.length > 0)}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            
            <div className="password-validation-container">
              {showPasswordStrength && (
                <PasswordStrengthIndicator 
                  password={password} 
                  userInfo={{ firstName, lastName, email }}
                />
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
              required
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                id="agreedToTerms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading}
                required
              />
              <label className="form-check-label" htmlFor="agreedToTerms">
                I agree to the <Link to="/terms" target="_blank" className="text-primary">Terms of Service</Link> *
              </label>
              {errors.terms && <div className="invalid-feedback d-block">{errors.terms}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-check">
              <input
                type="checkbox"
                className={`form-check-input ${errors.privacy ? 'is-invalid' : ''}`}
                id="agreedToPrivacy"
                checked={agreedToPrivacy}
                onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                disabled={isLoading}
                required
              />
              <label className="form-check-label" htmlFor="agreedToPrivacy">
                I agree to the <Link to="/privacy" target="_blank" className="text-primary">Privacy Policy</Link> *
              </label>
              {errors.privacy && <div className="invalid-feedback d-block">{errors.privacy}</div>}
            </div>
          </div>
          
          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <div className="security-text">
              <strong>Your Security Matters</strong>
              <p>We use advanced encryption and security measures to protect your data. Your account will be protected with email verification and optional two-factor authentication.</p>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="register-footer">
          <p className="text-center">
            Already have an account? <Link to="/login" className="text-primary">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;