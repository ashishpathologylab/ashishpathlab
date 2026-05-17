export interface LetterheadElement {
  id: string;
  type: 'text' | 'logo' | 'line' | 'rect' | 'circle' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  alignment?: 'left' | 'center' | 'right';
  rotation?: number;
  opacity?: number;
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  borderRadius?: number;
  zIndex?: number;
  locked?: boolean;
}

export interface Letterhead {
  id: string;
  labId: string;
  name: string;
  elements: LetterheadElement[];
  width: number;
  height: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  metadata?: {
    labName?: string;
    labAddress?: string;
    labPhone?: string;
    labEmail?: string;
    logoUrl?: string;
    footer?: string;
    showQR?: boolean;
    showSignature?: boolean;
  };
}

export interface LetterheadFormData {
  name: string;
  elements: LetterheadElement[];
  width?: number;
  height?: number;
  isDefault?: boolean;
  metadata?: Letterhead['metadata'];
}

export const DEFAULT_LETTERHEAD_ELEMENTS: LetterheadElement[] = [
  {
    id: 'header_lab_name',
    type: 'text',
    x: 50,
    y: 30,
    width: 500,
    height: 40,
    content: 'Your Lab Name',
    fontSize: 24,
    fontColor: '#1e3a5f',
    fontFamily: 'Inter',
    bold: true,
    alignment: 'center',
    zIndex: 1,
  },
  {
    id: 'header_address',
    type: 'text',
    x: 50,
    y: 65,
    width: 500,
    height: 20,
    content: '123, Lab Street, City - 000000',
    fontSize: 10,
    fontColor: '#64748b',
    alignment: 'center',
    zIndex: 1,
  },
];