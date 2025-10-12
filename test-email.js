import { sendProjectRequestNotification, sendClientAcknowledgment } from './services/emailService.js';
import dotenv from 'dotenv';

// Load environment variables with explicit path
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Force override with new app password for testing
process.env.EMAIL_USER = 'epsoldev@gmail.com';
process.env.EMAIL_APP_PASSWORD = 'peubwxnnskasqchg';
process.env.NOTIFICATION_EMAIL = 'epsoldev@gmail.com';

// Test data for project request
const testProjectData = {
  clientName: 'John Doe',
  companyName: 'Test Company Inc.',
  email: 'test@example.com',
  phone: '+1-555-123-4567',
  projectType: 'Web Application',
  budget: '$10,000 - $25,000',
  timeline: '3-6 months',
  description: 'We need a modern web application for our business. The application should include user authentication, dashboard, and reporting features. We are looking for a responsive design that works well on both desktop and mobile devices.'
};

async function testEmailService() {
  console.log('🧪 Starting Email Service Test...\n');
  
  // Debug: Check what environment variables are loaded
  console.log('🔍 Debug - Environment variables loaded');
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔑 App Password Length:', process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 'undefined');
  console.log('📬 Notification Email:', process.env.NOTIFICATION_EMAIL);
  
  // Check if required environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('❌ Error: Missing required environment variables!');
    console.error('Please create a .env file with the following variables:');
    console.error('EMAIL_USER=your-email@gmail.com');
    console.error('EMAIL_APP_PASSWORD=your-gmail-app-password');
    console.error('NOTIFICATION_EMAIL=epsoldev@gmail.com (optional)');
    console.error('\nTo get a Gmail App Password:');
    console.error('1. Enable 2-factor authentication on your Google account');
    console.error('2. Go to Google Account settings > Security > App passwords');
    console.error('3. Generate a new app password for "Mail"');
    console.error('4. Use that password as EMAIL_APP_PASSWORD');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
  console.log(`📬 Notification Email: ${process.env.NOTIFICATION_EMAIL || 'epsoldev@gmail.com'}\n`);
  
  try {
    // Test 1: Send project request notification
    console.log('📤 Test 1: Sending project request notification email...');
    const notificationResult = await sendProjectRequestNotification(testProjectData);
    
    if (notificationResult.success) {
      console.log('✅ Project request notification sent successfully!');
      console.log(`📧 Message ID: ${notificationResult.messageId}\n`);
    } else {
      console.log('❌ Failed to send project request notification');
      console.log(`Error: ${notificationResult.error}\n`);
    }
    
    // Test 2: Send client acknowledgment
    console.log('📤 Test 2: Sending client acknowledgment email...');
    const acknowledgmentResult = await sendClientAcknowledgment(testProjectData);
    
    if (acknowledgmentResult.success) {
      console.log('✅ Client acknowledgment sent successfully!');
      console.log(`📧 Message ID: ${acknowledgmentResult.messageId}\n`);
    } else {
      console.log('❌ Failed to send client acknowledgment');
      console.log(`Error: ${acknowledgmentResult.error}\n`);
    }
    
    // Summary
    console.log('📊 Test Summary:');
    console.log(`- Project Request Notification: ${notificationResult.success ? '✅ Success' : '❌ Failed'}`);
    console.log(`- Client Acknowledgment: ${acknowledgmentResult.success ? '✅ Success' : '❌ Failed'}`);
    
    if (notificationResult.success && acknowledgmentResult.success) {
      console.log('\n🎉 All email tests passed successfully!');
    } else {
      console.log('\n⚠️  Some email tests failed. Please check your email configuration.');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error during email testing:', error);
  }
}

// Run the test
testEmailService().then(() => {
  console.log('\n🏁 Email service test completed.');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed with error:', error);
  process.exit(1);
});
