import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendBookingConfirmation({
  to, name, courtName, date, start_time, duration, total_price, type = 'confirmation'
}) {
  const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const isUpdate = type === 'update';

    const subject = isUpdate
      ? `Booking Updated — ${courtName}`
      : `Booking Confirmed — ${courtName}`;

    const heading = isUpdate ? 'Booking Updated' : 'Booking Confirmed!';
    const message = isUpdate
      ? `Your booking for <strong>${courtName}</strong> has been updated. Here are your new details:`
      : `Your booking for <strong>${courtName}</strong> has been confirmed. Here are your details:`;

  await transporter.sendMail({
    from: `"Bookit 5s Arena" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

          <div style="background-color: #111; padding: 20px 28px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 14px;">
            <img
              src="${siteUrl}/images/logo.jpg"
              alt="5s Arena"
              width="52"
              height="52"
              style="border-radius: 50%; border: 2px solid #22c55e; object-fit: cover; flex-shrink: 0;"
            />
            <div>
              <h1 style="color: #fff; margin: 0; font-size: 20px; font-family: Impact, Arial Black, sans-serif; letter-spacing: 1px;">5S ARENA</h1>
              <p style="color: #22c55e; margin: 2px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Milnerton · Cape Town</p>
            </div>
          </div>

          <div style="background-color: #f9f9f9; padding: 28px 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e5e5; border-top: none;">

            <h2 style="color: #111; margin-top: 0;">${heading}</h2>
            <p style="margin-bottom: 4px;">Hi ${name},</p>
            <p>${message}</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px 14px; font-weight: bold; width: 40%;">Court</td>
                <td style="padding: 10px 14px;">${courtName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold;">Date</td>
                <td style="padding: 10px 14px;">${date}</td>
              </tr>
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px 14px; font-weight: bold;">Start Time</td>
                <td style="padding: 10px 14px;">${start_time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold;">Duration</td>
                <td style="padding: 10px 14px;">${duration} hour${duration > 1 ? 's' : ''}</td>
              </tr>
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px 14px; font-weight: bold;">Total</td>
                <td style="padding: 10px 14px; font-weight: bold; color: #111;">R${total_price}</td>
              </tr>
            </table>

            <div style="margin: 24px 0;">
              <a href="${siteUrl}/bookings"
                style="background-color: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold;">
                View My Bookings
              </a>
            </div>

            <p style="font-size: 13px; color: #666; margin-top: 24px;">
              Not you? <a href="${siteUrl}/login" style="color: #111;">Log in to your account</a> to manage your bookings.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />

            <p style="font-size: 12px; color: #999; margin: 0;">
              See you on the pitch! — The 5s Arena Team<br />
              <a href="${siteUrl}" style="color: #999;">${siteUrl}</a>
            </p>

          </div>
        </div>
    `,
  });
}
