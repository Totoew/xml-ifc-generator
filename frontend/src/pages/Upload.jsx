import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import styles from './Upload.module.css'

export default function Upload() {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)

  const handleFile = (f) => {
    if (f) setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <main
        className={`${styles.main} ${dragging ? styles.dragging : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <h1 className={styles.title}>Загрузите XML или IFC файл</h1>
        <p className={styles.subtitle}>
          Загрузите свой XML или IFC файл для их быстрой и<br />качественной генерации
        </p>

        <button className={styles.button} onClick={() => inputRef.current.click()}>
          Выбрать XML / IFC файл
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".xml,.ifc"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file
          ? <p className={styles.fileName}>{file.name}</p>
          : <p className={styles.hint}>Или перетащите файл сюда</p>
        }
      </main>
    </div>
  )
}
