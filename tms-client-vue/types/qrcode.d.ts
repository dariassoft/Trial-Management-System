// Declaraciones de tipo para el módulo qrcode (v1.x)
declare module 'qrcode' {
  interface QRCodeToCanvasOptions {
    errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'
    version?: number
    margin?: number
    scale?: number
    small?: boolean
    width?: number
    color?: { dark?: string; light?: string }
    type?: string
  }

  interface QRCodeToDataURLOptions extends QRCodeToCanvasOptions {
    type?: 'image/png' | 'image/jpeg' | 'image/webp'
    rendererOpts?: { quality?: number }
  }

  interface QRCodeToStringOptions extends QRCodeToCanvasOptions {
    type?: 'utf8' | 'svg' | 'terminal'
  }

  interface QRCodeSegment {
    data: string | Buffer | readonly number[]
    mode?: 'numeric' | 'alphanumeric' | 'byte' | 'kanji'
  }

  type QRCodeErrorCorrectionLevel = 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H'

  function toCanvas(
    canvas: HTMLCanvasElement | string,
    text: string | QRCodeSegment[],
    options?: QRCodeToCanvasOptions,
    callback?: (error: Error | null | undefined) => void,
  ): Promise<void>

  function toCanvas(
    text: string | QRCodeSegment[],
    options?: QRCodeToCanvasOptions,
    callback?: (error: Error | null | undefined, canvas: HTMLCanvasElement) => void,
  ): Promise<HTMLCanvasElement>

  function toDataURL(
    canvas: HTMLCanvasElement,
    text: string | QRCodeSegment[],
    options?: QRCodeToDataURLOptions,
  ): Promise<string>

  function toDataURL(
    text: string | QRCodeSegment[],
    options?: QRCodeToDataURLOptions,
    callback?: (error: Error | null | undefined, url: string) => void,
  ): Promise<string>

  function toString(
    text: string | QRCodeSegment[],
    options?: QRCodeToStringOptions,
    callback?: (error: Error | null | undefined, string: string) => void,
  ): Promise<string>

  function toFile(
    path: string,
    text: string | QRCodeSegment[],
    options?: QRCodeToCanvasOptions,
    callback?: (error: Error | null | undefined) => void,
  ): Promise<void>

  function toFileStream(
    stream: NodeJS.WritableStream,
    text: string | QRCodeSegment[],
    options?: QRCodeToCanvasOptions,
  ): void

  function create(
    text: string | QRCodeSegment[],
    options?: QRCodeToCanvasOptions,
  ): object
}

