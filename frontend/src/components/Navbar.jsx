import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>Лого</div>
        <div className={styles.name}>Название</div>
      </div>

      <div className={styles.links}>
        <NavLink to="/upload" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          ЗАГРУЗИТЬ
        </NavLink>
        <NavLink to="/create-xml" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          СОЗДАТЬ XML
        </NavLink>
        <NavLink to="/templates" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          ШАБЛОНЫ
        </NavLink>
      </div>

      <div className={styles.right}>
        <Link to="/login" className={styles.loginLink}>Вход</Link>
        <Link to="/register" className={styles.registerBtn}>Регистрация</Link>
      </div>
    </nav>
  )
}
