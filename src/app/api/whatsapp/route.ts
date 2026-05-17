import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labId, to, message, type, templateName, mediaUrl } = body;

    if (!labId || !to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to send via WhatsApp Cloud API
    let apiStatus = 'Sent';
    let apiError = '';

    if (WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID) {
      try {
        const response = await fetch(
          `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: to.replace(/[^0-9]/g, ''),
              type: 'text',
              text: { body: message },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          apiError = errorData.error?.message || 'WhatsApp API error';
          apiStatus = 'Failed';
        }
      } catch (err: any) {
        apiError = err.message;
        apiStatus = 'Failed';
      }
    } else {
      apiError = 'WhatsApp API not configured';
    }

    // Save to Firestore
    const msgData = {
      labId,
      to,
      message,
      type: type || 'Other',
      status: apiStatus,
      templateName: templateName || '',
      mediaUrl: mediaUrl || '',
      sentAt: new Date().toISOString(),
      cost: apiStatus === 'Sent' ? 0.5 : 0,
      error: apiError || '',
    };

    const docRef = await addDoc(collection(db, `labs/${labId}/whatsapp`), msgData);

    return NextResponse.json({
      success: apiStatus === 'Sent',
      messageId: docRef.id,
      status: apiStatus,
      error: apiError || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const labId = searchParams.get('labId');

    if (!labId) {
      return NextResponse.json(
        { success: false, error: 'labId is required' },
        { status: 400 }
      );
    }

    const q = query(
      collection(db, `labs/${labId}/whatsapp`),
      orderBy('sentAt', 'desc'),
      limit(50)
    );

    const snap = await getDocs(q);
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}