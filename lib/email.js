/**
 * Email Service using SendPulse SMTP via Nodemailer
 * 
 * Environment variables required:
 * - SMTP_HOST: SendPulse SMTP host (e.g., smtp-pulse.com)
 * - SMTP_PORT: SMTP port (typically 465 for SSL or 587 for TLS)
 * - SMTP_USER: SendPulse SMTP username
 * - SMTP_PASS: SendPulse SMTP password
 * - SMTP_FROM_EMAIL: Sender email (e.g., info@kursfind.de)
 * - SMTP_FROM_NAME: Sender name (e.g., Kursfind)
 */

import nodemailer from 'nodemailer'

// Brand configuration
const BRAND = {
  name: 'Kursfind',
  logoUrl: 'https://app.kursfind.de/logo.png', // Update with actual logo URL
  primaryColor: '#06B6D4', // cyan-500
  secondaryColor: '#10B981', // emerald-500
  websiteUrl: 'https://app.kursfind.de',
  supportEmail: 'info@kursfind.de',
  companyName: 'ISRAR Group LLC',
  companyAddress: '30 N Gould St Ste R, Sheridan, WY 82801 USA'
}

// Create reusable transporter
function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('[Email] SMTP credentials not configured. Emails will be logged but not sent.')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  })
}

/**
 * Base HTML email template with Kursfind branding
 */
function createEmailTemplate({ title, preheader, bodyContent, ctaText, ctaUrl, footerText }) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .button {padding: 12px 24px !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <!-- Preheader text (hidden but shows in email preview) -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader || title}
  </div>
  
  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <!-- Email container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, ${BRAND.primaryColor} 0%, ${BRAND.secondaryColor} 100%); padding: 32px 40px; text-align: center;">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" width="150" style="max-width: 150px; height: auto;" onerror="this.style.display='none'">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 16px 0 0 0; ${!BRAND.logoUrl ? '' : 'display: none;'}">${BRAND.name}</h1>
            </td>
          </tr>
          
          <!-- Main content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #18181b; font-size: 22px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.3;">
                ${title}
              </h2>
              
              <div style="color: #3f3f46; font-size: 16px; line-height: 1.6;">
                ${bodyContent}
              </div>
              
              ${ctaText && ctaUrl ? `
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
                <tr>
                  <td style="border-radius: 8px; background: linear-gradient(135deg, ${BRAND.primaryColor} 0%, ${BRAND.secondaryColor} 100%);">
                    <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                      ${ctaText}
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              ${footerText ? `
              <p style="color: #71717a; font-size: 14px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e4e4e7;">
                ${footerText}
              </p>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f5; padding: 24px 40px; text-align: center;">
              <p style="color: #71717a; font-size: 14px; margin: 0 0 8px 0;">
                © ${new Date().getFullYear()} ${BRAND.name}. Alle Rechte vorbehalten.
              </p>
              <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                <a href="${BRAND.websiteUrl}" style="color: ${BRAND.primaryColor}; text-decoration: none;">Website</a>
                &nbsp;|&nbsp;
                <a href="${BRAND.websiteUrl}/datenschutz" style="color: ${BRAND.primaryColor}; text-decoration: none;">Datenschutz</a>
                &nbsp;|&nbsp;
                <a href="${BRAND.websiteUrl}/impressum" style="color: ${BRAND.primaryColor}; text-decoration: none;">Impressum</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

/**
 * Send an email
 */
async function sendEmail({ to, subject, html, text }) {
  const transporter = createTransporter()
  
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'info@kursfind.de'
  const fromName = process.env.SMTP_FROM_NAME || 'Kursfind'
  
  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, '') // Fallback plain text
  }

  if (!transporter) {
    console.log('[Email] Would send email (SMTP not configured):')
    console.log('  To:', to)
    console.log('  Subject:', subject)
    return { success: true, simulated: true }
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('[Email] Sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    return { success: false, error: error.message }
  }
}

// ============================================
// EMAIL TEMPLATES FOR SPECIFIC EVENTS
// ============================================

/**
 * Student: Application submitted successfully
 */
