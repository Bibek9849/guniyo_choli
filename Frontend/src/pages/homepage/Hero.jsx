import React, { useEffect, useState } from 'react';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    // Demo images - in real implementation, these would be your actual product images
    const heroImages = [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ];

    useEffect(() => {
        setIsVisible(true);
        
        // Auto-rotate images
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleExploreClick = () => {
        alert("Exploring latest collections!");
    };

    const handleImageClick = (index) => {
        setCurrentImage(index);
    };

    return (
        <div className="hero">
            {/* Background Elements */}
            <div className="hero-bg">
                <div className="bg-gradient"></div>
                <div className="bg-pattern"></div>
                <div className="floating-elements">
                    <div className="float-1"></div>
                    <div className="float-2"></div>
                    <div className="float-3"></div>
                </div>
            </div>

            <div className="hero-container">
                {/* Left Content */}
                <div className={`hero-left ${isVisible ? 'animate-in' : ''}`}>
                    <div className="hero-badge">
                        <span className="badge-icon">✨</span>
                        <span>NEW ARRIVALS ONLY</span>
                    </div>

                    <div className="hero-title">
                        <div className="title-line">
                            <div className="hand-section">
                                <span className="title-word new">new</span>
                                <div className="hand-icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23 5.5V20c0 2.2-1.8 4-4 4h-7.3c-1.08 0-2.1-.43-2.85-1.19L1 14.83c-.39-.39-.39-1.02 0-1.41L2.41 12c.39-.39 1.02-.39 1.41 0L8 16.17V4c0-.55.45-1 1-1s1 .45 1 1v6.5c0 .28.22.5.5.5s.5-.22.5-.5V2c0-.55.45-1 1-1s1 .45 1 1v8.5c0 .28.22.5.5.5s.5-.22.5-.5V3c0-.55.45-1 1-1s1 .45 1 1v7.5c0 .28.22.5.5.5s.5-.22.5-.5V5.5c0-.55.45-1 1-1s1 .45 1 1z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="title-line">
                            <span className="title-word collections">collections</span>
                        </div>
                        <div className="title-line">
                            <span className="title-word everyone">for everyone</span>
                        </div>
                    </div>

                    <p className="hero-subtitle">
                        Discover our curated selection of premium fashion pieces designed for the modern lifestyle. 
                        Experience quality, style, and comfort like never before.
                    </p>

                    <div className="hero-actions">
                        <button className="cta-button primary" onClick={handleExploreClick}>
                            <span>Latest Collection</span>
                            <div className="arrow-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                            </div>
                        </button>

                        <button className="cta-button secondary">
                            <span>Watch Video</span>
                            <div className="play-icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">50K+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">4.9★</span>
                            <span className="stat-label">Rating</span>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className={`hero-right ${isVisible ? 'animate-in' : ''}`}>
                    <div className="image-container">
                        <div className="image-wrapper">
                            <img 
                                src={heroImages[currentImage]} 
                                alt="Hero Fashion" 
                                className="hero-image"
                            />
                            <div className="image-overlay"></div>
                        </div>

                        {/* Image Navigation Dots */}
                        <div className="image-dots">
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentImage ? 'active' : ''}`}
                                    onClick={() => handleImageClick(index)}
                                />
                            ))}
                        </div>

                        {/* Floating Cards */}
                        <div className="floating-card card-1">
                            <div className="card-icon">🔥</div>
                            <div className="card-content">
                                <span className="card-title">Trending</span>
                                <span className="card-subtitle">This Week</span>
                            </div>
                        </div>

                        <div className="floating-card card-2">
                            <div className="card-icon">💯</div>
                            <div className="card-content">
                                <span className="card-title">Quality</span>
                                <span className="card-subtitle">Guaranteed</span>
                            </div>
                        </div>

                        <div className="floating-card card-3">
                            <div className="card-icon">🚚</div>
                            <div className="card-content">
                                <span className="card-title">Free Shipping</span>
                                <span className="card-subtitle">Worldwide</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }

                .hero-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                }

                .bg-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, 
                        rgba(102, 126, 234, 0.9) 0%, 
                        rgba(118, 75, 162, 0.8) 50%,
                        rgba(255, 154, 158, 0.7) 100%
                    );
                }

                .bg-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: 
                        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
                        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 60px 60px, 40px 40px;
                    animation: patternMove 20s linear infinite;
                }

                @keyframes patternMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }

                .floating-elements {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                }

                .float-1, .float-2, .float-3 {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    animation: float 6s ease-in-out infinite;
                }

                .float-1 {
                    width: 80px;
                    height: 80px;
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .float-2 {
                    width: 120px;
                    height: 120px;
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .float-3 {
                    width: 60px;
                    height: 60px;
                    bottom: 20%;
                    left: 20%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                .hero-container {
                    position: relative;
                    z-index: 2;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    align-items: center;
                    min-height: 100vh;
                }

                .hero-left {
                    color: white;
                    opacity: 0;
                    transform: translateX(-100px);
                    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .hero-left.animate-in {
                    opacity: 1;
                    transform: translateX(0);
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .badge-icon {
                    font-size: 1.2rem;
                    animation: sparkle 2s ease-in-out infinite;
                }

                @keyframes sparkle {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                }

                .hero-title {
                    margin-bottom: 1.5rem;
                }

                .title-line {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }

                .title-word {
                    font-size: 4rem;
                    font-weight: 800;
                    line-height: 1.1;
                    text-transform: lowercase;
                    letter-spacing: -2px;
                    display: inline-block;
                    animation: titleSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    transform: translateY(50px);
                }

                .title-word.new {
                    background: linear-gradient(45deg, #fff, #ff9a9e);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation-delay: 0.2s;
                }

                .title-word.collections {
                    background: linear-gradient(45deg, #fff, #a8edea);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation-delay: 0.4s;
                }

                .title-word.everyone {
                    background: linear-gradient(45deg, #fff, #ffd89b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation-delay: 0.6s;
                }

                @keyframes titleSlide {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hand-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .hand-icon {
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffd89b;
                    animation: wave 2s ease-in-out infinite;
                }

                .hand-icon svg {
                    width: 30px;
                    height: 30px;
                }

                @keyframes wave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(20deg); }
                    75% { transform: rotate(-20deg); }
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    opacity: 0.9;
                    margin-bottom: 3rem;
                    max-width: 500px;
                    animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1s both;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 0.9;
                        transform: translateY(0);
                    }
                }

                .hero-actions {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                    animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.2s both;
                }

                .cta-button {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .cta-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }

                .cta-button:hover::before {
                    left: 100%;
                }

                .cta-button.primary {
                    background: white;
                    color: #667eea;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .cta-button.primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
                }

                .cta-button.secondary {
                    background: transparent;
                    color: white;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .cta-button.secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-3px);
                }

                .arrow-icon, .play-icon {
                    width: 20px;
                    height: 20px;
                    transition: transform 0.3s ease;
                }

                .cta-button:hover .arrow-icon {
                    transform: translateX(5px);
                }

                .cta-button:hover .play-icon {
                    transform: scale(1.2);
                }

                .hero-stats {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.4s both;
                }

                .stat {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-size: 2rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .stat-divider {
                    width: 1px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.5);
                }

                .hero-right {
                    position: relative;
                    opacity: 0;
                    transform: translateX(100px);
                    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s;
                }

                .hero-right.animate-in {
                    opacity: 1;
                    transform: translateX(0);
                }

                .image-container {
                    position: relative;
                    height: 600px;
                }

                .image-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 30px;
                    overflow: hidden;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
                    animation: imageFloat 6s ease-in-out infinite;
                }

                @keyframes imageFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(1deg); }
                }

                .hero-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .image-wrapper:hover .hero-image {
                    transform: scale(1.1);
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, 
                        rgba(102, 126, 234, 0.3) 0%, 
                        transparent 50%, 
                        rgba(118, 75, 162, 0.3) 100%
                    );
                    pointer-events: none;
                }

                .image-dots {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .dot.active {
                    background: white;
                    transform: scale(1.2);
                }

                .floating-card {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    animation: cardFloat 4s ease-in-out infinite;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .card-1 {
                    top: 10%;
                    right: -10%;
                    animation-delay: 0s;
                }

                .card-2 {
                    bottom: 30%;
                    left: -15%;
                    animation-delay: 1s;
                }

                .card-3 {
                    top: 50%;
                    right: -15%;
                    animation-delay: 2s;
                }

                @keyframes cardFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }

                .card-icon {
                    font-size: 1.5rem;
                }

                .card-content {
                    display: flex;
                    flex-direction: column;
                }

                .card-title {
                    font-weight: 700;
                    color: #333;
                    font-size: 0.9rem;
                }

                .card-subtitle {
                    font-size: 0.75rem;
                    color: #666;
                    margin-top: 2px;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .hero-container {
                        gap: 2rem;
                        padding: 0 1rem;
                    }

                    .title-word {
                        font-size: 3rem;
                    }

                    .floating-card {
                        display: none;
                    }
                }

                @media (max-width: 768px) {
                    .hero-container {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 3rem;
                        padding: 2rem 1rem;
                    }

                    .title-word {
                        font-size: 2.5rem;
                    }

                    .hero-actions {
                        flex-direction: column;
                        align-items: center;
                    }

                    .hero-stats {
                        justify-content: center;
                    }

                    .image-container {
                        height: 400px;
                    }

                    .cta-button {
                        width: 100%;
                        max-width: 300px;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .title-word {
                        font-size: 2rem;
                    }

                    .hero-subtitle {
                        font-size: 1rem;
                    }

                    .image-container {
                        height: 300px;
                    }

                    .hero-stats {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .stat-divider {
                        width: 40px;
                        height: 1px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Hero;