import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables with explicit path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Force override with new app password for testing
process.env.EMAIL_USER = 'epsoldev@gmail.com';
process.env.EMAIL_APP_PASSWORD = 'peubwxnnskasqchg';
process.env.NOTIFICATION_EMAIL = 'epsoldev@gmail.com';

console.log('🔧 Gmail Email Test - Step by Step\n');

// Check environment variables
console.log('📋 Step 1: Checking Environment Variables');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
console.log('EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? '✅ SET (length: ' + process.env.EMAIL_APP_PASSWORD.length + ')' : '❌ NOT SET');
console.log('NOTIFICATION_EMAIL:', process.env.NOTIFICATION_EMAIL || '❌ NOT SET');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  console.log('❌ ERROR: Missing required environment variables!');
  console.log('');
  console.log('🔧 TO FIX THIS:');
  console.log('1. Open your .env file');
  console.log('2. Make sure these lines exist:');
  console.log('   EMAIL_USER=epsoldev@gmail.com');
  console.log('   EMAIL_APP_PASSWORD=your-new-app-password');
  console.log('   NOTIFICATION_EMAIL=epsoldev@gmail.com');
  console.log('');
  console.log('📧 TO GET A NEW GMAIL APP PASSWORD:');
  console.log('1. Go to: https://myaccount.google.com/security');
  console.log('2. Sign in with epsoldev@gmail.com');
  console.log('3. Enable 2-Factor Authentication (if not already enabled)');
  console.log('4. Go to "App passwords"');
  console.log('5. Select "Mail" and "Other (custom name)"');
  console.log('6. Enter "EpsolDev Server"');
  console.log('7. Copy the 16-character password');
  console.log('8. Replace EMAIL_APP_PASSWORD in your .env file');
  process.exit(1);
}

console.log('✅ Step 2: Creating Email Transporter');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

console.log('📤 Step 3: Testing Email Connection');
console.log('Sending test email...\n');

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.NOTIFICATION_EMAIL,
  subject: '🧪 Test Email from EpsolDev Server',
  html: `
    <h2>✅ Email Test Successful!</h2>
    <p>This is a test email from your EpsolDev server.</p>
    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
    <p><strong>To:</strong> ${process.env.NOTIFICATION_EMAIL}</p>
    <hr>
    <p><em>If you received this email, your email service is working correctly!</em></p>
  `,
  text: `
    ✅ Email Test Successful!
    
    This is a test email from your EpsolDev server.
    
    Timestamp: ${new Date().toLocaleString()}
    From: ${process.env.EMAIL_USER}
    To: ${process.env.NOTIFICATION_EMAIL}
    
    If you received this email, your email service is working correctly!
  `
};

try {
  const result = await transporter.sendMail(mailOptions);
  console.log('🎉 SUCCESS! Email sent successfully!');
  console.log('📧 Message ID:', result.messageId);
  console.log('📬 Check your inbox at:', process.env.NOTIFICATION_EMAIL);
  console.log('');
  console.log('✅ Your email service is working correctly!');
  console.log('🚀 You can now use the full email service in your application.');
} catch (error) {
  console.log('❌ FAILED! Email could not be sent.');
  console.log('');
  console.log('🔍 Error Details:');
  console.log('Error Code:', error.code);
  console.log('Error Message:', error.message);
  console.log('');
  
  if (error.code === 'EAUTH') {
    console.log('🔧 AUTHENTICATION ERROR - This means:');
    console.log('1. Your Gmail app password is incorrect or expired');
    console.log('2. 2-Factor Authentication is not enabled on your Google account');
    console.log('3. The app password was not generated correctly');
    console.log('');
    console.log('📧 TO FIX:');
    console.log('1. Go to: https://myaccount.google.com/security');
    console.log('2. Make sure 2-Factor Authentication is enabled');
    console.log('3. Go to "App passwords" and generate a new one');
    console.log('4. Update your .env file with the new password');
    console.log('5. Run this test again');
  } else {
    console.log('🔧 OTHER ERROR - Check your internet connection and try again.');
  }
}

console.log('\n🏁 Test completed.');