export async function sendStudentApplicationSubmitted({ 
  studentEmail, 
  studentName, 
  courseName, 
  providerName 
}) {
  const html = createEmailTemplate({
    title: 'Ihre Bewerbung wurde erfolgreich eingereicht',
    preheader: `Bewerbung für ${courseName} bei ${providerName} eingereicht`,
    bodyContent: `
      <p>Hallo ${studentName},</p>
      <p>vielen Dank für Ihre Bewerbung für den Kurs:</p>
      <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
        <p style="font-weight: 600; color: #18181b; margin: 0 0 4px 0;">${courseName}</p>
        <p style="color: #71717a; margin: 0;">Anbieter: ${providerName}</p>
      </div>
      <p>Der Anbieter wird Ihre Bewerbung prüfen und sich in Kürze bei Ihnen melden.</p>
      <p><strong>Was passiert als Nächstes?</strong></p>
      <ul style="padding-left: 20px;">
        <li>Der Anbieter prüft Ihre Unterlagen</li>
        <li>Sie erhalten eine Benachrichtigung über den Status</li>
        <li>Bei Fragen können Sie den Anbieter direkt kontaktieren</li>
      </ul>
    `,
    ctaText: 'Meine Bewerbungen ansehen',
    ctaUrl: `${BRAND.websiteUrl}/student/dashboard/applications`,
    footerText: 'Falls Sie innerhalb von 48 Stunden keine Antwort erhalten, finden Sie die Kontaktdaten des Anbieters auf der Kursseite.'
  })

  return sendEmail({
    to: studentEmail,
    subject: `✅ Bewerbung eingereicht: ${courseName}`,
    html
  })
}

/**
 * Student: Application accepted
 */
export async function sendStudentApplicationAccepted({ 
  studentEmail, 
  studentName, 
  courseName, 
  providerName,
  providerEmail,
  providerPhone
}) {
  const contactInfo = []
  if (providerEmail) contactInfo.push(`E-Mail: ${providerEmail}`)
  if (providerPhone) contactInfo.push(`Telefon: ${providerPhone}`)

  const html = createEmailTemplate({
    title: 'Herzlichen Glückwunsch! Ihre Bewerbung wurde angenommen',
    preheader: `Gute Nachrichten: Ihre Bewerbung für ${courseName} wurde angenommen!`,
    bodyContent: `
      <p>Hallo ${studentName},</p>
      <p>wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bewerbung <strong>angenommen</strong> wurde! 🎉</p>
      <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid ${BRAND.secondaryColor};">
        <p style="font-weight: 600; color: #065f46; margin: 0 0 4px 0;">${courseName}</p>
        <p style="color: #047857; margin: 0;">Anbieter: ${providerName}</p>
      </div>
      <p><strong>Nächste Schritte:</strong></p>
      <p>Der Anbieter wird sich in Kürze bei Ihnen melden, um die weiteren Details zu besprechen. Sie können auch direkt Kontakt aufnehmen:</p>
      ${contactInfo.length > 0 ? `
      <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin: 16px 0;">
        ${contactInfo.map(info => `<p style="margin: 4px 0; color: #3f3f46;">${info}</p>`).join('')}
      </div>
      ` : ''}
      <p>Wir wünschen Ihnen viel Erfolg bei Ihrer Weiterbildung!</p>
    `,
    ctaText: 'Kursdetails ansehen',
    ctaUrl: `${BRAND.websiteUrl}/student/dashboard/applications`
  })

  return sendEmail({
    to: studentEmail,
    subject: `🎉 Angenommen: ${courseName}`,
    html
  })
}

/**
 * Student: Application rejected
 */
