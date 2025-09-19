import styles from "../../styles/Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Support</a>
      </div>

      <div className={styles.copyright}>© {new Date().getFullYear()} Disprz. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
