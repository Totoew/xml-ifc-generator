import styles from './Dashboard.module.css'

const features = [
  'Генерация XML',
  'Генерация XML',
  'Генерация XML',
]

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.top}>
          <h1 className={styles.title}>Генератор XML / IFC</h1>
        </div>

        <div className={styles.main}>
          <p className={styles.subtitle}>Автоматическая генерация XML и IFC файлов</p>

          <div className={styles.actions}>
            <button className={styles.button}>Создать файл XML &gt;</button>
            <button className={styles.button}>Создать файл IFC &gt;</button>
          </div>
        </div>

        <div className={styles.footer}>
          <ul className={styles.featureList}>
            {features.map((f, i) => (
              <li key={i} className={styles.featureItem}>
                <svg className={styles.check} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