export async function sendStudentApplicationRejected({ 
  studentEmail, 
  studentName, 
  courseName, 
  providerName 
}) {
  const html = createEmailTemplate({
    title: 'Information zu Ihrer Bewerbung',
    preheader: `Update zu Ihrer Bewerbung für ${courseName}`,
    bodyContent: `
      <p>Hallo ${studentName},</p>
      <p>vielen Dank für Ihr Interesse an dem Kurs <strong>${courseName}</strong> bei ${providerName}.</p>
      <p>Leider müssen wir Ihnen mitteilen, dass Ihre Bewerbung für diesen Kurs nicht berücksichtigt werden konnte.</p>
      <p>Dies kann verschiedene Gründe haben und ist keine Aussage über Ihre Qualifikationen. Möglicherweise:</p>
      <ul style="padding-left: 20px; color: #71717a;">
        <li>Waren die Plätze bereits vergeben</li>
        <li>Passten die Voraussetzungen nicht ganz</li>
        <li>Gab es terminliche Überschneidungen</li>
      </ul>
      <p><strong>Geben Sie nicht auf!</strong></p>
      <p>Auf Kursfind finden Sie viele weitere passende Weiterbildungen. Stöbern Sie in unserem Angebot und finden Sie den perfekten Kurs für Ihre Karriere.</p>
    `,
    ctaText: 'Weitere Kurse entdecken',
    ctaUrl: `${BRAND.websiteUrl}/courses`,
    footerText: 'Wir wünschen Ihnen weiterhin viel Erfolg bei Ihrer beruflichen Weiterbildung.'
  })

  return sendEmail({
    to: studentEmail,
    subject: `Information zu Ihrer Bewerbung: ${courseName}`,
    html
  })
}

/**
 * Provider: New application received
 */
