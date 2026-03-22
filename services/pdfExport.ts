import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CodeArtifact } from '../types';

export const generateArtifactPDF = async (artifact: CodeArtifact): Promise<void> => {
  // Create a temporary container for rendering
  const pdfContainer = document.createElement('div');
  pdfContainer.style.position = 'absolute';
  pdfContainer.style.left = '-9999px';
  pdfContainer.style.top = '0';
  pdfContainer.style.width = '800px';
  pdfContainer.style.padding = '60px';
  pdfContainer.style.backgroundColor = '#0a0a0a';
  pdfContainer.style.fontFamily = 'Georgia, serif';
  pdfContainer.style.color = '#f2eecb';
  document.body.appendChild(pdfContainer);

  // Build the PDF content HTML
  pdfContainer.innerHTML = `
    <div style="width: 100%; min-height: 600px; background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%); padding: 50px; position: relative; box-sizing: border-box;">
      
      <!-- Corner Brackets - Viewfinder Style -->
      <div style="position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; border-top: 2px solid #555; border-left: 2px solid #555;"></div>
      <div style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-top: 2px solid #555; border-right: 2px solid #555;"></div>
      <div style="position: absolute; bottom: 20px; left: 20px; width: 40px; height: 40px; border-bottom: 2px solid #555; border-left: 2px solid #555;"></div>
      <div style="position: absolute; bottom: 20px; right: 20px; width: 40px; height: 40px; border-bottom: 2px solid #555; border-right: 2px solid #555;"></div>
      
      <!-- Large Decorative Quote Mark -->
      <div style="font-size: 120px; color: #3a3a3a; line-height: 0.5; margin-bottom: 20px; font-family: Georgia, serif;">"</div>
      
      <!-- Artifact Quote Text -->
      <div style="font-size: 32px; font-family: Georgia, serif; line-height: 1.4; color: #fffef5; text-align: center; margin: 40px 0; padding: 0 20px; text-shadow: 0 0 20px rgba(242,238,203,0.1);">
        ${artifact.extractedComment}
      </div>
      
      <!-- Closing Quote Mark -->
      <div style="font-size: 120px; color: #3a3a3a; line-height: 0.5; text-align: right; margin-top: 20px; font-family: Georgia, serif;">"</div>
      
      <!-- Metadata Section -->
      <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #2a2a2a; text-align: center;">
        <div style="font-family: 'Courier New', monospace; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 15px;">
          Artifact Metadata
        </div>
        <div style="font-family: 'Courier New', monospace; font-size: 12px; color: #666; letter-spacing: 2px; text-transform: uppercase;">
          <span style="color: #a0937d;">Repo:</span> ${artifact.repoName} &nbsp;&bull;&nbsp;
          <span style="color: #a0937d;">File:</span> ${artifact.fileName} &nbsp;&bull;&nbsp;
          <span style="color: #a0937d;">Language:</span> ${artifact.language}
        </div>
        <div style="font-family: 'Courier New', monospace; font-size: 12px; color: #666; letter-spacing: 2px; text-transform: uppercase; margin-top: 10px;">
          <span style="color: #a0937d;">Date:</span> ${artifact.timestamp} &nbsp;&bull;&nbsp;
          <span style="color: #a0937d;">Mood:</span> ${artifact.mood}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="position: absolute; bottom: 30px; left: 0; right: 0; text-align: center;">
        <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 4px;">
          Digital Archaeology Division / ReadmeRouletter
        </div>
      </div>
      
      <!-- Certificate ID -->
      <div style="position: absolute; top: 30px; right: 70px; font-family: 'Courier New', monospace; font-size: 8px; color: #333; text-transform: uppercase; letter-spacing: 2px;">
        ID: ${artifact.id.slice(0, 8)}
      </div>
    </div>
  `;

  // Wait for fonts to render
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    // Capture the container as a canvas
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a0a0a',
      logging: false,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`readme-artifact-${artifact.id.slice(0, 8)}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(pdfContainer);
  }
};
