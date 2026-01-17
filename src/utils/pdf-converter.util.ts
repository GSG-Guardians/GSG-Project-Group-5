import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export async function convertDocxToPdf(
  docxPath: string,
  pdfPath: string,
): Promise<void> {
  try {
    // Use LibreOffice directly with proper settings for RTL support
    const outputDir = path.dirname(pdfPath);
    const command = `libreoffice --headless --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --norestore --convert-to pdf:writer_pdf_Export --outdir "${outputDir}" "${docxPath}"`;

    await execAsync(command, { timeout: 30000 }); // 30 second timeout

    // LibreOffice creates the PDF with the same name as DOCX
    const generatedPdfPath = path.join(
      outputDir,
      path.basename(docxPath, '.docx') + '.pdf',
    );

    // Rename if needed
    if (generatedPdfPath !== pdfPath) {
      await fs.rename(generatedPdfPath, pdfPath);
    }
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}
