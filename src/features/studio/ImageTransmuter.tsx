import { Download, Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp'

const extensions: Record<OutputFormat, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

export function ImageTransmuter() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [format, setFormat] = useState<OutputFormat>('image/webp')
  const [quality, setQuality] = useState(88)
  const [status, setStatus] = useState('Esperando una imagen local.')

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const convert = async () => {
    if (!file) return
    try {
      const bitmap = await createImageBitmap(file)
      if (bitmap.width * bitmap.height > 20_000_000) {
        bitmap.close()
        setStatus('Límite local: 20 megapíxeles. Reduce la imagen antes de convertir.')
        return
      }
      const sourceWidth = bitmap.width
      const sourceHeight = bitmap.height
      const canvas = document.createElement('canvas')
      canvas.width = sourceWidth
      canvas.height = sourceHeight
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas 2D no disponible')
      if (format === 'image/jpeg') {
        context.fillStyle = '#05060c'
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      context.drawImage(bitmap, 0, 0)
      bitmap.close()
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('El navegador no pudo codificar el formato.')), format, quality / 100)
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'belentani-image'
      anchor.href = url
      anchor.download = `${baseName}.${extensions[format]}`
      anchor.click()
      URL.revokeObjectURL(url)
      setStatus(`${sourceWidth} × ${sourceHeight} convertido en este dispositivo.`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Conversión no disponible para este archivo.')
    }
  }

  return (
    <section className="image-transmuter" aria-labelledby="image-transmuter-title">
      <header>
        <span>INSTRUMENTO 010 / MOTOR REAL</span>
        <h3 id="image-transmuter-title">Transmutador de formato.</h3>
        <p>Convierte PNG, JPEG o WebP sin subir el original. El archivo vive en memoria y desaparece al salir.</p>
      </header>
      <div className="image-transmuter__controls">
        <label htmlFor="transmuter-file">
          <span>Imagen de origen</span>
          <input
            id="transmuter-file"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <label htmlFor="transmuter-format">
          <span>Formato de salida</span>
          <select id="transmuter-format" value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}>
            <option value="image/webp">WebP</option>
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
          </select>
        </label>
        <label htmlFor="transmuter-quality">
          <span>Calidad {quality}%</span>
          <input id="transmuter-quality" type="range" min="50" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} disabled={format === 'image/png'} />
        </label>
        <button type="button" onClick={convert} disabled={!file}><Download size={16} />Convertir y descargar</button>
      </div>
      <div className="image-transmuter__preview">
        {previewUrl ? <img src={previewUrl} alt={`Vista previa de ${file?.name ?? 'imagen local'}`} /> : <ImageIcon size={42} aria-hidden="true" />}
        <p aria-live="polite">{status}</p>
      </div>
    </section>
  )
}
