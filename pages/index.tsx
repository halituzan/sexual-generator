import { useState, useRef } from 'react'
import ColorThief from 'colorthief'
import { useDropzone } from 'react-dropzone'
import html2canvas from 'html2canvas'
import Link from 'next/link'

export default function Home() {
    const [image, setImage] = useState<string | null>(null)
    const [colors, setColors] = useState<string[]>([])
    const [text, setText] = useState('')
    const imageRef = useRef<HTMLImageElement>(null)
    const resultRef = useRef<HTMLDivElement>(null)
    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = async (event: any) => {
            if (event.target?.result) {
                const img = new Image()
                img.crossOrigin = "anonymous"

                img.onload = () => {
                    const colorThief = new ColorThief()
                    const palette = colorThief.getPalette(img, 5)
                    const hexColors = palette.map((color: number[]) =>
                        `#${color[0].toString(16).padStart(2, '0')}${color[1].toString(16).padStart(2, '0')}${color[2].toString(16).padStart(2, '0')}`
                    )
                    setColors(hexColors)
                    setImage(event.target.result as string)
                }

                img.src = event.target.result as string
            }
        }

        reader.readAsDataURL(file)
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        }
    })

    const handleSave = async () => {
        if (resultRef.current) {
            try {
                const canvas = await html2canvas(resultRef.current)
                const link = document.createElement('a')
                link.download = `${text || 'color-palette'}.jpg`
                link.href = canvas.toDataURL('image/jpeg')
                link.click()
            } catch (error) {
                console.error('Görüntü kaydedilirken hata oluştu:', error)
            }
        }
    }

    return (
        <div className="min-h-screen  flex flex-col items-between">
            <div className="max-w-4xl mx-auto p-8 flex-1">
                <div className="mb-6">
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer">
                        <input {...getInputProps()} />
                        <p>Görseli buraya sürükleyin veya tıklayarak seçin</p>
                    </div>
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Metin girin"
                        className="w-full p-2 border rounded"
                    />
                </div>

                {image && (
                    <>
                        <div ref={resultRef} className="flex gap-8 mb-6 p-10">
                            <div className="w-1/2">
                                <img
                                    ref={imageRef}
                                    src={image}
                                    alt="Yüklenen görsel"
                                    className="w-full rounded-lg"
                                    crossOrigin="anonymous"
                                />
                            </div>
                            <div className="w-1/2 flex flex-col justify-center items-center">
                                <div className="w-full">
                                    {colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="h-16 min-w-fit md:min-w-[400px] min-h-16"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                {text && (
                                    <div className="mt-4 text-2xl font-bold text-center">
                                        {text}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Görseli Kaydet
                        </button>
                    </>
                )}
            </div>
            <footer className='bg-blue-600 w-full h-10 flex gap-2 items-center p-2 text-white'>
                <Link href={"https://halituzan.com"} target='_blank' className='hover:text-rose-300'>halituzan.com</Link>
                <Link href={"https://x.com/uzandev"} target='_blank' className='hover:text-rose-300'>twitter</Link>
                <Link href={"https://github.com/halituzan"} target='_blank' className='hover:text-rose-300'>github</Link>
            </footer>
        </div>
    )
} 