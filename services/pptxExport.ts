import pptxgen from 'pptxgenjs';
import { CodeArtifact } from '../types';

const COLORS = {
  background: '0a0a0a',
  quoteMark: '2d2d2d',
  text: 'f2eecb',
  metadata: '8a8a7a',
  slideNum: '4a4a4a',
};

export function exportHistoryAsPPT(history: CodeArtifact[], filename = 'readme-roulette-archive.pptx') {
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';
  pptx.title = 'ReadmeRoulette Archive';
  pptx.author = 'ReadmeRoulette';

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: COLORS.background };

  // Large decorative quote mark
  titleSlide.addText('"', {
    x: 1.5,
    y: 1.2,
    cx: 7,
    cy: 2,
    fontSize: 200,
    color: COLORS.quoteMark,
    fontFace: 'Georgia',
  });

  // Title
  titleSlide.addText('ReadmeRoulette Archive', {
    x: 0.5,
    y: 2.2,
    cx: 9,
    cy: 1,
    fontSize: 40,
    color: COLORS.text,
    fontFace: 'Georgia',
    align: 'center',
  });

  // Date
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  titleSlide.addText(dateStr, {
    x: 0.5,
    y: 3.4,
    cx: 9,
    cy: 0.5,
    fontSize: 16,
    color: COLORS.metadata,
    fontFace: 'Georgia',
    align: 'center',
  });

  // Artifact count
  titleSlide.addText(`${history.length} artifacts archived`, {
    x: 0.5,
    y: 4.2,
    cx: 9,
    cy: 0.5,
    fontSize: 14,
    color: COLORS.metadata,
    fontFace: 'Georgia',
    align: 'center',
  });

  // Content slides
  history.forEach((artifact, index) => {
    const slide = pptx.addSlide();
    slide.background = { color: COLORS.background };

    // Large decorative quote mark
    slide.addText('"', {
      x: 0.5,
      y: 0.3,
      cx: 2,
      cy: 1.5,
      fontSize: 180,
      color: COLORS.quoteMark,
      fontFace: 'Georgia',
    });

    // Artifact quote
    slide.addText(artifact.extractedComment, {
      x: 1.2,
      y: 1.2,
      cx: 7.6,
      cy: 2,
      fontSize: 22,
      color: COLORS.text,
      fontFace: 'Georgia',
      italic: true,
      valign: 'top',
    });

    // Metadata line
    const metadata = `${artifact.repoName} / ${artifact.fileName} / ${artifact.language} / ${artifact.mood}`;
    slide.addText(metadata, {
      x: 1.2,
      y: 3.5,
      cx: 7.6,
      cy: 0.4,
      fontSize: 11,
      color: COLORS.metadata,
      fontFace: 'Georgia',
    });

    // Date
    slide.addText(artifact.timestamp, {
      x: 1.2,
      y: 3.95,
      cx: 7.6,
      cy: 0.4,
      fontSize: 10,
      color: COLORS.metadata,
      fontFace: 'Georgia',
    });

    // Slide number in bottom right corner
    slide.addText(`${index + 1}`, {
      x: 8.8,
      y: 5.1,
      cx: 0.8,
      cy: 0.4,
      fontSize: 12,
      color: COLORS.slideNum,
      fontFace: 'Georgia',
      align: 'right',
    });
  });

  pptx.writeFile({ fileName: filename });
}
