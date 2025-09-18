import React from "react";
import styles from "../../styles/DateIcon.module.scss";

const DateIcon: React.FC = () => {
  const today = new Date();
  const day = today.getDate();
  const weekday = today.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div className={styles.dateIcon}>
      <span className={styles.weekday}>{weekday.toUpperCase()}</span>
      <span className={styles.day}>{day}</span>
    </div>
  );
};

export default DateIcon;
