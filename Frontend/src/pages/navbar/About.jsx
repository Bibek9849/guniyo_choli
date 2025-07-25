import React, { useState } from "react";

const About = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleStarHover = (star) => {
    setHoveredStar(star);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const submitReview = () => {
    if (rating > 0) {
      setMessage("Thank you for your review! We appreciate your feedback.");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Please select a rating before submitting.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Who We Are Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '4px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '2px',
              marginRight: '16px'
            }}></div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>
              Who We Are
            </h1>
          </div>
          
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#4a5568',
            marginBottom: '32px'
          }}>
            Guniyo Choli Ladies Fashion Brand is a leading fashion retailer based in Nepal, dedicated to offering stylish, high-quality, and affordable clothing for women. Our mission is to empower women by providing them with fashionable, versatile, and comfortable clothing that suits every occasion. From casual wear to formal attire, we bring together timeless elegance and contemporary trends, designed to make every woman feel confident and beautiful.
          </p>
          
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Fashion Store"
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            />
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))'
            }}></div>
          </div>
        </div>

        {/* Why Us Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '4px',
              height: '40px',
              background: 'linear-gradient(135deg, #764ba2, #667eea)',
              borderRadius: '2px',
              marginRight: '16px'
            }}></div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #764ba2, #667eea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>
              Why Choose Us
            </h1>
          </div>
          
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#4a5568',
            marginBottom: '40px'
          }}>
            At Guniyo Choli Ladies Fashion Brand, we believe in the power of self-expression through fashion. Our collections are carefully curated to reflect the diverse tastes, personalities, and lifestyles of women in Nepal. We prioritize quality, durability, and ethical production processes, ensuring that every piece is crafted with care and attention to detail.
          </p>

          {/* Review Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1a202c, #2d3748)',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '1.5rem' }}>⭐</span>
              Rate Your Experience
            </h2>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= (hoveredStar || rating) ? '#ffd700' : '#4a5568',
                    transition: 'all 0.2s ease',
                    transform: star <= (hoveredStar || rating) ? 'scale(1.2)' : 'scale(1)',
                    filter: star <= (hoveredStar || rating) ? 'drop-shadow(0 0 8px #ffd700)' : 'none'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            
            <button
              onClick={submitReview}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              Submit Review
            </button>
            
            {message && (
              <div style={{
                marginTop: '16px',
                padding: '12px 20px',
                background: message.includes('Thank you') 
                  ? 'rgba(72, 187, 120, 0.2)' 
                  : 'rgba(245, 101, 101, 0.2)',
                color: message.includes('Thank you') ? '#48bb78' : '#f56565',
                borderRadius: '8px',
                border: `1px solid ${message.includes('Thank you') ? '#48bb78' : '#f56565'}`,
                animation: 'fadeInUp 0.3s ease'
              }}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;