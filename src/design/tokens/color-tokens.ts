// Generated from react18-ssrTest/color-tokens.json
// Tailwind v4 integration: semantic + scale tokens
// Usage examples:
//   className="bg-primary text-on-primary"
//   className="text-blue-500 hover:bg-success-container-1"
// For scale groups (blue/gray/green/orange/purple/red) we expose numeric shades.

export const colorTokens = {
  error: '#BC0000',
  'error-container-1': '#FDF2F2',
  'error-container-2': '#FCE1E1',
  'error-container-3': '#FACFCF',
  'error-outline': '#FACFCF',
  'error-variant-1': '#EC5555',
  'error-variant-2': '#F38282',
  focus: '#1890D2',
  'focus-variant-1': '#076193',
  'inverse-surface': '#494949',
  'inverse-surface-variant': '#898989',
  negative: '#1D9C58',
  neutral: '#5C5C5C',
  'neutral-container-1': '#E7E7E7',
  'neutral-container-2': '#D9D9D9',
  'neutral-outline': '#D9D9D9',
  'neutral-variant-1': '#898989',
  'neutral-variant-2': '#A3A3A3',
  'on-error': '#FFFFFF',
  'on-inverse-surface': '#FFFFFF',
  'on-neutral': '#FFFFFF',
  'on-primary': '#FFFFFF',
  'on-purple': '#FFFFFF',
  'on-read-only': '#FFFFFF',
  'on-secondary': '#FFFFFF',
  'on-secondary-container': '#1890D2',
  'on-secondary-container-hover': '#076193',
  'on-success': '#FFFFFF',
  'on-surface': '#373737',
  'on-surface-variant': '#707070',
  'on-warning': '#FFFFFF',
  outline: '#898989',
  'outline-1': '#F5F5F5',
  'outline-2': '#E7E7E7',
  'outline-3': '#BDBDBD',
  'outline-4': '#FFFFFF',
  'outline-5': '#D9D9D9',
  'outline-hover': '#5C5C5C',
  'overlay-1': '#000000',
  'overlay-2': '#000000',
  'overlay-3': '#000000',
  'overlay-4': '#FFFFFF',
  positive: '#DD1B1B',
  primary: '#02293D',
  'primary-container-disabled': '#E7E7E7',
  'primary-disabled': '#BDBDBD',
  'purple-container-1': '#E3E6FF',
  'purple-container-2': '#D3D7FF',
  'purple-outline': '#D3D7FF',
  'purple-variant': '#757EEC',
  'read-only': '#898989',
  secondary: '#1890D2',
  'secondary-container': '#E9F6FE',
  'secondary-variant': '#35ADED',
  steady: '#707070',
  success: '#0A6A36',
  'success-container-1': '#E9F8F0',
  'success-container-2': '#CBEFDC',
  'success-container-3': '#ADE6C7',
  'success-outline': '#ADE6C7',
  'success-variant-1': '#1D9C58',
  'success-variant-2': '#3BB875',
  surface: '#F5F5F5',
  'surface-1': '#FFFFFF',
  'surface-1-disabled': '#F5F5F5',
  'surface-2': '#FFFFFF',
  'surface-3': '#F5F5F5',
  'surface-4': '#E7E7E7',
  'surface-5': '#BDBDBD',
  'table-collapse': '#F5F5F5',
  'table-main-category': '#FFFFFF',
  'table-row': '#FFFFFF',
  'table-subcategory': '#F5F5F5',
  'table-title': '#E7E7E7',
  'table-total': '#E7E7E7',
  warning: '#D56C00',
  'warning-container-1': '#FFF3E6',
  'warning-container-2': '#FFE2C2',
  'warning-container-3': '#FFD19D',
  'warning-outline': '#FFD19D',
  'warning-variant-1': '#944600',
  'warning-variant-2': '#F28815',
};

export const colorScales = {
  blue: {"100":"#E9F6FE","150":"#CAECFF","200":"#AAE1FF","300":"#67C7FB","400":"#35ADED","500":"#1890D2","600":"#0C76B0","700":"#076193","800":"#044D75","900":"#033A59","1000":"#02293D"},
  gray: {"0":"#FFFFFF","100":"#F5F5F5","150":"#E7E7E7","200":"#D9D9D9","300":"#BDBDBD","400":"#A3A3A3","500":"#898989","600":"#707070","700":"#5C5C5C","800":"#494949","900":"#373737","1000":"#262626","1100":"#000000"},
  green: {"100":"#E9F8F0","150":"#CBEFDC","200":"#ADE6C7","300":"#6ED09B","400":"#3BB875","500":"#1D9C58","600":"#0F8144","700":"#0A6A36","800":"#06542A","900":"#044020","1000":"#032C16"},
  orange: {"100":"#FFF3E6","150":"#FFE2C2","200":"#FFD19D","300":"#FFAB50","400":"#F28815","500":"#D56C00","600":"#B25700","700":"#944600","800":"#763700","900":"#592A00","1000":"#3F1D00"},
  purple: {"100":"#F3F4FF","150":"#E3E6FF","200":"#D3D7FF","300":"#B2B8FF","400":"#929BFE","500":"#757EEC","600":"#5E66CC","700":"#4C53AC","800":"#3C418A","900":"#2D3169","1000":"#1F2249"},
  red: {"100":"#FDF2F2","150":"#FCE1E1","200":"#FACFCF","300":"#F7A9A9","400":"#F38282","500":"#EC5555","600":"#DD1B1B","700":"#BC0000","800":"#970000","900":"#750000","1000":"#550000"},
};

// Merge helper to produce Tailwind colors object structure
export function buildTailwindColors() {
  const semantic = { ...colorTokens };
  const scales: Record<string, Record<string,string>> = { ...colorScales };
  return { ...semantic, ...scales };
}

export type SemanticColorKey = keyof typeof colorTokens;
