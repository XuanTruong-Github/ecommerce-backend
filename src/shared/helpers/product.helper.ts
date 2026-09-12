import slugify from 'slugify';
export function createHandle(text: string) {
  if (!text) return '';
  return slugify(text, {
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
}
export function createSKU(productTitle: string, optionValues?: string[], index?: number): string {
  const prefix = slugify(productTitle).toUpperCase().slice(0, 10); // AO-THUN-CL
  if (!optionValues?.length) {
    return `${prefix}-${Date.now().toString().slice(-4)}`; // AO-THUN-CL-4821
  }
  // S / White -> S-WH
  const variantCode = optionValues.map((v) => v.slice(0, 2).toUpperCase()).join('-');
  return `${prefix}-${variantCode}-${String(index).padStart(3, '0')}`;
}
