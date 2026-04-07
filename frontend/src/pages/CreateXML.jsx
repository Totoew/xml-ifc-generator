import Navbar from '../components/Navbar'
import styles from './CreateXML.module.css'

export default function CreateXML() {
  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.panels}>
          <div className={styles.panel}>
            <span className={styles.label}>Название</span>
            <div className={styles.placeholder}>Предзаполненная форма</div>
            <button className={styles.button}>Сгенерировать</button>
          </div>

          <div className={styles.panel}>
            <span className={styles.label}>Название_generate</span>
            <div className={styles.placeholder}>Сгенерированный результат</div>
            <button className={styles.button}>Скачать</button>
          </div>
        </div>

        <div className={styles.instruction}>Инструкция</div>
      </main>
    </div>
  )
}
