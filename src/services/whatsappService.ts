import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface WhatsAppMessage {
  id: string;
  labId: string;
  to: string;
  message: string;
  type: 'Report' | 'Reminder' | 'Promotion' | 'Alert' | 'Other';
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed';
  templateName?: string;
  mediaUrl?: string;
  sentAt: string;
  deliveredAt?: string;
  cost: number;
}

const WHATSAPP_COLL = (labId: string) => `labs/${labId}/whatsapp`;

export async function sendWhatsApp(params: {
  labId: string;
  to: string;
  message: string;
  type: WhatsAppMessage['type'];
  templateName?: string;
  mediaUrl?: string;
}): Promise<WhatsAppMessage> {
  const msgData = {
    labId: params.labId,
    to: params.to,
    message: params.message,
    type: params.type,
    status: 'Sent' as const,
    templateName: params.templateName || '',
    mediaUrl: params.mediaUrl || '',
    sentAt: new Date().toISOString(),
    cost: 0.5,
  };

  const docRef = await addDoc(collection(db, WHATSAPP_COLL(params.labId)), msgData);
  return { id: docRef.id, ...msgData };
}

export async function sendReportViaWhatsApp(
  labId: string,
  phone: string,
  patientName: string,
  reportPdfUrl: string
): Promise<WhatsAppMessage> {
  const message = `Dear ${patientName}, your pathology report is ready. Download here: ${reportPdfUrl}`;
  return sendWhatsApp({
    labId,
    to: phone,
    message,
    type: 'Report',
    mediaUrl: reportPdfUrl,
  });
}

export async function getWhatsAppHistory(labId: string): Promise<WhatsAppMessage[]> {
  const q = query(
    collection(db, WHATSAPP_COLL(labId)),
    orderBy('sentAt', 'desc'),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WhatsAppMessage));
}

export async function sendAppointmentReminder(
  labId: string,
  phone: string,
  patientName: string,
  appointmentDate: string
): Promise<WhatsAppMessage> {
  const message = `Reminder: Dear ${patientName}, your appointment is scheduled for ${appointmentDate}. Please visit our lab.`;
  return sendWhatsApp({
    labId,
    to: phone,
    message,
    type: 'Reminder',
    templateName: 'appointment_reminder',
  });
}