export async function sendProviderNewApplication({ 
  providerEmail, 
  providerName, 
  studentName, 
  studentEmail,
  studentPhone,
  courseName, 
  fundingType,
  message,
  applicationId: _applicationId
}) {
  const html = createEmailTemplate({
    title: 'Neue Bewerbung eingegangen',
    preheader: `${studentName} hat sich für ${courseName} beworben`,
    bodyContent: `
      <p>Hallo ${providerName},</p>
      <p>Sie haben eine neue Bewerbung erhalten! 📩</p>
      
      <div style="background-color: #ecfeff; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid ${BRAND.primaryColor};">
        <p style="font-weight: 600; color: #0891b2; margin: 0 0 12px 0; font-size: 18px;">Kurs: ${courseName}</p>
        
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
          <tr>
            <td style="padding: 4px 0; color: #71717a; width: 120px;">Bewerber:</td>
            <td style="padding: 4px 0; color: #18181b; font-weight: 500;">${studentName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #71717a;">E-Mail:</td>
            <td style="padding: 4px 0; color: #18181b;"><a href="mailto:${studentEmail}" style="color: ${BRAND.primaryColor};">${studentEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #71717a;">Telefon:</td>
            <td style="padding: 4px 0; color: #18181b;">${studentPhone || '–'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #71717a;">Förderung:</td>
            <td style="padding: 4px 0; color: #18181b;">${fundingType || '–'}</td>
          </tr>
        </table>
        
        ${message ? `
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #cffafe;">
          <p style="color: #71717a; margin: 0 0 4px 0; font-size: 14px;">Nachricht:</p>
          <p style="color: #18181b; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        ` : ''}
      </div>
      
      <p>Bitte reagieren Sie zeitnah auf diese Bewerbung, um dem Interessenten ein gutes Erlebnis zu bieten.</p>
    `,
    ctaText: 'Bewerbung ansehen',
    ctaUrl: `${BRAND.websiteUrl}/provider/dashboard/applications`,
    footerText: 'Wir empfehlen, innerhalb von 24-48 Stunden zu antworten, um die besten Kandidaten zu gewinnen.'
  })

  return sendEmail({
    to: providerEmail,
    subject: `📩 Neue Bewerbung: ${studentName} für ${courseName}`,
    html
  })
}

/**
 * Student Reminder: Application still pending (no response from provider)
 */
export async function sendStudentReminder({ 
  studentEmail, 
  studentName, 
  courseName, 
  providerName,
  daysPending,
  isSecondReminder = false
}) {
  const html = createEmailTemplate({
    title: isSecondReminder 
      ? 'Erinnerung: Ihre Bewerbung wartet noch auf Antwort'
      : 'Update zu Ihrer Bewerbung',
    preheader: `Status Ihrer Bewerbung für ${courseName}`,
    bodyContent: `
      <p>Hallo ${studentName},</p>
      <p>Ihre Bewerbung für den Kurs <strong>${courseName}</strong> bei ${providerName} ist noch in Bearbeitung.</p>
      ${isSecondReminder ? `
      <p>Es sind nun ${daysPending} Tage vergangen, seit Sie sich beworben haben. Der Anbieter hat noch nicht geantwortet.</p>
      ` : `
      <p>Der Anbieter prüft noch Ihre Unterlagen. Bitte haben Sie noch etwas Geduld.</p>
      `}
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #f59e0b;">
        <p style="color: #92400e; margin: 0;"><strong>Tipp:</strong> Sie können den Anbieter auch direkt kontaktieren. Die Kontaktdaten finden Sie auf der Kursseite.</p>
      </div>
      <p>Sollten Sie in den nächsten Tagen keine Antwort erhalten, empfehlen wir Ihnen, sich auch nach alternativen Kursen umzusehen.</p>
    `,
    ctaText: 'Kursdetails & Kontakt ansehen',
    ctaUrl: `${BRAND.websiteUrl}/student/dashboard/applications`
  })

  return sendEmail({
    to: studentEmail,
    subject: isSecondReminder 
      ? `⏰ Erinnerung: Bewerbung für ${courseName}`
      : `📋 Status: Ihre Bewerbung für ${courseName}`,
    html
  })
}

/**
 * Provider Reminder: Pending applications need attention
 */
export async function sendProviderReminder({ 
  providerEmail, 
  providerName, 
  pendingCount,
  applications, // Array of { studentName, courseName, daysPending }
  isSecondReminder = false
}) {
  const applicationList = applications.slice(0, 5).map(app => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e4e4e7;">${app.studentName}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e4e4e7;">${app.courseName}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #e4e4e7; color: #f59e0b;">${app.daysPending} Tage</td>
    </tr>
  `).join('')

  const html = createEmailTemplate({
    title: isSecondReminder 
      ? `Dringend: ${pendingCount} Bewerbung${pendingCount > 1 ? 'en' : ''} warten auf Ihre Antwort`
      : `${pendingCount} neue Bewerbung${pendingCount > 1 ? 'en' : ''} warten auf Sie`,
    preheader: `Sie haben ${pendingCount} unbeantwortete Bewerbung${pendingCount > 1 ? 'en' : ''}`,
    bodyContent: `
      <p>Hallo ${providerName},</p>
      ${isSecondReminder ? `
      <p>Sie haben noch <strong>${pendingCount} unbeantwortete Bewerbung${pendingCount > 1 ? 'en' : ''}</strong>, die auf Ihre Rückmeldung warten.</p>
      <p style="color: #dc2626;"><strong>Bitte reagieren Sie zeitnah</strong>, um interessierte Teilnehmer nicht zu verlieren.</p>
      ` : `
      <p>Sie haben <strong>${pendingCount} neue Bewerbung${pendingCount > 1 ? 'en' : ''}</strong>, die auf Ihre Bearbeitung warten.</p>
      `}
      
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin: 20px 0; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #f4f4f5;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #3f3f46;">Bewerber</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #3f3f46;">Kurs</th>
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #3f3f46;">Wartet seit</th>
          </tr>
        </thead>
        <tbody>
          ${applicationList}
        </tbody>
      </table>
      
      ${applications.length > 5 ? `<p style="color: #71717a; font-size: 14px;">...und ${applications.length - 5} weitere</p>` : ''}
      
      <p>Schnelle Reaktionszeiten verbessern Ihre Bewertung und helfen Ihnen, die besten Teilnehmer zu gewinnen.</p>
    `,
    ctaText: 'Bewerbungen bearbeiten',
    ctaUrl: `${BRAND.websiteUrl}/provider/dashboard/applications`
  })

  return sendEmail({
    to: providerEmail,
    subject: isSecondReminder 
      ? `🔴 Dringend: ${pendingCount} Bewerbung${pendingCount > 1 ? 'en' : ''} warten`
      : `📬 ${pendingCount} neue Bewerbung${pendingCount > 1 ? 'en' : ''} eingegangen`,
    html
  })
}

// Export all functions
export {
  sendEmail,
  createEmailTemplate,
  BRAND
}
