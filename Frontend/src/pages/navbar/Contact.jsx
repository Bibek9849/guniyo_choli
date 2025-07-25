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
    const [isSuccess, setIsSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/contact/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
                setResponseMessage(data.message);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setIsSuccess(false);
                setResponseMessage('Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setIsSuccess(false);
            setResponseMessage('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <section className="contact-container">
                <div className="contact-info">
                    <h2>Let's Get in Touch</h2>
                    <p>We’d love to hear from you. Reach out to us!</p>
                    <ul>
                        <li>
                            <span className="icon"><i className="fa fa-phone"></i></span> +977 9849943368
                        </li>
                        <li>
                            <span className="icon"><i className="fa fa-envelope"></i></span> pandeybibek098@gmail.com
                        </li>
                        <li>
                            <span className="icon"><i className="fa fa-map-marker"></i></span> Kathmandu, Nepal
                        </li>
                    </ul>
                </div>
                <div className="contact-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                        <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                    {responseMessage && (
                        <p className={`response-message ${isSuccess ? 'success' : 'error'}`}>
                            {responseMessage}
                        </p>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Contact;
