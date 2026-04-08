export const dynamic = 'force-dynamic';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAuthSession } from '@/lib/getSession';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

function detectImageExtension(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpg';
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'png';
  }

  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46
  ) {
    return 'gif';
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }

  return null;
}

export async function POST(request) {
  const session = await getAuthSession();
  if (!session) return Response.json({ error: 'Unauthorised' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return Response.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Validate mime type — only allow safe raster image formats (no SVG to prevent XSS)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      return Response.json({ error: 'Only JPEG, PNG, GIF and WebP images are allowed.' }, { status: 400 });
    }

    // Validate size — 3 MB max
    if (file.size > 3 * 1024 * 1024) {
      return Response.json({ error: 'Image must be under 3 MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const detectedExt = detectImageExtension(buffer);

    if (!detectedExt) {
      return Response.json({ error: 'The uploaded file is not a valid supported image.' }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    await mkdir(uploadDir, { recursive: true });

    // Use user ID as filename (one file per user, replaces previous)
    const filename = `${session.user.id}.${detectedExt}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    const imageUrl = `/uploads/avatars/${filename}`;

    // Save to user's profileImage in DB
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { profileImage: imageUrl });

    return Response.json({ imageUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
