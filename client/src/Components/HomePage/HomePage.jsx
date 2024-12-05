import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // State to trigger animation
    const [animateText, setAnimateText] = useState(false);

    // Function to trigger animation on mouse hover
    const handleMouseEnter = () => {
        setAnimateText(true);
        // Remove the animation class after it finishes
        setTimeout(() => setAnimateText(false), 1500); // Match the duration of the animation
    };

    const homepageStyle = {
        backgroundImage: 'url("https://media.smallbiztrends.com/2018/09/shutterstock_1169830042.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    };

    const overlayStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    };

    const logoStyle = {
        maxWidth: '150px',
        marginBottom: '20px',
    };

    const headingStyle = {
        fontSize: '3.5rem',
        fontWeight: 'bold',
        color: 'white',
        cursor: 'pointer', // Indicate hover effect
    };

    const paragraphStyle = {
        fontSize: '1.5rem',
        marginBottom: '30px',
        color: 'white',
        cursor: 'pointer', // Indicate hover effect
    };

    const buttonStyle = {
        fontSize: '1.2rem',
        padding: '10px 30px',
        borderRadius: '20px',
        border: 'none',
        cursor: 'pointer',
        margin: '0 10px',
        transition: 'transform 0.3s', // Adding a slight hover effect
    };

    const loginButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#28a745',
    };

    const registerButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#007bff',
    };

    return (
        <>
            {/* Main Content */}
            <div style={homepageStyle}>
                <div style={overlayStyle}>
                    <div>
                        {/* Logo */}
                        <img
                            src="https://img1.wsimg.com/isteam/ip/cd1da61e-e467-4518-bc76-4a848592aad1/TribalAg%20Logo%20Limited.png/:/rs=h:141,cg:true,m/qt=q:100/ll"
                            alt="TribalAg Logo"
                            style={logoStyle}
                        />
                        {/* Toggle the animation class on mouse hover */}
                        <h1
                            style={headingStyle}
                            className={animateText ? 'animate-text' : ''}
                            onMouseEnter={handleMouseEnter}
                        >
                            Grow with FTPLMS: Cultivating Knowledge, Nurturing Growth
                            <h5>Fruit Tree Planting Lifecycle Management and Agribusiness Platform</h5>
                        </h1>
                        
                        <p
                            style={paragraphStyle}
                            className={animateText ? 'animate-text' : ''}
                            onMouseEnter={handleMouseEnter}
                        >
                            Join us in planting seeds of success with practical skills, sustainable farming, and community empowerment.
                        </p>
                        
                        {/* Buttons to navigate to Sign In and Register pages */}
                        <div>
                            <Link to="/login">
                                <button style={loginButtonStyle}>Login</button>
                            </Link>
                            <Link to="/register">
                                <button style={registerButtonStyle}>Register</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* CSS animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes zoomIn {
                        from { transform: scale(0.9); }
                        to { transform: scale(1); }
                    }

                    /* Animation class for text hover */
                    .animate-text {
                        animation: fadeIn 1.5s ease-out, zoomIn 1.5s ease-out;
                    }

                    button:hover {
                        transform: scale(1.05); /* Button hover effect */
                    }
                `}
            </style>
        </>
    );
};

export default HomePage;
