const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5287'

export async function generateXml(payload) {
  const response = await fetch(`${API_BASE_URL}/api/xml/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Не удалось сгенерировать XML')
  }

  return response.json()
}

export async function validateXml(xml) {
  const response = await fetch(`${API_BASE_URL}/api/xml/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ xml }),
  })

  if (!response.ok) {
    throw new Error('Не удалось проверить XML')
  }

  return response.json()
}
