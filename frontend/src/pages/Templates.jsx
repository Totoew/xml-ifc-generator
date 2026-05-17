import Navbar from '../components/Navbar'
import styles from './Templates.module.css'

const xmlTemplates = Array(5).fill('Описание шаблона')

function TemplateCard({ description }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardText}>{description}</span>
    </div>
  )
}

export default function Templates() {
  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Шаблоны XML</h2>
          <div className={styles.grid}>
            {xmlTemplates.map((desc, i) => (
              <TemplateCard key={i} description={desc} />
            ))}
          </div>
          <div className={styles.moreRow}>
            <button className={styles.moreBtn}>Ещё</button>
          </div>
        </section>

      </main>
    </div>
  )
}
