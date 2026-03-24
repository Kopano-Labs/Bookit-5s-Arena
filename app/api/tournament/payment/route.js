import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    // TODO: Also upload to Cloudinary for backup (BOTH storage as client requested)
    // const cloudinaryUrl = await uploadToCloudinary(buffer, filename);

    // TODO: Save record to MongoDB
    // await db.collection('payments').insertOne({
    //   teamName,
    //   managerEmail,
    //   filename,
    //   localPath: filepath,
    //   cloudinaryUrl,
    //   status: 'pending',
    //   uploadedAt: new Date(),
    // });

    // TODO: Send email notification to fivearena@gmail.com
    // await sendPaymentNotification({ teamName, managerEmail, filename });

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
  // Check payment status
  const { searchParams } = new URL(request.url);
  const teamName = searchParams.get('team');

  if (!teamName) {
    return NextResponse.json({ error: 'Team name required' }, { status: 400 });
  }

  // TODO: Check MongoDB for payment status
  // const payment = await db.collection('payments').findOne({ teamName });

  return NextResponse.json({
    status: 'pending', // pending | approved | rejected
    message: 'Payment is being reviewed by our team.',
  });
}
