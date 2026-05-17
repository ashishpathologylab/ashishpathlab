import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const labId = searchParams.get('labId');
    const status = searchParams.get('status');
    
    let q;
    if (status) {
      q = query(
        collection(db, 'paymentRequests'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else if (labId) {
      q = query(
        collection(db, 'paymentRequests'),
        where('labId', '==', labId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'paymentRequests'),
        orderBy('createdAt', 'desc')
      );
    }

    const snap = await getDocs(q);
    const payments = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labId, userId, amount, planId, planName, upiId, screenshotUrl } = body;

    if (!labId || !userId || !amount || !planId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, 'paymentRequests'), {
      labId,
      userId,
      amount,
      planId,
      planName: planName || 'Unknown Plan',
      upiId: upiId || '',
      screenshotUrl: screenshotUrl || '',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      paymentId: docRef.id,
      message: 'Payment request submitted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status, adminId, note } = body;

    if (!paymentId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === 'Approved') {
      updateData.approvedAt = new Date().toISOString();
      updateData.approvedBy = adminId || 'admin';
    }

    if (note) {
      updateData.adminNote = note;
    }

    await updateDoc(doc(db, 'paymentRequests', paymentId), updateData);

    return NextResponse.json({
      success: true,
      message: `Payment ${status.toLowerCase()} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}