import { useState } from 'react'
import styles from './Login.module.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Авторизация</span>
      </header>

      <div className={styles.card}>
        <div className={styles.logo}>Лого</div>

        <h1 className={styles.title}>Вход в вашу учётную запись</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 8l10 6 10-6" />
            </svg>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Эл. почта"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <a href="#" className={styles.forgotLink}>Забыли свой пароль?</a>

          <button className={styles.button} type="submit">Вход</button>
        </form>

        <p className={styles.registerText}>
          У вас нет учётной записи?{' '}
          <a href="/register" className={styles.link}>Создать учётную запись</a>
        </p>
      </div>
    </div>
  )
}
