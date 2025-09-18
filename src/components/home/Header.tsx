import styles from "../../styles/Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>Disprz</div>
        <button className={styles.menuBtn}>⋯</button>
      </div>
    </header>
  );
};

export default Header;
