import React, { useState } from 'react';
import '../../CSS/Contact.css';
import Footer from '../../components/Footer';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/contact/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setResponseMessage(data.message);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setResponseMessage('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <div className="contact-container">
                <div className="contact-info">
                    <h2>Contact Information</h2>
                    <p>Send message</p>
                    <ul>
                        <li>
                            <i className="fa fa-phone"></i> +977 9849943368
                        </li>
                        <li>
                            <i className="fa fa-envelope"></i> pandeybibek098@gmail.com
                        </li>
                        <li>
                            <i className="fa fa-map-marker"></i> Kathmandu, Nepal
                        </li>
                    </ul>
                </div>
                <div className="contact-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Your Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Your Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <textarea
                            placeholder="Write your message..."
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                    {responseMessage && <p>{responseMessage}</p>}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;
