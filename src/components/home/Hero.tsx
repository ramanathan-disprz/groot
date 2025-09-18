import React from "react";
import styles from "../../styles/Hero.module.scss";
import DateIcon from "./DateIcon";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.dateIcon}>
        <DateIcon />
      </div>
      <div className={styles.textContainer}>
        <h1>My Calendar</h1>
        <p>
          Organize your time with My Calendar.
          Always up to date on any device and on the web.
        </p>
      </div>
      <div className={styles.actionContainer}>
        <button onClick={handleClick} className={styles.signInBtn}>Sign In</button>
        <a href="#" className={styles.learnMore}>Learn more</a>
      </div>
    </section>
  );
};

export default Hero;
