import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_APP_PASSWORD // Your Gmail App Password (not regular password)
    }
  });
};

// HTML template for project request notification email
const createProjectRequestEmailTemplate = (projectData) => {
  const { 
    clientName, 
    companyName, 
    email, 
    phone, 
    projectType, 
    budget, 
    timeline, 
    description 
  } = projectData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Project Request - EpsolDev</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #2563eb, #3b82f6);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 30px;
            }
            .info-section {
                margin-bottom: 25px;
                background-color: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
            }
            .info-section h3 {
                color: #2563eb;
                margin-top: 0;
                margin-bottom: 15px;
            }
            .info-row {
                display: flex;
                margin-bottom: 10px;
            }
            .info-label {
                font-weight: bold;
                min-width: 120px;
                color: #4a5568;
            }
            .info-value {
                color: #2d3748;
            }
            .description {
                background-color: #fff;
                padding: 20px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                margin-top: 20px;
            }
            .footer {
                background-color: #f7fafc;
                padding: 20px;
                text-align: center;
                color: #718096;
                font-size: 14px;
            }
            .priority-badge {
                display: inline-block;
                background-color: #fbbf24;
                color: #92400e;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 New Project Request Received!</h1>
                <p>A new client has submitted a project request through your website</p>
            </div>
            
            <div class="content">
                <div class="info-section">
                    <h3>👤 Client Information</h3>
                    <div class="info-row">
                        <div class="info-label">Name:</div>
                        <div class="info-value">${clientName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Company:</div>
                        <div class="info-value">${companyName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value"><a href="mailto:${email}">${email}</a></div>
                    </div>
                    ${phone ? `
                    <div class="info-row">
                        <div class="info-label">Phone:</div>
                        <div class="info-value"><a href="tel:${phone}">${phone}</a></div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="info-section">
                    <h3>📋 Project Details</h3>
                    <div class="info-row">
                        <div class="info-label">Project Type:</div>
                        <div class="info-value">${projectType}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Budget:</div>
                        <div class="info-value">${budget}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Timeline:</div>
                        <div class="info-value">${timeline}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Status:</div>
                        <div class="info-value"><span class="priority-badge">New Request</span></div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>💭 Project Description</h3>
                    <div class="description">
                        ${description.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>EpsolDev Project Management System</strong></p>
                <p>This email was automatically generated when a new project request was submitted through your website.</p>
                <p>Please respond to the client within 24-48 hours for the best customer experience.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send project request notification email
export const sendProjectRequestNotification = async (projectData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || 'epsoldev@gmail.com',
      subject: `🚀 New Project Request from ${projectData.clientName} - ${projectData.companyName}`,
      html: createProjectRequestEmailTemplate(projectData),
      // Also send a plain text version
      text: `
New Project Request Received!

Client Information:
- Name: ${projectData.clientName}
- Company: ${projectData.companyName}
- Email: ${projectData.email}
- Phone: ${projectData.phone || 'Not provided'}

Project Details:
- Project Type: ${projectData.projectType}
- Budget: ${projectData.budget}
- Timeline: ${projectData.timeline}

Project Description:
${projectData.description}

Please respond to the client promptly!
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Project request notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending project request notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send acknowledgment email to the client
export const sendClientAcknowledgment = async (projectData) => {
  try {
    const transporter = createTransporter();
    
    const clientEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Request Received - EpsolDev</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  overflow: hidden;
              }
              .header {
                  background: linear-gradient(135deg, #2563eb, #3b82f6);
                  color: white;
                  padding: 30px 20px;
                  text-align: center;
              }
              .content {
                  padding: 30px;
              }
              .footer {
                  background-color: #f7fafc;
                  padding: 20px;
                  text-align: center;
                  color: #718096;
                  font-size: 14px;
              }
              .highlight {
                  background-color: #f0f9ff;
                  padding: 20px;
                  border-radius: 8px;
                  border-left: 4px solid #2563eb;
                  margin: 20px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>✅ Thank You for Your Project Request!</h1>
              </div>
              
              <div class="content">
                  <p>Dear ${projectData.clientName},</p>
                  
                  <p>Thank you for reaching out to <strong>EpsolDev</strong>! We have successfully received your project request for <strong>${projectData.projectType}</strong>.</p>
                  
                  <div class="highlight">
                      <h3>What happens next?</h3>
                      <ul>
                          <li><strong>Review:</strong> Our team will carefully review your project requirements</li>
                          <li><strong>Analysis:</strong> We'll analyze the scope and technical requirements</li>
                          <li><strong>Response:</strong> You'll hear back from us within 24-48 hours</li>
                          <li><strong>Consultation:</strong> We'll schedule a call to discuss your project in detail</li>
                      </ul>
                  </div>
                  
                  <p>We're excited about the possibility of working with <strong>${projectData.companyName}</strong> and bringing your vision to life!</p>
                  
                  <p>If you have any urgent questions or need to add additional information, please don't hesitate to reply to this email.</p>
                  
                  <p>Best regards,<br>
                  <strong>The EpsolDev Team</strong></p>
              </div>
              
              <div class="footer">
                  <p><strong>EpsolDev</strong> - Turning Ideas into Digital Reality</p>
                  <p>This is an automated confirmation email.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: projectData.email,
      subject: `✅ Project Request Received - We'll be in touch soon!`,
      html: clientEmailTemplate,
      text: `
Dear ${projectData.clientName},

Thank you for reaching out to EpsolDev! We have successfully received your project request for ${projectData.projectType}.

What happens next?
- Our team will carefully review your project requirements
- We'll analyze the scope and technical requirements  
- You'll hear back from us within 24-48 hours
- We'll schedule a call to discuss your project in detail

We're excited about the possibility of working with ${projectData.companyName} and bringing your vision to life!

Best regards,
The EpsolDev Team
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Client acknowledgment email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending client acknowledgment email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendProjectRequestNotification,
  sendClientAcknowledgment
};