import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import { generateXml } from '../api/xmlApi'
import styles from './CreateXML.module.css'

function useList(initial = ['']) {
  const [items, setItems] = useState(initial)
  const add = useCallback(() => setItems((currentItems) => [...currentItems, '']), [])
  const remove = useCallback((i) => {
    setItems((currentItems) => currentItems.filter((_, idx) => idx !== i))
  }, [])
  const change = useCallback((i, val) => {
    setItems((currentItems) => currentItems.map((v, idx) => (idx === i ? val : v)))
  }, [])
  const replace = useCallback((nextItems) => setItems(normalizeList(nextItems)), [])
  return { items, add, remove, change, replace }
}

function normalizeList(items, fallback = ['']) {
  return Array.isArray(items) && items.length > 0 ? items : fallback
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
  const replaceCadastral = cadastral.replace
  const replaceGpzu = gpzu.replace
  const replacePpt = ppt.replace
  const replaceGzk = gzk.replace
  const replaceKrt = krt.replace
  const replacePpm = ppm.replace
  const replaceTeam = team.replace
  const replacePurposes = purposes.replace
  const [fileName, setFileName] = useState('construction-project.xml')
  const [result, setResult] = useState({ xml: '', isValid: false, errors: [] })
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiError, setApiError] = useState('')

  const payload = useMemo(() => ({
    basic: {
      name: basic.name,
      registrationNumber: basic.regNum,
      date: basic.date,
      uuid: basic.uuid,
      address: basic.address,
    },
    organization: {
      name: org.name,
      manager: org.manager,
    },
    workType,
    cadastralNumbers: cadastral.items,
    gpzuNumbers: gpzu.items,
    pptNumbers: ppt.items,
    gzkNumbers: gzk.items,
    krtNumbers: krt.items,
    ppmNumbers: ppm.items,
    teamMembers: team.items,
    functionalPurposes: purposes.items,
  }), [basic, cadastral.items, gpzu.items, gzk.items, krt.items, org, ppm.items, ppt.items, purposes.items, team.items, workType])

  useEffect(() => {
    const storedDraft = sessionStorage.getItem('xmlFormDraft')

    if (!storedDraft) {
      return
    }

    try {
      const draft = JSON.parse(storedDraft)

      setBasic({
        name: draft.basic?.name ?? '',
        regNum: draft.basic?.registrationNumber ?? '',
        date: draft.basic?.date ?? '',
        uuid: draft.basic?.uuid ?? '',
        address: draft.basic?.address ?? '',
      })
      setOrg({
        name: draft.organization?.name ?? '',
        manager: draft.organization?.manager ?? '',
      })
      setWorkType(draft.workType ?? '')
      replaceCadastral(draft.cadastralNumbers)
      replaceGpzu(draft.gpzuNumbers)
      replacePpt(draft.pptNumbers)
      replaceGzk(draft.gzkNumbers)
      replaceKrt(draft.krtNumbers)
      replacePpm(draft.ppmNumbers)
      replaceTeam(draft.teamMembers)
      replacePurposes(draft.functionalPurposes)

      const uploadedFileName = sessionStorage.getItem('uploadedXmlFileName')
      if (uploadedFileName) {
        setFileName(uploadedFileName)
      }
    } catch {
      sessionStorage.removeItem('xmlFormDraft')
    }
  }, [replaceCadastral, replaceGpzu, replaceGzk, replaceKrt, replacePpm, replacePpt, replacePurposes, replaceTeam])

  useEffect(() => {
    sessionStorage.setItem('xmlFormDraft', JSON.stringify(payload))
  }, [payload])

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setIsGenerating(true)
      setApiError('')

      try {
        const generated = await generateXml(payload)
        setResult(generated)
      } catch (error) {
        setApiError(error.message)
      } finally {
        setIsGenerating(false)
      }
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [payload])

  const exportXml = () => {
    if (!result.isValid || !result.xml) {
      return
    }

    const blob = new Blob([result.xml], { type: 'application/xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName.trim() || 'construction-project.xml'
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyXml = async () => {
    if (result.xml) {
      await navigator.clipboard.writeText(result.xml)
    }
  }

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
                <label className={styles.label}>Адрес</label>
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
            <aside className={styles.preview}>
              <div className={styles.previewHeader}>
                <div>
                  <h2 className={styles.previewTitle}>XML</h2>
                  <span className={result.isValid ? styles.validStatus : styles.invalidStatus}>
                    {isGenerating ? 'Проверка...' : result.isValid ? 'Валиден' : 'Есть ошибки'}
                  </span>
                </div>
                <button className={styles.copyBtn} type="button" onClick={copyXml} disabled={!result.xml}>
                  Копировать
                </button>
              </div>

              <div className={styles.exportBlock}>
                <label className={styles.label}>Имя файла</label>
                <input
                  className={styles.input}
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
                <button
                  className={styles.exportBtn}
                  type="button"
                  onClick={exportXml}
                  disabled={!result.isValid}
                >
                  Экспортировать
                </button>
              </div>

              {apiError && <div className={styles.errorBox}>{apiError}</div>}

              {result.errors.length > 0 && (
                <div className={styles.errorList}>
                  {result.errors.map((error, index) => (
                    <div key={`${error.message}-${index}`} className={styles.errorItem}>
                      <strong>Ошибка валидации</strong>
                      <span>{error.message}</span>
                      {(error.lineNumber > 0 || error.linePosition > 0) && (
                        <small>Строка {error.lineNumber}, позиция {error.linePosition}</small>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <pre className={styles.xmlPreview}>{result.xml || 'XML появится после заполнения формы'}</pre>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
