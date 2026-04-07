import { useState } from 'react'
import styles from './Register.module.css'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>Лого</div>

        <h1 className={styles.title}>Создание учётной записи</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Имя"
              value={form.name}
              onChange={handleChange}
            />
          </div>

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

          <button className={styles.button} type="submit">Регистрация</button>
        </form>

        <p className={styles.loginText}>
          Вы уже зарегистрированы? <a href="/login" className={styles.link}>Войти</a>
        </p>

        <p className={styles.terms}>
          При создании учётной записи вы соглашаетесь с{' '}
          <a href="#" className={styles.link}>Условиями предоставления услуг</a>{' '}
          и <a href="#" className={styles.link}>Политикой конфиденциальности</a>
        </p>
      </div>
    </div>
  )
}
