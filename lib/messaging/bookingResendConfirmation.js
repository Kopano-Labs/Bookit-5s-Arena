import { Resend } from "resend";

let resendClient = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export function isResendBookingConfirmationConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendResendConfirmation(bookingDetails, toEmail) {
  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured.",
    };
  }

  try {
    const { id, date, time, court, amount, type = 'confirmation' } = bookingDetails;
    const isUpdate = type === 'update';
    
    const subject = isUpdate 
      ? `Booking Updated - 5s Arena (${date})` 
      : `Booking Confirmation - 5s Arena (${date})`;
      
    const heading = isUpdate 
      ? `Your Booking is Updated` 
      : `Your Booking is Confirmed`;
      
    const bodyText = isUpdate 
      ? `Your booking details have been successfully updated.` 
      : `Thank you for booking with 5s Arena.`;

    const { data, error } = await resend.emails.send({
      from: "Bookings <bookings@fivesarena.com>",
      to: [toEmail],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h2>${heading}</h2>
          <p>${bodyText}</p>
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px;">
            <p><strong>Booking ID:</strong> ${id || 'N/A'}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Court:</strong> ${court}</p>
            <p><strong>Amount Paid:</strong> ZAR ${amount}</p>
          </div>
          <p>We look forward to seeing you on the pitch.</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error?.message || "Resend confirmation failed." };
  }
}
