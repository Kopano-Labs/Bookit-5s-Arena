import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/mongodb';
import TournamentTeam from '@/models/TournamentTeam';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const teamName = formData.get('teamName');
    const managerEmail = formData.get('managerEmail');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!teamName || !managerEmail) {
      return NextResponse.json(
        { error: 'Team name and manager email are required to link payment.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payments');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedTeam = (teamName || 'unknown').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const ext = file.name?.split('.').pop() || 'png';
    const filename = `payment-${sanitizedTeam}-${timestamp}.${ext}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file locally
    await writeFile(filepath, buffer);

    // Connect and Update MongoDB
    await connectDB();
    const team = await TournamentTeam.findOneAndUpdate(
      { teamName, managerEmail: managerEmail.toLowerCase() },
      { 
        paymentScreenshot: filename,
        paymentStatus: 'pending' 
      },
      { new: true }
    );

    if (!team) {
      return NextResponse.json(
        { error: 'Registration not found. Please ensure you registered first.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Proof of payment uploaded successfully. Our team will verify within 24 hours.',
      filename,
    });
  } catch (error) {
    console.error('Payment upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload proof of payment. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamName = searchParams.get('team');
    const email = searchParams.get('email');

    if (!teamName || !email) {
      return NextResponse.json({ error: 'Team name and email required' }, { status: 400 });
    }

    await connectDB();
    const team = await TournamentTeam.findOne({ 
      teamName, 
      managerEmail: email.toLowerCase() 
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const messages = {
      unpaid: 'Waiting for Proof of Payment upload.',
      pending: 'Your payment is being reviewed by our team. Verification takes up to 24 hours.',
      confirmed: 'Payment verified! Your spot in the World Cup is secure.',
      rejected: 'Payment rejected. Please contact support or re-upload a clear POP.',
    };

    return NextResponse.json({
      status: team.paymentStatus || 'unpaid',
      message: messages[team.paymentStatus || 'unpaid'],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
