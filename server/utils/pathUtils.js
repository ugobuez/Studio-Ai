import path from 'path';

/**
 * Converts an absolute file path from the AI service to a relative URL that the backend can serve.
 * @param {string} filePath Absolute file path
 * @returns {string} Relative URL (e.g., /outputs/...)
 */
export const pathToUrl = (filePath) => {
  if (!filePath) return filePath;
  
  // If it's already a URL, return it
  if (filePath.startsWith('http') || filePath.startsWith('/')) {
    // But check if it's an absolute path starting with /
    if (!filePath.startsWith('/home')) {
        return filePath;
    }
  }

  const outputsDir = process.env.AI_SERVICE_OUTPUTS_DIR || '/home/team/shared/beatforge-ai/ai-service/outputs';
  
  if (filePath.includes(outputsDir)) {
    const relativePath = filePath.split(outputsDir)[1];
    return `/outputs${relativePath.replace(/\\/g, '/')}`;
  }
  
  const uploadsDir = process.env.UPLOAD_DIR || './uploads';
  const absoluteUploadsDir = path.resolve(uploadsDir);
  
  if (filePath.includes(absoluteUploadsDir)) {
      const relativePath = filePath.split(absoluteUploadsDir)[1];
      return `/uploads${relativePath.replace(/\\/g, '/')}`;
  }

  return filePath;
};
