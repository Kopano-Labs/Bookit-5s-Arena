import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation({ to, name, courtName, date, start_time, duration, total_price }) {
  await resend.emails.send({
    from: 'Bookit 5s Arena <onboarding@resend.dev>',
    to,
    subject: `Booking Confirmed — ${courtName}`,
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Hi ${name},</p>
      <p>Your court booking has been confirmed. Here are your details:</p>
      <ul>
        <li><strong>Court:</strong> ${courtName}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${start_time}</li>
        <li><strong>Duration:</strong> ${duration} hour(s)</li>
        <li><strong>Total:</strong> R${total_price}</li>
      </ul>
      <p>See you on the pitch!</p>
      <p>— 5s Arena Team</p>
    `,
  });
}
