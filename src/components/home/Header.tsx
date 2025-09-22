import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import styles from "../../styles/Header.module.scss";

interface HeaderProps {
  showLogout?: boolean;
  onLogout?: () => void;   
}

const Header: React.FC<HeaderProps> = ({ showLogout = false, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>Disprz</div>

        {showLogout ? (
          <button 
            className={styles.menuBtn} aria-label="Logout"
            onClick={onLogout}>
              
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        ) : (
          <button className={styles.menuBtn}>⋯</button>
        )}
      </div>
    </header >
  );
};

export default Header;
