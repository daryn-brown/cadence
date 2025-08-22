import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    // TEMPORARY: For testing, send all emails to darynbrownpro@gmail.com
    // This allows testing both contractor and manager notifications
    const testEmail = 'darynbrownpro@gmail.com';
    const originalTo = emailData.to;

    console.log(`[TEST MODE] Original recipient: ${originalTo}, Sending to: ${testEmail}`);

    const { data, error } = await resend.emails.send({
      from: 'Intellibus Connect <onboarding@resend.dev>',
      to: [testEmail],
      subject: `[TEST] ${emailData.subject} (Original: ${originalTo})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #fef3c7; padding: 10px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-weight: bold;">🧪 TEST MODE</p>
            <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">
              This email was originally intended for: <strong>${originalTo}</strong><br>
              Sent to: <strong>${testEmail}</strong> for testing purposes.
            </p>
          </div>
          ${emailData.html}
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Email templates
export const sendInitialConnectConfirmation = async (
  contractorEmail: string,
  contractorName: string,
  contractId: string,
  formData: any
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Initial Connect Submitted Successfully</h2>
      <p>Hi ${contractorName},</p>
      <p>Your Initial Connect has been submitted successfully for contract #${contractId}.</p>
      
      <h3 style="color: #374151;">Your Submission Details:</h3>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Primary Goals:</h4>
        <p>${formData.goals || 'Not specified'}</p>
        
        <h4>Expectations:</h4>
        <p>${formData.expectations || 'Not specified'}</p>
        
        <h4>Required Resources:</h4>
        <p>${formData.resources || 'Not specified'}</p>
      </div>
      
      <p>Your manager will review your submission and may provide feedback. You'll receive an email notification when they do.</p>
      
      <p>Best regards,<br>The Intellibus Connect Team</p>
    </div>
  `;

  return sendEmail({
    to: contractorEmail,
    subject: 'Initial Connect Submitted - Contract #' + contractId,
    html,
  });
};

export const sendManagerNotification = async (
  managerEmail: string,
  managerName: string,
  contractorName: string,
  contractId: string,
  cycleId: string,
  formData: any
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Initial Connect Submission</h2>
      <p>Hi ${managerName},</p>
      <p>${contractorName} has submitted their Initial Connect for contract #${contractId}.</p>
      
      <h3 style="color: #374151;">Submission Details:</h3>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Primary Goals:</h4>
        <p>${formData.goals || 'Not specified'}</p>
        
        <h4>Expectations:</h4>
        <p>${formData.expectations || 'Not specified'}</p>
        
        <h4>Required Resources:</h4>
        <p>${formData.resources || 'Not specified'}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contract/${contractId}/connect-cycle/${cycleId}/review" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Review Submission
        </a>
      </div>
      
      <p>Please review the submission and provide feedback as needed.</p>
      
      <p>Best regards,<br>The Intellibus Connect Team</p>
    </div>
  `;

  return sendEmail({
    to: managerEmail,
    subject: `Initial Connect from ${contractorName} - Contract #${contractId}`,
    html,
  });
};

export const sendContractorCommentNotification = async (
  contractorEmail: string,
  contractorName: string,
  managerName: string,
  contractId: string,
  cycleId: string,
  comment: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Manager Feedback</h2>
      <p>Hi ${contractorName},</p>
      <p>${managerName} has added feedback to your Connect Cycle for contract #${contractId}.</p>
      
      <h3 style="color: #374151;">Manager's Comment:</h3>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <p style="margin: 0; font-style: italic;">"${comment}"</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contract/contractor-cadence" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Full Details
        </a>
      </div>
      
      <p>Please review the feedback and take any necessary actions.</p>
      
      <p>Best regards,<br>The Intellibus Connect Team</p>
    </div>
  `;

  return sendEmail({
    to: contractorEmail,
    subject: `New Feedback from ${managerName} - Contract #${contractId}`,
    html,
  });
};

export const sendMidpointConnectNotification = async (
  contractorEmail: string,
  contractorName: string,
  managerEmail: string,
  managerName: string,
  contractId: string,
  formData: any
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Midpoint Connect Submitted</h2>
      <p>Hi ${contractorName},</p>
      <p>Your Midpoint Connect has been submitted successfully for contract #${contractId}.</p>
      
      <h3 style="color: #374151;">Your Progress Update:</h3>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Progress Update:</h4>
        <p>${formData.progress || 'Not specified'}</p>
        
        <h4>Challenges & Solutions:</h4>
        <p>${formData.challenges || 'Not specified'}</p>
        
        <h4>Goal Adjustments:</h4>
        <p>${formData.adjustments || 'Not specified'}</p>
      </div>
      
      <p>Your manager will review your progress update and may provide feedback.</p>
      
      <p>Best regards,<br>The Intellibus Connect Team</p>
    </div>
  `;

  return sendEmail({
    to: contractorEmail,
    subject: 'Midpoint Connect Submitted - Contract #' + contractId,
    html,
  });
};

export const sendFinalConnectNotification = async (
  contractorEmail: string,
  contractorName: string,
  managerEmail: string,
  managerName: string,
  contractId: string,
  formData: any
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Final Connect Submitted</h2>
      <p>Hi ${contractorName},</p>
      <p>Your Final Connect has been submitted successfully for contract #${contractId}.</p>
      
      <h3 style="color: #374151;">Your Final Summary:</h3>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Key Achievements:</h4>
        <p>${formData.achievements || 'Not specified'}</p>
        
        <h4>Overall Feedback:</h4>
        <p>${formData.feedback || 'Not specified'}</p>
        
        <h4>Lessons Learned:</h4>
        <p>${formData.lessons || 'Not specified'}</p>
        
        <h4>Future Recommendations:</h4>
        <p>${formData.recommendations || 'Not specified'}</p>
      </div>
      
      <p>Thank you for your contributions to this project!</p>
      
      <p>Best regards,<br>The Intellibus Connect Team</p>
    </div>
  `;

  return sendEmail({
    to: contractorEmail,
    subject: 'Final Connect Submitted - Contract #' + contractId,
    html,
  });
}; 