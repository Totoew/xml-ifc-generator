import { useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { validateXml } from '../api/xmlApi'
import styles from './Upload.module.css'

export default function Upload() {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [xml, setXml] = useState('')
  const [validation, setValidation] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (selectedFile) => {
    if (!selectedFile) {
      return
    }

    setFile(selectedFile)
    setXml('')
    setValidation(null)
    setError('')

    if (!selectedFile.name.toLowerCase().endsWith('.xml')) {
      setError('Можно загрузить только XML-файл.')
      return
    }

    setIsChecking(true)

    try {
      const text = await selectedFile.text()
      const result = await validateXml(text)

      setXml(text)
      setValidation(result)

      if (result.isValid) {
        sessionStorage.setItem('uploadedXmlDraft', text)
        sessionStorage.setItem('uploadedXmlFileName', selectedFile.name)
      }
    } catch (validationError) {
      setError(validationError.message)
    } finally {
      setIsChecking(false)
    }
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
        <h1 className={styles.title}>Загрузите XML-файл</h1>
        <p className={styles.subtitle}>
          Файл будет проверен по XSD-схеме перед дальнейшей работой
        </p>

        <button className={styles.button} onClick={() => inputRef.current.click()}>
          Выбрать XML-файл
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".xml,application/xml,text/xml"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {!file && <p className={styles.hint}>Или перетащите файл сюда</p>}

        {file && (
          <section className={styles.resultPanel}>
            <div className={styles.resultHeader}>
              <div>
                <p className={styles.fileName}>{file.name}</p>
                <span className={styles.fileMeta}>
                  {(file.size / 1024).toFixed(1)} КБ
                </span>
              </div>

              <span className={validation?.isValid ? styles.validBadge : styles.invalidBadge}>
                {isChecking ? 'Проверка...' : validation?.isValid ? 'XML валиден' : 'Есть ошибки'}
              </span>
            </div>

            {error && <div className={styles.errorBox}>{error}</div>}

            {validation?.errors?.length > 0 && (
              <div className={styles.errorList}>
                {validation.errors.map((validationError, index) => (
                  <div key={`${validationError.message}-${index}`} className={styles.errorItem}>
                    <strong>Ошибка валидации</strong>
                    <span>{validationError.message}</span>
                    {(validationError.lineNumber > 0 || validationError.linePosition > 0) && (
                      <small>
                        Строка {validationError.lineNumber}, позиция {validationError.linePosition}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            )}

            {xml && <pre className={styles.preview}>{xml}</pre>}
          </section>
        )}
      </main>
    </div>
  )
}
