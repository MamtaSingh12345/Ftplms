import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/HomePage.module.css';

// Image imports
import farmersLogo from '../images/farmer.jpg';
import vrikshSevakLogo from '../images/vrikshaSevak.jpg';
import adminLogo from '../images/admin.jpg';
//import cornerImage from '../images/cornerImage.jpg';  // New image for the left corner

const HomePage = () => {
  return (
    <div className={styles.homePage}>
       {/* Image positioned in the top left corner using a direct URL */}
       <div className={styles.cornerImageContainer}>
        <img 
          src="data:image/jpeg;base64,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" 
          alt="Corner Logo" 
          className={styles.cornerImage} 
        />
      </div>

      <h2 className={styles.heading}>
        Welcome to the Fruit Tree Planting Lifecycle Management Solution
      </h2>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/login" className={styles.navLink}>
              <img src={farmersLogo} alt="Farmers Portal" className={styles.portalLogo} />
              Farmers Portal
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/login" className={styles.navLink}>
              <img src={vrikshSevakLogo} alt="Vriksh Sevak Portal" className={styles.portalLogo} />
              Vriksh Sevak Portal
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/login" className={styles.navLink}>
              <img src={adminLogo} alt="Admin Portal" className={styles.portalLogo} />
              Admin Portal
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
