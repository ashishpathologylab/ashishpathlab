import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name, labName, phone } = body;

    if (!action || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'register') {
      if (!name || !labName) {
        return NextResponse.json(
          { success: false, error: 'Name and lab name are required' },
          { status: 400 }
        );
      }

      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await updateProfile(user, { displayName: name });

      const labId = `lab_${user.uid.slice(0, 8)}`;
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 14);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: 'user' as const,
        labId,
        labName,
        isPremium: false,
        trialEndsAt: trialEnd.toISOString(),
        phone: phone || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        emailVerified: user.emailVerified,
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: { email: true, whatsapp: true, sms: false, push: false },
          currency: 'INR',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12h',
          itemsPerPage: 20,
          sidebarCollapsed: false,
        },
      };

      await Promise.all([
        setDoc(doc(db, 'users', user.uid), userData),
        setDoc(doc(db, 'labs', labId), {
          name: labName,
          ownerId: user.uid,
          email: user.email,
          phone: phone || '',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
      ]);

      return NextResponse.json({
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: name,
          labId,
          labName,
          isPremium: false,
          trialEndsAt: trialEnd.toISOString(),
          role: 'user',
        },
      });
    } 
    
    else if (action === 'login') {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        return NextResponse.json(
          { success: false, error: 'User data not found' },
          { status: 404 }
        );
      }

      const userData = userDoc.data();
      return NextResponse.json({
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName,
          labId: userData.labId,
          labName: userData.labName,
          role: userData.role,
          isPremium: userData.isPremium,
          trialEndsAt: userData.trialEndsAt,
          phone: userData.phone,
          photoURL: user.photoURL,
        },
      });
    } 
    
    else if (action === 'reset-password') {
      await sendPasswordResetEmail(auth, email);
      return NextResponse.json({
        success: true,
        message: 'Password reset email sent',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    let message = error.message;
    if (error.code === 'auth/user-not-found') message = 'User not found';
    else if (error.code === 'auth/wrong-password') message = 'Invalid password';
    else if (error.code === 'auth/email-already-in-use') message = 'Email already registered';
    else if (error.code === 'auth/weak-password') message = 'Password must be at least 6 characters';

    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID is required' },
        { status: 400 }
      );
    }

    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: { id: userDoc.id, ...userDoc.data() },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}