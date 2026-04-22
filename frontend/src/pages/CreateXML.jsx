import { useState } from 'react'
import Navbar from '../components/Navbar'
import styles from './CreateXML.module.css'

function useList(initial = ['']) {
  const [items, setItems] = useState(initial)
  const add = () => setItems([...items, ''])
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i))
  const change = (i, val) => setItems(items.map((v, idx) => (idx === i ? val : v)))
  return { items, add, remove, change }
}

function RepeatableField({ label, hint, items, onAdd, onRemove, onChange }) {
  return (
    <div className={styles.section}>
      {items.map((val, i) => (
        <div key={i} className={styles.fieldGroup}>
          <label className={styles.label}>{label}</label>
          <div className={styles.rowWithBtn}>
            <input
              className={styles.input}
              value={val}
              onChange={(e) => onChange(i, e.target.value)}
            />
            <button className={styles.deleteBtn} onClick={() => onRemove(i)}>Удалить</button>
          </div>
          <span className={styles.hint}>{hint}</span>
        </div>
      ))}
      <button className={styles.addBtn} onClick={onAdd}>Добавить +</button>
    </div>
  )
}

export default function CreateXML() {
  const [basic, setBasic] = useState({ name: '', regNum: '', date: '', uuid: '', address: '' })
  const cadastral = useList(['', ''])
  const gpzu = useList([''])
  const ppt = useList([''])
  const gzk = useList([''])
  const krt = useList([''])
  const ppm = useList([''])
  const [org, setOrg] = useState({ name: '', manager: '' })
  const team = useList(['', ''])
  const [workType, setWorkType] = useState('')
  const purposes = useList(['', ''])

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Онлайн генератор XML</h1>

          <div className={styles.layout}>
            {/* FORM */}
            <div className={styles.formCard}>

              {/* Основная информация */}
              <div className={styles.sectionHeader}>Основная информация</div>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Наименование объекта</label>
                  <input className={styles.input} value={basic.name} onChange={e => setBasic({ ...basic, name: e.target.value })} />
                  <span className={styles.hint}>название объекта для идентификации</span>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Регистрационный номер</label>
                  <input className={styles.input} value={basic.regNum} onChange={e => setBasic({ ...basic, regNum: e.target.value })} />
                  <span className={styles.hint}>номер регистрации/учёта (если используется)</span>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Дата</label>
                  <input className={styles.input} value={basic.date} onChange={e => setBasic({ ...basic, date: e.target.value })} />
                  <span className={styles.hint}>дата формирования</span>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>UUID (Уникальный ID объекта)</label>
                  <input className={styles.input} value={basic.uuid} onChange={e => setBasic({ ...basic, uuid: e.target.value })} />
                  <span className={styles.hint}>внутренний уникальный идентификатор (если нужен)</span>
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Адресс</label>
                <input className={`${styles.input} ${styles.fullWidth}`} value={basic.address} onChange={e => setBasic({ ...basic, address: e.target.value })} />
                <span className={styles.hint}>адрес/описание местоположения объекта</span>
              </div>

              {/* Кадастровый номер */}
              <div className={styles.sectionHeader}>Кадастровый номер</div>
              <RepeatableField label="Кадастровый номер" hint="кадастровый номер участка/объекта"
                items={cadastral.items} onAdd={cadastral.add} onRemove={cadastral.remove} onChange={cadastral.change} />

              {/* ГПЗУ номер */}
              <div className={styles.sectionHeader}>ГПЗУ номер</div>
              <RepeatableField label="ГПЗУ номер" hint="номер(а) ГПЗУ"
                items={gpzu.items} onAdd={gpzu.add} onRemove={gpzu.remove} onChange={gpzu.change} />

              {/* ППТ номер */}
              <div className={styles.sectionHeader}>ППТ номер</div>
              <RepeatableField label="ППТ номер" hint="номер(а) ППТ"
                items={ppt.items} onAdd={ppt.add} onRemove={ppt.remove} onChange={ppt.change} />

              {/* ГЗК номер */}
              <div className={styles.sectionHeader}>ГЗК номер</div>
              <RepeatableField label="ГЗК номер" hint="номер(а) ГЗК"
                items={gzk.items} onAdd={gzk.add} onRemove={gzk.remove} onChange={gzk.change} />

              {/* КРТ номер */}
              <div className={styles.sectionHeader}>КРТ номер</div>
              <RepeatableField label="КРТ номер" hint="номер(а) КРТ"
                items={krt.items} onAdd={krt.add} onRemove={krt.remove} onChange={krt.change} />

              {/* ППМ номер */}
              <div className={styles.sectionHeader}>ППМ номер</div>
              <RepeatableField label="ППМ номер" hint="номер(а) ППМ"
                items={ppm.items} onAdd={ppm.add} onRemove={ppm.remove} onChange={ppm.change} />

              {/* Проектная информация */}
              <div className={styles.sectionHeader}>Проектная информация</div>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Наименование организации</label>
                  <input className={styles.input} value={org.name} onChange={e => setOrg({ ...org, name: e.target.value })} />
                  <span className={styles.hint}>наименование проектной организации</span>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Ответственный руководитель</label>
                  <input className={styles.input} value={org.manager} onChange={e => setOrg({ ...org, manager: e.target.value })} />
                  <span className={styles.hint}>ответственный руководитель</span>
                </div>
              </div>

              {/* Состав команды */}
              <div className={styles.sectionHeader}>Состав команды</div>
              <RepeatableField label="Участник" hint="участник команды"
                items={team.items} onAdd={team.add} onRemove={team.remove} onChange={team.change} />

              {/* Вид работы */}
              <div className={styles.sectionHeader}>Вид работы</div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Вид работы</label>
                <select className={`${styles.input} ${styles.select}`} value={workType} onChange={e => setWorkType(e.target.value)}>
                  <option value="">Выберите</option>
                  <option value="new">Новое строительство</option>
                  <option value="recon">Реконструкция</option>
                  <option value="repair">Капитальный ремонт</option>
                </select>
                <span className={styles.hint}>тип работ по объекту</span>
              </div>

              {/* Функциональные назначения */}
              <div className={styles.sectionHeader}>Функциональные назначения</div>
              <RepeatableField label="Назначение" hint="функциональное назначение объекта/части"
                items={purposes.items} onAdd={purposes.add} onRemove={purposes.remove} onChange={purposes.change} />

            </div>

            {/* PREVIEW */}
            <div className={styles.preview} />
          </div>
        </div>
      </main>
    </div>
  )
}
