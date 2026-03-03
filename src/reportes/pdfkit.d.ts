declare module 'pdfkit' {
  class PDFDocument {
    constructor(options?: any);
    fontSize(size: number): this;
    font(name: string): this;
    text(text: string, x?: number | string, y?: number, options?: any): this;
    moveDown(lines?: number): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    stroke(): this;
    addPage(options?: any): this;
    end(): void;
    on(event: string, callback: (...args: any[]) => void): this;
    fillColor(color: string): this;
    getY(): number;
  }
  export = PDFDocument;
}
