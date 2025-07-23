import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUserApi } from '../../apis/Api'; // Ensure this function is implemented
import '../../CSS/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attempts, setAttempts] = useState(5); // Track remaining attempts
  const [isRobot, setIsRobot] = useState(false); // State for checkbox

  const navigate = useNavigate();

  const validation = () => {
    let isValid = true;

    setEmailError('');
    setPasswordError('');

    if (email === '' || !email.includes('@')) {
      setEmailError('Email is empty or invalid');
      isValid = false;
    }
    if (password.trim() === '') {
      setPasswordError('Password is empty');
      isValid = false;
    }
    if (!isRobot) {
      toast.error('Please confirm you are not a robot.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    const data = { email, password };

    try {
      const response = await loginUserApi(data);

      if (!response.data.success) {
        setAttempts((prev) => prev - 1); // Decrease attempts on failure
        toast.error(response.data.message);
        if (attempts <= 1) {
          toast.error('No attempts remaining. Please try again later.');
        } else {
          toast.error(`Attempts remaining: ${attempts - 1}`);
        }
      } else {
        toast.success(response.data.message);

        const userData = response.data.userData;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error) {
      toast.error('An error occurred during login.');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login to your account</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-danger">{emailError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-danger">{passwordError}</p>}
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isRobot}
                onChange={() => setIsRobot(!isRobot)}
              />
              I am not a robot
            </label>
          </div>
          <button type="submit" className="btn btn-danger w-100">
            Login
          </button>
          <p className="mt-3 text-center">
            Create an account? <Link to="/register" className="text-primary">Register</Link>
          </p>
          <p className="mt-3 text-center">
            {attempts < 5 && <span>Attempts remaining: {attempts}</span>}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
