import { useState } from 'react'
import Navbar from '../components/Navbar'
import styles from './CreateIFC.module.css'

const data = {
  Объекты: {
    title: 'Примеры объектов',
    sections: [
      { name: 'Здания', items: ['Описание здания', 'Описание здания'] },
      { name: 'Помещения', items: ['Описание', 'Описание'] },
      { name: 'Элементы', items: ['Описание', 'Описание'] },
    ],
  },
  Типы: {
    title: 'Примеры типов',
    sections: [
      { name: 'Конструкции', items: ['Описание', 'Описание'] },
      { name: 'Системы', items: ['Описание', 'Описание'] },
    ],
  },
  Материалы: {
    title: 'Примеры материалов',
    sections: [
      { name: 'Бетон', items: ['Описание', 'Описание'] },
      { name: 'Металл', items: ['Описание', 'Описание'] },
    ],
  },
}

export default function CreateIFC() {
  const [activeTab, setActiveTab] = useState('Объекты')
  const current = data[activeTab]

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.tabs}>
        {Object.keys(data).map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className={styles.main}>
        <div className={styles.left}>
          <h2 className={styles.leftTitle}>{current.title}</h2>
          <div className={styles.sections}>
            {current.sections.map((section) => (
              <div key={section.name} className={styles.section}>
                <span className={styles.sectionName}>{section.name}</span>
                <div className={styles.cards}>
                  {section.items.map((desc, i) => (
                    <div key={i} className={styles.card}>
                      <div className={styles.cardImage}>Картинка</div>
                      <span className={styles.cardDesc}>{desc}</span>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.canvas}>
            <span className={styles.canvasText}>Тут будут отображаться элементы</span>
          </div>
          <div className={styles.generateRow}>
            <button className={styles.button}>Сгенерировать</button>
          </div>
        </div>
      </main>

      <div className={styles.xsdSection}>
        <div className={styles.xsdCard}>
          <span className={styles.xsdTitle}>XSD</span>
          <div className={styles.xsdPlaceholder} />
        </div>
      </div>
    </div>
  )
}
