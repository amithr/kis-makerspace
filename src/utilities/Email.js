import { Resend } from 'resend';
import { sendEmail } from './Supabase';

const handleNotify = async () => {
    const result = await sendEmail({
      to: "amithravindar@gmail.com",
      subject: "Request Complete",
      html: "<p>Your 3D print request is done!</p>",
    });
  
    if (result.success) {
      alert("Email sent!");
    } else {
      alert("Failed to send email: " + result.message);
    }
  };