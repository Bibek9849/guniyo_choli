import { toast } from 'react-toastify';

// Enhanced notification system with better timing and user experience
export const showNotification = {
  // Success notifications with auto-dismiss
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Error notifications with longer display time
  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Warning notifications
  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Info notifications
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Loading notifications (manual dismiss)
  loading: (message, options = {}) => {
    return toast.loading(message, {
      position: "top-right",
      ...options
    });
  },

  // Update loading notification
  update: (toastId, type, message, options = {}) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      position: "top-right",
      autoClose: type === 'error' ? 5000 : 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    });
  },

  // Security-specific notifications
  security: {
    mfaRequired: () => {
      toast.info("Multi-Factor Authentication required. Please enter your verification code.", {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        hideProgressBar: true
      });
    },

    accountLocked: (remainingTime) => {
      toast.error(`Account temporarily locked due to multiple failed attempts. Try again in ${remainingTime}.`, {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        hideProgressBar: true
      });
    },

    passwordExpiry: (daysLeft) => {
      toast.warning(`Your password will expire in ${daysLeft} days. Please update it soon.`, {
        position: "top-right",
        autoClose: 8000
      });
    },

    emailVerificationSent: () => {
      toast.success("Verification email sent! Please check your inbox and click the verification link.", {
        position: "top-center",
        autoClose: 8000
      });
    },

    emailVerified: () => {
      toast.success("Email verified successfully! You can now log in.", {
        position: "top-center",
        autoClose: 5000
      });
    }
  },

  // Dismiss all notifications
  dismissAll: () => {
    toast.dismiss();
  }
};

// Enhanced error handler for API responses
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || defaultMessage;
    const status = error.response.status;
    
    if (status === 429) {
      showNotification.error("Too many requests. Please wait before trying again.");
    } else if (status === 401) {
      showNotification.error("Authentication failed. Please log in again.");
    } else if (status === 403) {
      showNotification.error("Access denied. You don't have permission to perform this action.");
    } else if (status >= 500) {
      showNotification.error("Server error. Please try again later.");
    } else {
      showNotification.error(message);
    }
  } else if (error.request) {
    // Network error
    showNotification.error("Network error. Please check your connection and try again.");
  } else {
    // Other error
    showNotification.error(defaultMessage);
  }
};

// Enhanced success handler for API responses
export const handleApiSuccess = (response, defaultMessage = "Operation successful") => {
  const message = response.data?.message || defaultMessage;
  showNotification.success(message);
};

// Form validation error display
export const showValidationErrors = (errors) => {
  Object.values(errors).forEach(error => {
    if (error) {
      showNotification.error(error);
    }
  });
};

// Security event notifications
export const showSecurityNotification = (eventType, data = {}) => {
  switch (eventType) {
    case 'LOGIN_SUCCESS':
      showNotification.success("Login successful! Welcome back.");
      break;
    case 'LOGIN_FAILED':
      showNotification.error(`Login failed. ${data.attemptsLeft ? `Attempts remaining: ${data.attemptsLeft}` : ''}`);
      break;
    case 'REGISTRATION_SUCCESS':
      showNotification.security.emailVerificationSent();
      break;
    case 'MFA_SETUP_SUCCESS':
      showNotification.success("Multi-Factor Authentication has been successfully enabled for your account.");
      break;
    case 'PASSWORD_CHANGED':
      showNotification.success("Password changed successfully.");
      break;
    case 'ACCOUNT_LOCKED':
      showNotification.security.accountLocked(data.remainingTime || '15 minutes');
      break;
    case 'EMAIL_VERIFIED':
      showNotification.security.emailVerified();
      break;
    case 'PASSWORD_EXPIRY_WARNING':
      showNotification.security.passwordExpiry(data.daysLeft || 7);
      break;
    default:
      showNotification.info("Security event occurred.");
  }
};
