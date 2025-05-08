import fs from 'fs';
import path from 'path';

export const renderTemplate = (templateName, variables = {}) => {
  const filePath = path.join(
    process.cwd(),
    'views',
    'emails',
    `${templateName}.html`
  );

  let template = fs.readFileSync(filePath, 'utf-8');

  Object.entries(variables).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return template;
};
