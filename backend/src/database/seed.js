import { getPostgreSQLPool } from '../config/postgresql.js'
import { connectPostgreSQL } from '../config/postgresql.js'
import dotenv from 'dotenv'

dotenv.config()

const challenges = [
  // ========== PHISHING CHALLENGES (Levels 1-10) ==========
  {
    category: 'phishing',
    level: 1,
    title: 'Basic Phishing Email',
    description: 'Identify the red flags in this obvious phishing email. Look for suspicious domains, urgent language, and suspicious links.',
    content: {
      type: 'email',
      from: 'noreply@amaz0n.com',
      to: 'user@example.com',
      subject: 'URGENT: Verify Your Account Now!',
      body: 'Dear Customer,\n\nYour account will be suspended in 24 hours if you do not verify your account immediately.\n\nClick here to verify: http://amaz0n-verify.com/account\n\nThank you,\nAmazon Support Team',
      questions: [
        {
          question: 'What is suspicious about the sender email address?',
          type: 'multiple-choice',
          options: [
            'The domain looks legitimate',
            'Suspicious sender domain (amaz0n.com instead of amazon.com)',
            'The email is from a trusted source',
            'Nothing is suspicious'
          ],
        },
        {
          question: 'What red flag is present in the email subject?',
          type: 'multiple-choice',
          options: [
            'Professional language',
            'Urgent language creating panic',
            'Clear instructions',
            'No red flags'
          ],
        },
        {
          question: 'Is the link in the email safe to click?',
          type: 'multiple-choice',
          options: [
            'Yes, it looks safe',
            'No, suspicious link domain',
            'Maybe, I should check first',
            'I cannot tell'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Suspicious sender domain (amaz0n.com instead of amazon.com)',
      'question-1': 'Urgent language creating panic',
      'question-2': 'No, suspicious link domain',
    },
    points: 5,
    time_limit: 300,
    hint: 'Look for typos in the domain name (amaz0n vs amazon). Legitimate companies use their official domain names.',
  },
  {
    category: 'phishing',
    level: 2,
    title: 'Suspicious Sender Domain',
    description: 'Recognize suspicious email senders and domains. Pay attention to typos and domain variations.',
    content: {
      type: 'email',
      from: 'support@paypai.com',
      to: 'user@example.com',
      subject: 'Security Alert: Unusual Activity Detected',
      body: 'We detected unusual activity on your account. Please confirm your identity by clicking the link below.\n\nhttps://paypai.com/verify\n\nIf you did not make this request, please ignore this email.',
      questions: [
        {
          question: 'What is wrong with the sender domain?',
          type: 'multiple-choice',
          options: [
            'paypai.com (typo in domain - should be paypal.com)',
            'The domain is correct',
            'The domain looks professional',
            'Nothing is wrong'
          ],
        },
        {
          question: 'What should you do with this email?',
          type: 'multiple-choice',
          options: [
            'Click the link immediately',
            'Delete it - it is likely phishing',
            'Forward it to friends',
            'Reply to verify'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'paypai.com (typo in domain - should be paypal.com)',
      'question-1': 'Delete it - it is likely phishing',
    },
    points: 10,
    time_limit: 240,
    hint: 'Check the domain carefully - "paypai" is a typo. The correct PayPal domain is "paypal.com".',
  },
  {
    category: 'phishing',
    level: 3,
    title: 'Sophisticated Phishing Attempt',
    description: 'Identify subtle phishing attempts with legitimate-looking elements. Look for subdomain tricks and fake domains.',
    content: {
      type: 'email',
      from: 'noreply@microsoft.com',
      to: 'user@example.com',
      subject: 'Action Required: Update Your Security Settings',
      body: 'Microsoft has updated its security policies. Please update your account settings within 48 hours to maintain access.\n\nVisit: https://account.microsoft.com-security-update.com\n\nThis is an automated message. Please do not reply.',
      questions: [
        {
          question: 'What is suspicious about the URL?',
          type: 'multiple-choice',
          options: [
            'Suspicious subdomain in URL (microsoft.com-security-update.com)',
            'The URL looks legitimate',
            'HTTPS makes it safe',
            'Nothing is suspicious'
          ],
        },
        {
          question: 'How should you verify this email?',
          type: 'multiple-choice',
          options: [
            'Click the link to verify',
            'Log in directly to Microsoft website to check',
            'Reply to the email',
            'Forward it to Microsoft'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Suspicious subdomain in URL (microsoft.com-security-update.com)',
      'question-1': 'Log in directly to Microsoft website to check',
    },
    points: 15,
    time_limit: 180,
    hint: 'Urgent language creating panic is a common phishing tactic',
  },
  {
    category: 'phishing',
    level: 4,
    title: 'CEO Fraud Email',
    description: 'Identify CEO fraud (Business Email Compromise) attempts. These emails impersonate executives to trick employees.',
    content: {
      type: 'email',
      from: 'ceo@company.com',
      to: 'finance@company.com',
      subject: 'URGENT: Wire Transfer Required',
      body: 'Hi,\n\nI need you to process an urgent wire transfer of $50,000 to account 1234567890 at First National Bank.\n\nThis is confidential and time-sensitive. Please process immediately.\n\nThanks,\nCEO',
      questions: [
        {
          question: 'What red flags indicate this might be a phishing email?',
          type: 'multiple-choice',
          options: [
            'Urgent request for money transfer, informal tone, no verification',
            'Professional email format',
            'CEO signature looks authentic',
            'No red flags present'
          ],
        },
        {
          question: 'What should you do before processing this request?',
          type: 'multiple-choice',
          options: [
            'Process immediately as requested',
            'Verify the request through a separate communication channel',
            'Forward to IT department',
            'Reply asking for more details'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Urgent request for money transfer, informal tone, no verification',
      'question-1': 'Verify the request through a separate communication channel',
    },
    points: 20,
    time_limit: 240,
    hint: 'Always verify links before clicking - check the domain',
  },
  {
    category: 'phishing',
    level: 5,
    title: 'Invoice Phishing Scam',
    description: 'Identify invoice phishing scams that target businesses. Look for fake invoices and payment requests.',
    content: {
      type: 'email',
      from: 'billing@vendor-services.com',
      to: 'accounts@company.com',
      subject: 'Invoice #INV-2024-001 - Payment Overdue',
      body: 'Dear Accounts Department,\n\nYour invoice #INV-2024-001 for $2,500 is now overdue.\n\nPlease make payment immediately to avoid service interruption.\n\nView invoice: https://vendor-services.com/invoice/INV-2024-001\n\nIf you have questions, reply to this email.',
      questions: [
        {
          question: 'What should you verify before paying this invoice?',
          type: 'multiple-choice',
          options: [
            'Verify the vendor exists and the invoice is legitimate',
            'Pay immediately to avoid service interruption',
            'Click the link to view the invoice',
            'Reply to confirm payment'
          ],
        },
        {
          question: 'What is a safer way to handle this?',
          type: 'multiple-choice',
          options: [
            'Contact the vendor through known contact information',
            'Click the link in the email',
            'Reply to the email address',
            'Forward to all departments'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Verify the vendor exists and the invoice is legitimate',
      'question-1': 'Contact the vendor through known contact information',
    },
    points: 25,
    time_limit: 300,
    hint: 'Legitimate companies use their official domain names only',
  },
  {
    category: 'phishing',
    level: 6,
    title: 'Credential Harvesting Email',
    description: 'Identify credential harvesting attempts. These emails try to steal your login credentials.',
    content: {
      type: 'email',
      from: 'security@netflix-account.com',
      to: 'user@example.com',
      subject: 'Your Netflix Account Has Been Suspended',
      body: 'We have temporarily suspended your Netflix account due to suspicious activity.\n\nTo reactivate your account, please verify your information:\n\nClick here: https://netflix-account.com/verify\n\nIf you did not request this, please contact support immediately.',
      questions: [
        {
          question: 'What is suspicious about this email?',
          type: 'multiple-choice',
          options: [
            'Fake domain (netflix-account.com instead of netflix.com)',
            'Professional formatting',
            'Security concern mentioned',
            'Nothing is suspicious'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Click the link to verify',
            'Log in directly to Netflix website to check your account',
            'Reply to the email',
            'Forward to friends'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Fake domain (netflix-account.com instead of netflix.com)',
      'question-1': 'Log in directly to Netflix website to check your account',
    },
    points: 30,
    time_limit: 180,
    hint: 'Check for suspicious subdomains in URLs',
  },
  {
    category: 'phishing',
    level: 7,
    title: 'Social Engineering Phishing',
    description: 'Identify social engineering tactics in phishing emails. These use psychological manipulation.',
    content: {
      type: 'email',
      from: 'winner@lottery-international.com',
      to: 'user@example.com',
      subject: 'Congratulations! You Won $1,000,000!',
      body: 'Congratulations! You have been selected as the winner of our international lottery!\n\nTo claim your prize of $1,000,000, please provide your personal information and pay a processing fee of $500.\n\nClick here to claim: https://lottery-international.com/claim\n\nThis offer expires in 48 hours.',
      questions: [
        {
          question: 'What social engineering tactics are used here?',
          type: 'multiple-choice',
          options: [
            'Too good to be true offer, urgency, request for payment',
            'Professional communication',
            'Legitimate lottery notification',
            'No tactics used'
          ],
        },
        {
          question: 'What is the correct action?',
          type: 'multiple-choice',
          options: [
            'Provide information and pay the fee',
            'Ignore and delete the email',
            'Forward to friends',
            'Click the link to verify'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Too good to be true offer, urgency, request for payment',
      'question-1': 'Ignore and delete the email',
    },
    points: 35,
    time_limit: 240,
    hint: 'Too good to be true offers are usually scams',
  },
  {
    category: 'phishing',
    level: 8,
    title: 'Spear Phishing Attack',
    description: 'Identify targeted spear phishing attacks. These are personalized and harder to detect.',
    content: {
      type: 'email',
      from: 'hr@company.com',
      to: 'employee@company.com',
      subject: 'Action Required: Update Your Employee Benefits',
      body: 'Dear Employee,\n\nAs part of our annual benefits update, please review and update your information.\n\nWe noticed you haven\'t updated your benefits profile this year.\n\nClick here to update: https://company-benefits.com/update?id=employee123\n\nThis must be completed by Friday.',
      questions: [
        {
          question: 'What makes this spear phishing attempt convincing?',
          type: 'multiple-choice',
          options: [
            'Personalized content, legitimate-looking sender, specific deadline',
            'Generic greeting',
            'Suspicious domain',
            'Urgent language only'
          ],
        },
        {
          question: 'How should you verify this email?',
          type: 'multiple-choice',
          options: [
            'Click the link immediately',
            'Contact HR department directly to verify',
            'Reply to the email',
            'Forward to IT'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Personalized content, legitimate-looking sender, specific deadline',
      'question-1': 'Contact HR department directly to verify',
    },
    points: 40,
    time_limit: 300,
    hint: 'Verify with official sources before taking action',
  },
  {
    category: 'phishing',
    level: 9,
    title: 'Multi-Vector Phishing',
    description: 'Identify sophisticated multi-vector phishing attacks that combine multiple techniques.',
    content: {
      type: 'email',
      from: 'security@banking-secure.com',
      to: 'customer@example.com',
      subject: 'Security Alert: Unauthorized Login Attempt',
      body: 'We detected an unauthorized login attempt to your account from an unknown device in a different location.\n\nIf this was not you, please secure your account immediately:\n\n1. Click here to verify: https://banking-secure.com/verify\n2. Change your password\n3. Enable two-factor authentication\n\nIf you do not act within 2 hours, your account will be locked for security.',
      questions: [
        {
          question: 'What techniques are used in this phishing attempt?',
          type: 'multiple-choice',
          options: [
            'Fear (unauthorized access), urgency (2 hours), fake security measures',
            'Professional security alert',
            'Legitimate bank communication',
            'Simple request'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Click the link to secure your account',
            'Log in directly to your bank website to check',
            'Reply to confirm it was you',
            'Ignore the email'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Fear (unauthorized access), urgency (2 hours), fake security measures',
      'question-1': 'Log in directly to your bank website to check',
    },
    points: 45,
    time_limit: 180,
    hint: 'Fear tactics (account suspension, security alerts) are common',
  },
  {
    category: 'phishing',
    level: 10,
    title: 'Advanced Persistent Phishing',
    description: 'Identify the most sophisticated phishing attempts with legitimate-looking elements and advanced techniques.',
    content: {
      type: 'email',
      from: 'noreply@microsoft-account-security.com',
      to: 'user@example.com',
      subject: 'Microsoft Account Security: Action Required',
      body: 'Dear Microsoft Account Holder,\n\nWe have detected unusual activity on your Microsoft account. For your security, we have temporarily restricted access.\n\nTo restore access, please verify your identity:\n\nVisit: https://account.microsoft.com-security-verify.com/restore\n\nThis is an automated security measure. If you did not request this, please contact support immediately.\n\nMicrosoft Security Team',
      questions: [
        {
          question: 'What advanced techniques make this phishing attempt sophisticated?',
          type: 'multiple-choice',
          options: [
            'Legitimate-looking domain variation, professional formatting, security concern',
            'Obvious typos',
            'Suspicious sender',
            'Generic content'
          ],
        },
        {
          question: 'How can you verify this is legitimate?',
          type: 'multiple-choice',
          options: [
            'Click the link to verify',
            'Log in directly to account.microsoft.com (official domain)',
            'Reply to the email',
            'Call the number in the email'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Legitimate-looking domain variation, professional formatting, security concern',
      'question-1': 'Log in directly to account.microsoft.com (official domain)',
    },
    points: 50,
    time_limit: 240,
    hint: 'Professional formatting can be faked - verify the source',
  },

  // ========== PASSWORD CHALLENGES (Levels 1-10) ==========
  {
    category: 'password',
    level: 1,
    title: 'Password Strength Basics',
    description: 'Evaluate basic password strength. Learn what makes a password weak or strong.',
    content: {
      type: 'password',
      password: 'password123',
      context: 'A user wants to use this password for their email account.',
      questions: [
        {
          question: 'How would you rate this password?',
          type: 'multiple-choice',
          options: [
            'Weak - common word with numbers',
            'Strong - contains numbers',
            'Moderate - has letters and numbers',
            'Very strong'
          ],
        },
        {
          question: 'Should this password be used?',
          type: 'multiple-choice',
          options: [
            'Yes, it is acceptable',
            'No, it is too weak and easily guessable',
            'Maybe for low-security accounts',
            'Only if combined with 2FA'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Weak - common word with numbers',
      'question-1': 'No, it is too weak and easily guessable',
    },
    points: 5,
    time_limit: 120,
    hint: 'Common words with numbers are easily guessable',
  },
  {
    category: 'password',
    level: 2,
    title: 'Password Complexity',
    description: 'Assess password complexity and security. Understand what makes a password complex.',
    content: {
      type: 'password',
      password: 'MyDog2024!',
      context: 'Password for online banking account.',
      questions: [
        {
          question: 'What is the main weakness of this password?',
          type: 'multiple-choice',
          options: [
            'Contains personal information (pet name)',
            'Too short',
            'No special characters',
            'No weaknesses'
          ],
        },
        {
          question: 'Is this password secure for banking?',
          type: 'multiple-choice',
          options: [
            'Yes, it has uppercase, lowercase, numbers, and symbols',
            'No - personal information makes it guessable',
            'Maybe, depends on the bank',
            'Only with 2FA'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Contains personal information (pet name)',
      'question-1': 'No - personal information makes it guessable',
    },
    points: 10,
    time_limit: 180,
    hint: 'Personal information (pet names, birthdays) makes passwords weak',
  },
  {
    category: 'password',
    level: 3,
    title: 'Password Best Practices',
    description: 'Evaluate passwords against security best practices. Learn about passphrases vs passwords.',
    content: {
      type: 'password',
      password: 'Tr0ub@dor&3',
      context: 'Password for corporate account with sensitive data.',
      questions: [
        {
          question: 'What is the issue with this password?',
          type: 'multiple-choice',
          options: [
            'Complex but memorable pattern (Troubador) makes it guessable',
            'Too simple',
            'No special characters',
            'No issues'
          ],
        },
        {
          question: 'What would be a better alternative?',
          type: 'multiple-choice',
          options: [
            'Use a passphrase like "CorrectHorseBatteryStaple"',
            'Make it more complex',
            'Add more numbers',
            'Use the same password everywhere'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Complex but memorable pattern (Troubador) makes it guessable',
      'question-1': 'Use a passphrase like "CorrectHorseBatteryStaple"',
    },
    points: 15,
    time_limit: 240,
    hint: 'Length matters more than complexity for password strength',
  },
  {
    category: 'password',
    level: 4,
    title: 'Password Reuse Risk',
    description: 'Understand the risks of password reuse across multiple accounts.',
    content: {
      type: 'scenario',
      scenario: 'A user uses the same password "SecurePass123!" for their email, social media, and banking accounts. One of these services gets breached and the password is leaked.',
      questions: [
        {
          question: 'What is the main risk?',
          type: 'multiple-choice',
          options: [
            'All accounts become vulnerable if one is breached',
            'No risk if password is strong',
            'Only the breached account is at risk',
            'Passwords cannot be stolen'
          ],
        },
        {
          question: 'What should the user do?',
          type: 'multiple-choice',
          options: [
            'Use the same password for all accounts',
            'Use unique passwords for each account',
            'Change password only for breached account',
            'Nothing, password is secure'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'All accounts become vulnerable if one is breached',
      'question-1': 'Use unique passwords for each account',
    },
    points: 20,
    time_limit: 180,
    hint: 'Use unique passwords for each account to prevent breaches',
  },
  {
    category: 'password',
    level: 5,
    title: 'Password Manager Usage',
    description: 'Learn about password managers and their benefits for security.',
    content: {
      type: 'scenario',
      scenario: 'A user is considering using a password manager but is concerned about storing all passwords in one place.',
      questions: [
        {
          question: 'What is the main benefit of password managers?',
          type: 'multiple-choice',
          options: [
            'Generate and store unique, strong passwords for each account',
            'Remember passwords for you',
            'Make passwords shorter',
            'No benefits'
          ],
        },
        {
          question: 'Are password managers secure?',
          type: 'multiple-choice',
          options: [
            'Yes, they use strong encryption and are more secure than reusing passwords',
            'No, they are not secure',
            'Only if you use a free one',
            'Depends on the device'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Generate and store unique, strong passwords for each account',
      'question-1': 'Yes, they use strong encryption and are more secure than reusing passwords',
    },
    points: 25,
    time_limit: 240,
    hint: 'Password managers generate and store strong passwords securely',
  },
  {
    category: 'password',
    level: 6,
    title: 'Two-Factor Authentication',
    description: 'Understand the importance of two-factor authentication (2FA) with passwords.',
    content: {
      type: 'scenario',
      scenario: 'A user has a strong password but has not enabled two-factor authentication on their accounts.',
      questions: [
        {
          question: 'What additional protection does 2FA provide?',
          type: 'multiple-choice',
          options: [
            'Requires second verification even if password is stolen',
            'Makes password stronger',
            'Replaces the need for a password',
            'No additional protection'
          ],
        },
        {
          question: 'Should 2FA be enabled?',
          type: 'multiple-choice',
          options: [
            'Yes, for all important accounts',
            'No, it is inconvenient',
            'Only for banking',
            'Only if password is weak'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Requires second verification even if password is stolen',
      'question-1': 'Yes, for all important accounts',
    },
    points: 30,
    time_limit: 180,
    hint: 'Two-factor authentication adds an extra layer of protection',
  },
  {
    category: 'password',
    level: 7,
    title: 'Password Patterns and Predictability',
    description: 'Identify predictable password patterns that attackers can exploit.',
    content: {
      type: 'password',
      password: 'Summer2024!',
      context: 'Password created in summer 2024, using season and year.',
      questions: [
        {
          question: 'What makes this password predictable?',
          type: 'multiple-choice',
          options: [
            'Uses current season and year - easily guessable pattern',
            'Too short',
            'No special characters',
            'Not predictable'
          ],
        },
        {
          question: 'How can this be improved?',
          type: 'multiple-choice',
          options: [
            'Use random words unrelated to personal info or dates',
            'Add more numbers',
            'Make it longer with same pattern',
            'Use uppercase only'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Uses current season and year - easily guessable pattern',
      'question-1': 'Use random words unrelated to personal info or dates',
    },
    points: 35,
    time_limit: 240,
    hint: 'Avoid predictable patterns like seasons and years',
  },
  {
    category: 'password',
    level: 8,
    title: 'Password Recovery Security',
    description: 'Understand security considerations for password recovery methods.',
    content: {
      type: 'scenario',
      scenario: 'A user sets up password recovery using security questions with answers like their mother\'s maiden name and pet\'s name, which are easily found on social media.',
      questions: [
        {
          question: 'What is the security risk?',
          type: 'multiple-choice',
          options: [
            'Answers can be found through social engineering or social media',
            'No risk if questions are personal',
            'Security questions are always secure',
            'Only risk if password is weak'
          ],
        },
        {
          question: 'What is a better approach?',
          type: 'multiple-choice',
          options: [
            'Use answers that are not publicly available or use fake answers you can remember',
            'Use real personal information',
            'Skip security questions',
            'Use the same answers everywhere'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Answers can be found through social engineering or social media',
      'question-1': 'Use answers that are not publicly available or use fake answers you can remember',
    },
    points: 40,
    time_limit: 300,
    hint: 'Security question answers can be found through social media',
  },
  {
    category: 'password',
    level: 9,
    title: 'Password Expiration Policies',
    description: 'Understand when and why passwords should be changed.',
    content: {
      type: 'scenario',
      scenario: 'A company requires employees to change passwords every 30 days. Employees often make minor changes like adding a number at the end.',
      questions: [
        {
          question: 'What is the problem with frequent forced password changes?',
          type: 'multiple-choice',
          options: [
            'Users create predictable patterns (Password1, Password2, etc.)',
            'Passwords become stronger',
            'No problem, it is good security',
            'Users remember passwords better'
          ],
        },
        {
          question: 'When should passwords be changed?',
          type: 'multiple-choice',
          options: [
            'Only when there is evidence of compromise or breach',
            'Every 30 days automatically',
            'Never change passwords',
            'Only when forgotten'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Users create predictable patterns (Password1, Password2, etc.)',
      'question-1': 'Only when there is evidence of compromise or breach',
    },
    points: 45,
    time_limit: 240,
    hint: 'Frequent forced password changes create weak patterns',
  },
  {
    category: 'password',
    level: 10,
    title: 'Advanced Password Security',
    description: 'Master advanced password security concepts including passphrases and entropy.',
    content: {
      type: 'scenario',
      scenario: 'Compare two options: Password1: "P@ssw0rd123!" (12 chars, complex) vs Password2: "CorrectHorseBatteryStaple" (28 chars, simple words).',
      questions: [
        {
          question: 'Which password is more secure and why?',
          type: 'multiple-choice',
          options: [
            'Password2 - longer passphrase with more entropy despite simpler characters',
            'Password1 - has special characters',
            'Both are equally secure',
            'Password1 - shorter is better'
          ],
        },
        {
          question: 'What makes a strong passphrase?',
          type: 'multiple-choice',
          options: [
            'Multiple random words, length, unpredictability',
            'Complex characters only',
            'Short and memorable',
            'Uses personal information'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Password2 - longer passphrase with more entropy despite simpler characters',
      'question-1': 'Multiple random words, length, unpredictability',
    },
    points: 50,
    time_limit: 300,
    hint: 'Passphrases with random words are stronger than complex passwords',
  },

  // ========== MALWARE CHALLENGES (Levels 1-10) ==========
  {
    category: 'malware',
    level: 1,
    title: 'Malware Warning Signs',
    description: 'Identify obvious malware warning signs. Learn to recognize suspicious files and emails.',
    content: {
      type: 'scenario',
      scenario: 'You receive an email with an attachment named "invoice.exe" from an unknown sender. The email claims you won a prize and need to open the attachment to claim it.',
      questions: [
        {
          question: 'What are the red flags?',
          type: 'multiple-choice',
          options: [
            'Executable file (.exe) as attachment, unknown sender, too good to be true offer',
            'Email format looks professional',
            'Attachment has a name',
            'No red flags'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Open the attachment to claim the prize',
            'Delete the email without opening the attachment',
            'Forward to friends',
            'Reply to verify'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Executable file (.exe) as attachment, unknown sender, too good to be true offer',
      'question-1': 'Delete the email without opening the attachment',
    },
    points: 5,
    time_limit: 180,
    hint: 'Executable files (.exe, .scr) as attachments are dangerous',
  },
  {
    category: 'malware',
    level: 2,
    title: 'Suspicious Downloads',
    description: 'Recognize suspicious download sources and file types. Learn about dangerous file extensions.',
    content: {
      type: 'scenario',
      scenario: 'A popup appears on a website claiming your computer is infected. It offers a free antivirus download (setup.scr) to fix the problem immediately.',
      questions: [
        {
          question: 'What are the warning signs?',
          type: 'multiple-choice',
          options: [
            'Unsolicited popup warning, suspicious file extension (.scr), pressure to act immediately',
            'Free antivirus offer',
            'Popup notification',
            'No warning signs'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Download and install the antivirus',
            'Close the popup and run your own antivirus scan',
            'Click to learn more',
            'Ignore and continue browsing'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Unsolicited popup warning, suspicious file extension (.scr), pressure to act immediately',
      'question-1': 'Close the popup and run your own antivirus scan',
    },
    points: 10,
    time_limit: 240,
    hint: 'Unsolicited popups offering fixes are usually scams',
  },
  {
    category: 'malware',
    level: 3,
    title: 'Macro-Enabled Documents',
    description: 'Identify malware distributed through macro-enabled documents. Learn about Office macro threats.',
    content: {
      type: 'scenario',
      scenario: 'You receive a PDF document from a colleague via email. The email looks legitimate, but the PDF asks you to enable macros to view the content properly.',
      questions: [
        {
          question: 'What is suspicious?',
          type: 'multiple-choice',
          options: [
            'PDFs should not require macros - this is likely malware',
            'Colleague sent it so it is safe',
            'PDF format is always safe',
            'Nothing is suspicious'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Enable macros as requested',
            'Verify with sender before opening, and never enable macros in PDFs',
            'Open the PDF normally',
            'Forward to IT'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'PDFs should not require macros - this is likely malware',
      'question-1': 'Verify with sender before opening, and never enable macros in PDFs',
    },
    points: 15,
    time_limit: 300,
    hint: 'PDFs should not require macros - this is suspicious',
  },
  {
    category: 'malware',
    level: 4,
    title: 'Ransomware Awareness',
    description: 'Understand ransomware threats and how they work. Learn to prevent ransomware attacks.',
    content: {
      type: 'scenario',
      scenario: 'You receive an email with a Word document attachment. After opening it and enabling macros, your files become encrypted and you see a message demanding payment to unlock them.',
      questions: [
        {
          question: 'What type of malware is this?',
          type: 'multiple-choice',
          options: [
            'Ransomware - encrypts files and demands payment',
            'Virus',
            'Spyware',
            'Adware'
          ],
        },
        {
          question: 'How could this have been prevented?',
          type: 'multiple-choice',
          options: [
            'Not opening suspicious attachments, not enabling macros, having backups',
            'Paying the ransom',
            'Disabling antivirus',
            'Opening all attachments'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Ransomware - encrypts files and demands payment',
      'question-1': 'Not opening suspicious attachments, not enabling macros, having backups',
    },
    points: 20,
    time_limit: 240,
    hint: 'Ransomware encrypts files and demands payment to unlock',
  },
  {
    category: 'malware',
    level: 5,
    title: 'Trojan Horse Detection',
    description: 'Identify trojan horse malware that disguises itself as legitimate software.',
    content: {
      type: 'scenario',
      scenario: 'You download what appears to be a legitimate software update from a third-party website. After installation, your computer starts behaving strangely and you notice unauthorized network connections.',
      questions: [
        {
          question: 'What type of malware is this likely?',
          type: 'multiple-choice',
          options: [
            'Trojan horse - appears legitimate but contains malware',
            'Legitimate software',
            'Virus',
            'False alarm'
          ],
        },
        {
          question: 'What is the best practice?',
          type: 'multiple-choice',
          options: [
            'Download software only from official sources',
            'Download from any website',
            'Trust third-party sites',
            'Disable antivirus for faster downloads'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Trojan horse - appears legitimate but contains malware',
      'question-1': 'Download software only from official sources',
    },
    points: 25,
    time_limit: 300,
    hint: 'Download software only from official, trusted sources',
  },
  {
    category: 'malware',
    level: 6,
    title: 'Spyware and Keyloggers',
    description: 'Understand spyware and keylogger threats. Learn how they steal information.',
    content: {
      type: 'scenario',
      scenario: 'You install a "free" screen recording software. Later, you notice your passwords and credit card information are being used fraudulently, even though you never shared them.',
      questions: [
        {
          question: 'What type of malware likely caused this?',
          type: 'multiple-choice',
          options: [
            'Spyware/keylogger - records keystrokes and steals information',
            'Ransomware',
            'Adware',
            'Legitimate software'
          ],
        },
        {
          question: 'How can you protect against this?',
          type: 'multiple-choice',
          options: [
            'Only install software from trusted sources, use antivirus, be cautious with free software',
            'Install any free software',
            'Disable security software',
            'Share passwords openly'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Spyware/keylogger - records keystrokes and steals information',
      'question-1': 'Only install software from trusted sources, use antivirus, be cautious with free software',
    },
    points: 30,
    time_limit: 240,
    hint: 'Free software can contain spyware that steals information',
  },
  {
    category: 'malware',
    level: 7,
    title: 'Drive-By Downloads',
    description: 'Identify drive-by download attacks that install malware without user interaction.',
    content: {
      type: 'scenario',
      scenario: 'You visit a website and suddenly your browser starts downloading files automatically. You did not click any download links.',
      questions: [
        {
          question: 'What is happening?',
          type: 'multiple-choice',
          options: [
            'Drive-by download attack - malware downloads automatically from compromised website',
            'Normal browser behavior',
            'Legitimate software update',
            'Browser bug'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Close browser immediately, run antivirus scan, avoid the website',
            'Allow the downloads',
            'Click on the downloads',
            'Ignore it'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Drive-by download attack - malware downloads automatically from compromised website',
      'question-1': 'Close browser immediately, run antivirus scan, avoid the website',
    },
    points: 35,
    time_limit: 180,
    hint: 'Drive-by downloads happen automatically from compromised sites',
  },
  {
    category: 'malware',
    level: 8,
    title: 'Social Engineering Malware',
    description: 'Understand how social engineering is used to distribute malware.',
    content: {
      type: 'scenario',
      scenario: 'You receive a call from "tech support" claiming your computer has a virus. They ask you to download remote access software so they can "fix" it.',
      questions: [
        {
          question: 'What is this likely?',
          type: 'multiple-choice',
          options: [
            'Social engineering scam - legitimate tech support does not call unsolicited',
            'Legitimate tech support',
            'Software update',
            'Helpful service'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Hang up and never allow remote access to unsolicited callers',
            'Follow their instructions',
            'Download the software',
            'Give them your password'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Social engineering scam - legitimate tech support does not call unsolicited',
      'question-1': 'Hang up and never allow remote access to unsolicited callers',
    },
    points: 40,
    time_limit: 240,
    hint: 'Legitimate tech support does not call unsolicited',
  },
  {
    category: 'malware',
    level: 9,
    title: 'Advanced Persistent Threats',
    description: 'Understand Advanced Persistent Threats (APTs) and their characteristics.',
    content: {
      type: 'scenario',
      scenario: 'Malware has been on a system for months, slowly stealing data and avoiding detection. It uses legitimate system processes and encrypts communications.',
      questions: [
        {
          question: 'What type of threat is this?',
          type: 'multiple-choice',
          options: [
            'Advanced Persistent Threat (APT) - sophisticated, long-term, hard to detect',
            'Simple virus',
            'Adware',
            'False positive'
          ],
        },
        {
          question: 'How can organizations defend against APTs?',
          type: 'multiple-choice',
          options: [
            'Multi-layered security, network monitoring, regular security audits, employee training',
            'Basic antivirus only',
            'Ignore threats',
            'Disable all security'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Advanced Persistent Threat (APT) - sophisticated, long-term, hard to detect',
      'question-1': 'Multi-layered security, network monitoring, regular security audits, employee training',
    },
    points: 45,
    time_limit: 300,
    hint: 'APTs are sophisticated, long-term threats that avoid detection',
  },
  {
    category: 'malware',
    level: 10,
    title: 'Zero-Day Exploits',
    description: 'Understand zero-day exploits and how to protect against unknown vulnerabilities.',
    content: {
      type: 'scenario',
      scenario: 'A new malware exploits a previously unknown vulnerability in popular software. No antivirus detects it, and there is no patch available yet.',
      questions: [
        {
          question: 'What is this type of attack?',
          type: 'multiple-choice',
          options: [
            'Zero-day exploit - uses unknown vulnerability with no available patch',
            'Known malware',
            'False positive',
            'Legitimate software'
          ],
        },
        {
          question: 'How can you protect against zero-days?',
          type: 'multiple-choice',
          options: [
            'Keep software updated, use defense-in-depth, limit software installation, network segmentation',
            'Only use antivirus',
            'Disable updates',
            'Install all software'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Zero-day exploit - uses unknown vulnerability with no available patch',
      'question-1': 'Keep software updated, use defense-in-depth, limit software installation, network segmentation',
    },
    points: 50,
    time_limit: 240,
    hint: 'Zero-day exploits use unknown vulnerabilities with no patch available',
  },

  // ========== NETWORK SECURITY CHALLENGES (Levels 1-10) ==========
  {
    category: 'network',
    level: 1,
    title: 'Public vs Private Networks',
    description: 'Distinguish between public and private networks. Understand the security implications.',
    content: {
      type: 'scenario',
      scenario: 'You are at a coffee shop and connect to their free WiFi network named "CoffeeShop_Free_WiFi". Should you access your online banking?',
      questions: [
        {
          question: 'Is this network safe for banking?',
          type: 'multiple-choice',
          options: [
            'No - public networks are not secure for sensitive activities',
            'Yes, if it has a password',
            'Yes, all WiFi is safe',
            'Maybe, depends on the coffee shop'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Use VPN or wait for secure network',
            'Access banking directly',
            'Use public WiFi for all activities',
            'Share your password'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'No - public networks are not secure for sensitive activities',
      'question-1': 'Use VPN or wait for secure network',
    },
    points: 5,
    time_limit: 120,
    hint: 'Public WiFi networks are not secure for sensitive activities',
  },
  {
    category: 'network',
    level: 2,
    title: 'WiFi Security Standards',
    description: 'Evaluate WiFi network security. Understand WPA, WPA2, and WPA3.',
    content: {
      type: 'scenario',
      scenario: 'You see two WiFi networks: "Home_Network" (no password) and "Home_Network_5G" (WPA2 password). Both claim to be from your building.',
      questions: [
        {
          question: 'Which network should you choose?',
          type: 'multiple-choice',
          options: [
            'Choose WPA2 protected network',
            'Choose the open network',
            'Either is fine',
            'Create your own network'
          ],
        },
        {
          question: 'What else should you verify?',
          type: 'multiple-choice',
          options: [
            'Verify network name with building management',
            'Connect to both',
            'Use the first one you see',
            'No verification needed'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Choose WPA2 protected network',
      'question-1': 'Verify network name with building management',
    },
    points: 10,
    time_limit: 180,
    hint: 'WPA2 protected networks are safer than open networks',
  },
  {
    category: 'network',
    level: 3,
    title: 'Man-in-the-Middle Attacks',
    description: 'Identify potential MITM attack scenarios. Understand how attackers intercept communications.',
    content: {
      type: 'scenario',
      scenario: 'You connect to a public WiFi. Your browser shows a certificate warning when accessing your bank website, but the URL looks correct.',
      questions: [
        {
          question: 'What does the certificate warning indicate?',
          type: 'multiple-choice',
          options: [
            'Potential MITM attack - someone may be intercepting your connection',
            'Normal browser behavior',
            'Website is down',
            'No issue'
          ],
        },
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Disconnect and use mobile data',
            'Proceed anyway',
            'Ignore the warning',
            'Click through the warning'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Potential MITM attack - someone may be intercepting your connection',
      'question-1': 'Disconnect and use mobile data',
    },
    points: 15,
    time_limit: 240,
    hint: 'Certificate warnings indicate potential man-in-the-middle attacks',
  },
  {
    category: 'network',
    level: 4,
    title: 'VPN Usage and Security',
    description: 'Understand when and why to use VPNs. Learn about VPN security benefits.',
    content: {
      type: 'scenario',
      scenario: 'You need to access work email from a public WiFi network at an airport.',
      questions: [
        {
          question: 'Should you use a VPN?',
          type: 'multiple-choice',
          options: [
            'Yes, VPN encrypts your connection and protects data on public networks',
            'No, VPN is not needed',
            'Only for streaming',
            'VPN makes you slower only'
          ],
        },
        {
          question: 'What should you look for in a VPN?',
          type: 'multiple-choice',
          options: [
            'Reputable provider, no-logging policy, strong encryption',
            'Free VPNs are always best',
            'Any VPN is fine',
            'VPNs are not secure'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Yes, VPN encrypts your connection and protects data on public networks',
      'question-1': 'Reputable provider, no-logging policy, strong encryption',
    },
    points: 20,
    time_limit: 300,
    hint: 'VPNs encrypt your connection and protect data on public networks',
  },
  {
    category: 'network',
    level: 5,
    title: 'Rogue Access Points',
    description: 'Identify rogue WiFi access points that attackers set up to steal data.',
    content: {
      type: 'scenario',
      scenario: 'At a hotel, you see multiple WiFi networks: "Hotel_Guest", "Hotel_Guest_Free", and "Hotel_WiFi_Official". You are not sure which is legitimate.',
      questions: [
        {
          question: 'What could be a rogue access point?',
          type: 'multiple-choice',
          options: [
            'Any network not officially provided by the hotel could be a rogue AP',
            'All networks are safe',
            'Only password-protected ones',
            'Rogue APs do not exist'
          ],
        },
        {
          question: 'How can you verify?',
          type: 'multiple-choice',
          options: [
            'Ask hotel staff for the official network name and password',
            'Connect to the strongest signal',
            'Try all networks',
            'Use any open network'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Any network not officially provided by the hotel could be a rogue AP',
      'question-1': 'Ask hotel staff for the official network name and password',
    },
    points: 25,
    time_limit: 240,
    hint: 'Rogue access points mimic legitimate networks to steal data',
  },
  {
    category: 'network',
    level: 6,
    title: 'Network Segmentation',
    description: 'Understand network segmentation and its security benefits.',
    content: {
      type: 'scenario',
      scenario: 'A company has all devices (servers, workstations, IoT devices) on the same network. An IoT device gets compromised.',
      questions: [
        {
          question: 'What is the security risk?',
          type: 'multiple-choice',
          options: [
            'Compromised device can access all other devices on the same network',
            'No risk if devices are updated',
            'Only the IoT device is at risk',
            'Networks are always secure'
          ],
        },
        {
          question: 'How can this be improved?',
          type: 'multiple-choice',
          options: [
            'Network segmentation - separate networks for different device types',
            'Use the same network for everything',
            'Disable all security',
            'Only use wireless'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Compromised device can access all other devices on the same network',
      'question-1': 'Network segmentation - separate networks for different device types',
    },
    points: 30,
    time_limit: 300,
    hint: 'Network segmentation separates devices to limit breach impact',
  },
  {
    category: 'network',
    level: 7,
    title: 'Firewall Configuration',
    description: 'Understand firewall rules and proper network security configuration.',
    content: {
      type: 'scenario',
      scenario: 'A company firewall allows all incoming connections from the internet to internal servers.',
      questions: [
        {
          question: 'What is the security issue?',
          type: 'multiple-choice',
          options: [
            'Allows unauthorized access - firewall should restrict unnecessary connections',
            'No issue, firewalls always allow everything',
            'Firewalls are not needed',
            'This is secure configuration'
          ],
        },
        {
          question: 'What is the best practice?',
          type: 'multiple-choice',
          options: [
            'Allow only necessary ports and services, deny by default',
            'Allow all connections',
            'Disable firewall',
            'Open all ports'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Allows unauthorized access - firewall should restrict unnecessary connections',
      'question-1': 'Allow only necessary ports and services, deny by default',
    },
    points: 35,
    time_limit: 240,
    hint: 'Firewalls should restrict access - allow only necessary ports',
  },
  {
    category: 'network',
    level: 8,
    title: 'DNS Security',
    description: 'Understand DNS security threats and how to protect against DNS attacks.',
    content: {
      type: 'scenario',
      scenario: 'You type a bank website URL, but you are redirected to a fake website that looks identical. Your DNS may have been compromised.',
      questions: [
        {
          question: 'What type of attack is this?',
          type: 'multiple-choice',
          options: [
            'DNS hijacking/spoofing - redirects to malicious sites',
            'Legitimate redirect',
            'Browser issue',
            'Normal behavior'
          ],
        },
        {
          question: 'How can you protect against this?',
          type: 'multiple-choice',
          options: [
            'Use secure DNS (DNS over HTTPS), verify SSL certificates, check URLs carefully',
            'Use any DNS server',
            'Ignore certificate warnings',
            'Disable HTTPS'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'DNS hijacking/spoofing - redirects to malicious sites',
      'question-1': 'Use secure DNS (DNS over HTTPS), verify SSL certificates, check URLs carefully',
    },
    points: 40,
    time_limit: 300,
    hint: 'DNS hijacking redirects you to fake websites',
  },
  {
    category: 'network',
    level: 9,
    title: 'Network Monitoring and Intrusion Detection',
    description: 'Understand network monitoring and intrusion detection systems.',
    content: {
      type: 'scenario',
      scenario: 'A network shows unusual traffic patterns and connections to unknown external IP addresses, but no alerts are generated.',
      questions: [
        {
          question: 'What is missing?',
          type: 'multiple-choice',
          options: [
            'Network monitoring and intrusion detection systems to detect anomalies',
            'More bandwidth',
            'Faster internet',
            'Nothing is missing'
          ],
        },
        {
          question: 'What should be implemented?',
          type: 'multiple-choice',
          options: [
            'IDS/IPS, network monitoring, log analysis, anomaly detection',
            'No monitoring needed',
            'Only antivirus',
            'Disable all security'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Network monitoring and intrusion detection systems to detect anomalies',
      'question-1': 'IDS/IPS, network monitoring, log analysis, anomaly detection',
    },
    points: 45,
    time_limit: 240,
    hint: 'Network monitoring detects unusual traffic patterns',
  },
  {
    category: 'network',
    level: 10,
    title: 'Advanced Network Security',
    description: 'Master advanced network security concepts including zero-trust architecture.',
    content: {
      type: 'scenario',
      scenario: 'A company implements zero-trust network architecture where no device or user is trusted by default, even if inside the network perimeter.',
      questions: [
        {
          question: 'What is the principle of zero-trust?',
          type: 'multiple-choice',
          options: [
            'Never trust, always verify - authenticate and authorize every access request',
            'Trust all internal devices',
            'Only trust external connections',
            'No security needed'
          ],
        },
        {
          question: 'What are the benefits?',
          type: 'multiple-choice',
          options: [
            'Reduces risk of lateral movement, better security for remote work, granular access control',
            'Faster network speeds',
            'Easier to manage',
            'No benefits'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Never trust, always verify - authenticate and authorize every access request',
      'question-1': 'Reduces risk of lateral movement, better security for remote work, granular access control',
    },
    points: 50,
    time_limit: 300,
    hint: 'Zero-trust architecture never trusts by default - always verifies',
  },

  // ========== MALWARE AWARENESS CHALLENGES (Levels 1-10) ==========
  {
    category: 'malware_awareness',
    level: 1,
    title: 'Recognizing Malicious Software',
    description: 'Learn to identify suspicious software behavior and common malware indicators.',
    content: {
      type: 'scenario',
      scenario: 'Your computer suddenly starts running very slowly. Task Manager shows an unknown process using 90% CPU. You notice new browser toolbars and popups appearing.',
      questions: [
        {
          question: 'What are the signs of potential malware infection?',
          type: 'multiple-choice',
          options: [
            'Slow performance, unknown processes, unwanted browser changes, excessive resource usage',
            'Normal computer behavior',
            'Just needs a restart',
            'Hardware issue only'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Slow performance, unknown processes, unwanted browser changes, excessive resource usage',
    },
    points: 10,
    time_limit: 180,
    hint: 'Multiple symptoms together often indicate malware infection',
  },
  {
    category: 'malware_awareness',
    level: 2,
    title: 'Ransomware Prevention',
    description: 'Understand ransomware attacks and how to protect against them.',
    content: {
      type: 'scenario',
      scenario: 'You receive an email with a ZIP file attachment claiming to be an invoice. The sender appears to be from a company you do business with, but the email address looks slightly off.',
      questions: [
        {
          question: 'What should you do with this email?',
          type: 'multiple-choice',
          options: [
            'Verify sender identity before opening, scan attachment, be cautious of unexpected attachments',
            'Open immediately to check the invoice',
            'Forward to colleagues',
            'Reply asking for more information'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Verify sender identity before opening, scan attachment, be cautious of unexpected attachments',
    },
    points: 15,
    time_limit: 180,
    hint: 'Ransomware often arrives via email attachments from compromised accounts',
  },
  {
    category: 'malware_awareness',
    level: 3,
    title: 'Adware and Browser Hijackers',
    description: 'Identify adware and browser hijacking attempts.',
    content: {
      type: 'scenario',
      scenario: 'After installing a "free" video converter, your browser homepage changed to an unknown search engine. You see constant popup ads and your browser redirects to unwanted websites.',
      questions: [
        {
          question: 'What type of malware is this?',
          type: 'multiple-choice',
          options: [
            'Adware/browser hijacker - modifies browser settings and shows unwanted ads',
            'Ransomware',
            'Legitimate software feature',
            'Browser bug'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Adware/browser hijacker - modifies browser settings and shows unwanted ads',
    },
    points: 15,
    time_limit: 180,
    hint: 'Browser hijackers change your homepage and search engine without permission',
  },
  {
    category: 'malware_awareness',
    level: 4,
    title: 'Rootkit Detection',
    description: 'Learn about rootkits and their stealth capabilities.',
    content: {
      type: 'scenario',
      scenario: 'Your antivirus software keeps getting disabled automatically. System files seem modified, but you cannot see what changed. Your computer behaves strangely but no malware is detected.',
      questions: [
        {
          question: 'What could be causing this?',
          type: 'multiple-choice',
          options: [
            'Rootkit - advanced malware that hides itself and disables security software',
            'Antivirus software bug',
            'Windows update issue',
            'Hardware failure'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Rootkit - advanced malware that hides itself and disables security software',
    },
    points: 20,
    time_limit: 240,
    hint: 'Rootkits hide deep in the system and can disable security software',
  },
  {
    category: 'malware_awareness',
    level: 5,
    title: 'Botnet Awareness',
    description: 'Understand botnets and how devices become part of them.',
    content: {
      type: 'scenario',
      scenario: 'Your computer seems to be sending data even when you are not using it. Your internet connection is slow, and your ISP warns about suspicious network activity from your IP address.',
      questions: [
        {
          question: 'What might be happening?',
          type: 'multiple-choice',
          options: [
            'Your device may be part of a botnet - infected and controlled remotely',
            'Normal background processes',
            'Internet connection issue',
            'ISP problem'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Your device may be part of a botnet - infected and controlled remotely',
    },
    points: 25,
    time_limit: 240,
    hint: 'Botnets use infected devices to perform attacks without the owner knowing',
  },
  {
    category: 'malware_awareness',
    level: 6,
    title: 'Fileless Malware',
    description: 'Recognize fileless malware attacks that run in memory.',
    content: {
      type: 'scenario',
      scenario: 'You click a link in an email that opens a document. The document uses macros. Later, your computer shows signs of compromise, but antivirus finds no files.',
      questions: [
        {
          question: 'What type of attack is this?',
          type: 'multiple-choice',
          options: [
            'Fileless malware - runs in memory without leaving traditional file traces',
            'Traditional virus',
            'False alarm',
            'Hardware issue'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Fileless malware - runs in memory without leaving traditional file traces',
    },
    points: 30,
    time_limit: 240,
    hint: 'Fileless malware runs in RAM and is harder to detect',
  },
  {
    category: 'malware_awareness',
    level: 7,
    title: 'Polymorphic Malware',
    description: 'Understand polymorphic malware that changes its code to evade detection.',
    content: {
      type: 'scenario',
      scenario: 'A malware sample is detected, but when analyzed again, it appears different. The behavior is the same, but the code signature has changed completely.',
      questions: [
        {
          question: 'What type of malware is this?',
          type: 'multiple-choice',
          options: [
            'Polymorphic malware - changes its code structure while maintaining functionality',
            'Different malware',
            'Antivirus false positive',
            'System update'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Polymorphic malware - changes its code structure while maintaining functionality',
    },
    points: 35,
    time_limit: 300,
    hint: 'Polymorphic malware mutates to avoid signature-based detection',
  },
  {
    category: 'malware_awareness',
    level: 8,
    title: 'Supply Chain Attacks',
    description: 'Learn about supply chain attacks targeting software distribution.',
    content: {
      type: 'scenario',
      scenario: 'A popular software tool used by millions gets updated. The update is distributed through the official website, but it contains malware that affects all users who update.',
      questions: [
        {
          question: 'What type of attack is this?',
          type: 'multiple-choice',
          options: [
            'Supply chain attack - compromises software at the source before distribution',
            'Individual user attack',
            'Network attack',
            'Physical attack'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Supply chain attack - compromises software at the source before distribution',
    },
    points: 40,
    time_limit: 300,
    hint: 'Supply chain attacks target software developers and distributors',
  },
  {
    category: 'malware_awareness',
    level: 9,
    title: 'Living Off The Land (LOLBins)',
    description: 'Understand attacks using legitimate system tools.',
    content: {
      type: 'scenario',
      scenario: 'An attacker uses built-in Windows tools like PowerShell and WMI to execute malicious commands. No suspicious files are downloaded, but the system is compromised.',
      questions: [
        {
          question: 'What technique is being used?',
          type: 'multiple-choice',
          options: [
            'Living off the land - using legitimate system tools for malicious purposes',
            'Traditional malware',
            'System update',
            'Legitimate system maintenance'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Living off the land - using legitimate system tools for malicious purposes',
    },
    points: 45,
    time_limit: 300,
    hint: 'LOLBins attacks use built-in system tools to avoid detection',
  },
  {
    category: 'malware_awareness',
    level: 10,
    title: 'Advanced Persistent Threats (APTs)',
    description: 'Master understanding of sophisticated long-term attacks.',
    content: {
      type: 'scenario',
      scenario: 'A sophisticated attacker gains access to a network and remains undetected for months. They slowly gather information, move laterally, and maintain persistent access.',
      questions: [
        {
          question: 'What type of attack is this?',
          type: 'multiple-choice',
          options: [
            'Advanced Persistent Threat (APT) - sophisticated, long-term, stealthy attack',
            'Simple malware',
            'One-time breach',
            'Accidental access'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Advanced Persistent Threat (APT) - sophisticated, long-term, stealthy attack',
    },
    points: 50,
    time_limit: 300,
    hint: 'APTs are sophisticated, targeted, and designed to remain undetected',
  },

  // ========== NETWORK SECURITY CHALLENGES (Levels 1-10) ==========
  {
    category: 'network_security',
    level: 1,
    title: 'Firewall Basics',
    description: 'Understand what firewalls do and why they are essential.',
    content: {
      type: 'scenario',
      scenario: 'You set up a new computer and notice it does not have a firewall enabled. You plan to connect it to the internet.',
      questions: [
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Enable firewall before connecting - it blocks unauthorized network access',
            'Connect without firewall',
            'Only use antivirus',
            'Firewall is not needed'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Enable firewall before connecting - it blocks unauthorized network access',
    },
    points: 10,
    time_limit: 120,
    hint: 'Firewalls are the first line of defense against network attacks',
  },
  {
    category: 'network_security',
    level: 2,
    title: 'VPN Usage',
    description: 'Learn when and why to use VPNs for network security.',
    content: {
      type: 'scenario',
      scenario: 'You need to access your work email from a coffee shop WiFi. The network is unencrypted and open to anyone.',
      questions: [
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Use a VPN to encrypt your connection and protect data',
            'Connect directly - it is safe',
            'Use any network available',
            'Share your credentials'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Use a VPN to encrypt your connection and protect data',
    },
    points: 15,
    time_limit: 180,
    hint: 'VPNs encrypt traffic on unsecured networks',
  },
  {
    category: 'network_security',
    level: 3,
    title: 'Man-in-the-Middle Attacks',
    description: 'Recognize and prevent MITM attacks on networks.',
    content: {
      type: 'scenario',
      scenario: 'You connect to a WiFi network named "Airport_Free_WiFi". Later, you notice someone else created a network with the same name. Your device may have connected to the wrong one.',
      questions: [
        {
          question: 'What attack is this?',
          type: 'multiple-choice',
          options: [
            'Evil twin attack - fake WiFi network to intercept traffic',
            'Legitimate network',
            'Network error',
            'Device malfunction'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Evil twin attack - fake WiFi network to intercept traffic',
    },
    points: 20,
    time_limit: 180,
    hint: 'Evil twin networks mimic legitimate ones to steal data',
  },
  {
    category: 'network_security',
    level: 4,
    title: 'Port Security',
    description: 'Understand network ports and why some should be closed.',
    content: {
      type: 'scenario',
      scenario: 'A network scan reveals your computer has many open ports (22, 23, 80, 443, 3389, 8080). Some services you do not recognize are listening on these ports.',
      questions: [
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Close unnecessary ports, only keep essential services running',
            'Leave all ports open',
            'Open more ports',
            'Ignore the scan results'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Close unnecessary ports, only keep essential services running',
    },
    points: 25,
    time_limit: 240,
    hint: 'Open ports are entry points - minimize them',
  },
  {
    category: 'network_security',
    level: 5,
    title: 'DNS Security',
    description: 'Learn about DNS attacks and DNS over HTTPS (DoH).',
    content: {
      type: 'scenario',
      scenario: 'You type a website URL, but you are redirected to a fake site that looks identical. Your DNS queries are being intercepted and redirected.',
      questions: [
        {
          question: 'What attack is this?',
          type: 'multiple-choice',
          options: [
            'DNS hijacking/spoofing - redirects legitimate domains to malicious sites',
            'Website error',
            'Browser bug',
            'Internet outage'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'DNS hijacking/spoofing - redirects legitimate domains to malicious sites',
    },
    points: 30,
    time_limit: 240,
    hint: 'DNS attacks redirect you to fake websites',
  },
  {
    category: 'network_security',
    level: 6,
    title: 'Network Segmentation',
    description: 'Understand network segmentation for security.',
    content: {
      type: 'scenario',
      scenario: 'A company keeps all devices (servers, workstations, IoT devices) on the same network. When one device is compromised, the attacker can access everything.',
      questions: [
        {
          question: 'What security practice should be implemented?',
          type: 'multiple-choice',
          options: [
            'Network segmentation - separate networks for different device types',
            'Use stronger passwords',
            'Install more antivirus',
            'Nothing can help'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Network segmentation - separate networks for different device types',
    },
    points: 35,
    time_limit: 300,
    hint: 'Segmentation limits damage if one network is compromised',
  },
  {
    category: 'network_security',
    level: 7,
    title: 'Intrusion Detection Systems',
    description: 'Learn about IDS and IPS for network monitoring.',
    content: {
      type: 'scenario',
      scenario: 'A network security system detects unusual traffic patterns and automatically blocks suspicious connections. It alerts administrators about potential attacks.',
      questions: [
        {
          question: 'What type of system is this?',
          type: 'multiple-choice',
          options: [
            'Intrusion Detection/Prevention System (IDS/IPS) - monitors and blocks threats',
            'Firewall only',
            'Antivirus software',
            'Network router'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Intrusion Detection/Prevention System (IDS/IPS) - monitors and blocks threats',
    },
    points: 40,
    time_limit: 300,
    hint: 'IDS/IPS monitor network traffic for attack patterns',
  },
  {
    category: 'network_security',
    level: 8,
    title: 'DDoS Attack Mitigation',
    description: 'Understand DDoS attacks and how to defend against them.',
    content: {
      type: 'scenario',
      scenario: 'A website suddenly becomes unreachable. The server is overwhelmed with millions of requests from thousands of different IP addresses, making it impossible for legitimate users to access it.',
      questions: [
        {
          question: 'What type of attack is this?',
          type: 'multiple-choice',
          options: [
            'Distributed Denial of Service (DDoS) - floods target with traffic to make it unavailable',
            'Single user attack',
            'Server maintenance',
            'Network upgrade'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Distributed Denial of Service (DDoS) - floods target with traffic to make it unavailable',
    },
    points: 45,
    time_limit: 300,
    hint: 'DDoS attacks overwhelm services with traffic from many sources',
  },
  {
    category: 'network_security',
    level: 9,
    title: 'Network Access Control (NAC)',
    description: 'Learn about NAC systems that control device access.',
    content: {
      type: 'scenario',
      scenario: 'A company implements a system that checks devices before allowing network access. Devices must meet security requirements (updated OS, antivirus, patches) before connecting.',
      questions: [
        {
          question: 'What system is this?',
          type: 'multiple-choice',
          options: [
            'Network Access Control (NAC) - enforces security policies before network access',
            'Simple firewall',
            'WiFi password',
            'VPN service'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Network Access Control (NAC) - enforces security policies before network access',
    },
    points: 45,
    time_limit: 300,
    hint: 'NAC ensures only compliant devices can access the network',
  },
  {
    category: 'network_security',
    level: 10,
    title: 'Software-Defined Networking (SDN) Security',
    description: 'Master advanced network security with SDN concepts.',
    content: {
      type: 'scenario',
      scenario: 'A network uses software to dynamically control and manage network resources. Security policies are centrally managed and automatically applied based on traffic analysis.',
      questions: [
        {
          question: 'What are the security benefits of SDN?',
          type: 'multiple-choice',
          options: [
            'Centralized security management, dynamic policy enforcement, better threat response',
            'Faster internet speed',
            'Easier setup',
            'No security benefits'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Centralized security management, dynamic policy enforcement, better threat response',
    },
    points: 50,
    time_limit: 300,
    hint: 'SDN allows centralized, dynamic security policy management',
  },

  // ========== PASSWORD SECURITY CHALLENGES (Levels 1-10) ==========
  {
    category: 'password_security',
    level: 1,
    title: 'Password Reuse Risks',
    description: 'Understand why reusing passwords across accounts is dangerous.',
    content: {
      type: 'scenario',
      scenario: 'You use the same password for your email, social media, and banking accounts. One website you used gets breached, and your password is leaked.',
      questions: [
        {
          question: 'What is the risk?',
          type: 'multiple-choice',
          options: [
            'All accounts are compromised - attackers can access everything with one password',
            'Only one account is at risk',
            'No risk if you change it later',
            'Passwords are not important'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'All accounts are compromised - attackers can access everything with one password',
    },
    points: 10,
    time_limit: 120,
    hint: 'Password reuse multiplies the damage of a single breach',
  },
  {
    category: 'password_security',
    level: 2,
    title: 'Password Managers',
    description: 'Learn the benefits of using password managers.',
    content: {
      type: 'scenario',
      scenario: 'You have 50+ online accounts. You struggle to remember unique, strong passwords for each one. You often reuse passwords or write them down.',
      questions: [
        {
          question: 'What is the best solution?',
          type: 'multiple-choice',
          options: [
            'Use a password manager - generates and stores unique strong passwords securely',
            'Use the same password everywhere',
            'Write passwords in a notebook',
            'Use simple passwords you can remember'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Use a password manager - generates and stores unique strong passwords securely',
    },
    points: 15,
    time_limit: 180,
    hint: 'Password managers solve the password complexity and memory problem',
  },
  {
    category: 'password_security',
    level: 3,
    title: 'Two-Factor Authentication (2FA)',
    description: 'Understand why 2FA is essential for account security.',
    content: {
      type: 'scenario',
      scenario: 'An attacker obtains your password through a data breach. They try to log into your account, but they are blocked because they do not have your phone for the verification code.',
      questions: [
        {
          question: 'What security feature protected you?',
          type: 'multiple-choice',
          options: [
            'Two-Factor Authentication (2FA) - requires password plus second verification',
            'Strong password alone',
            'Antivirus software',
            'Firewall'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Two-Factor Authentication (2FA) - requires password plus second verification',
    },
    points: 20,
    time_limit: 180,
    hint: '2FA adds an extra layer beyond passwords',
  },
  {
    category: 'password_security',
    level: 4,
    title: 'Password Hashing vs Encryption',
    description: 'Learn the difference between hashing and encryption for passwords.',
    content: {
      type: 'scenario',
      scenario: 'A website stores passwords using a one-way mathematical function. Even if the database is breached, the passwords cannot be reversed to their original form.',
      questions: [
        {
          question: 'What technique is this?',
          type: 'multiple-choice',
          options: [
            'Password hashing - one-way function that cannot be reversed',
            'Password encryption - can be decrypted',
            'Plain text storage',
            'No protection'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Password hashing - one-way function that cannot be reversed',
    },
    points: 25,
    time_limit: 240,
    hint: 'Hashing is one-way, encryption is reversible',
  },
  {
    category: 'password_security',
    level: 5,
    title: 'Brute Force Protection',
    description: 'Understand brute force attacks and account lockout policies.',
    content: {
      type: 'scenario',
      scenario: 'An attacker tries thousands of password combinations to break into an account. After 5 failed attempts, the account is temporarily locked.',
      questions: [
        {
          question: 'What security measure is this?',
          type: 'multiple-choice',
          options: [
            'Account lockout policy - prevents brute force attacks by limiting attempts',
            'Password complexity requirement',
            '2FA requirement',
            'No security measure'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Account lockout policy - prevents brute force attacks by limiting attempts',
    },
    points: 30,
    time_limit: 240,
    hint: 'Account lockouts prevent automated password guessing',
  },
  {
    category: 'password_security',
    level: 6,
    title: 'Password Salting',
    description: 'Learn about password salting to prevent rainbow table attacks.',
    content: {
      type: 'scenario',
      scenario: 'A system adds random data to each password before hashing. Even if two users have the same password, their hashes are different.',
      questions: [
        {
          question: 'What technique is this?',
          type: 'multiple-choice',
          options: [
            'Password salting - adds random data to prevent rainbow table attacks',
            'Password encryption',
            'Password compression',
            'No technique used'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Password salting - adds random data to prevent rainbow table attacks',
    },
    points: 35,
    time_limit: 300,
    hint: 'Salting makes each password hash unique even for identical passwords',
  },
  {
    category: 'password_security',
    level: 7,
    title: 'Passwordless Authentication',
    description: 'Explore modern passwordless authentication methods.',
    content: {
      type: 'scenario',
      scenario: 'A system uses biometric authentication (fingerprint, face recognition) and hardware security keys instead of traditional passwords.',
      questions: [
        {
          question: 'What are the benefits of passwordless authentication?',
          type: 'multiple-choice',
          options: [
            'Eliminates password-related attacks, better user experience, stronger security',
            'Faster login only',
            'No benefits',
            'Less secure than passwords'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Eliminates password-related attacks, better user experience, stronger security',
    },
    points: 40,
    time_limit: 300,
    hint: 'Passwordless methods remove password vulnerabilities entirely',
  },
  {
    category: 'password_security',
    level: 8,
    title: 'Credential Stuffing Attacks',
    description: 'Understand credential stuffing and how to prevent it.',
    content: {
      type: 'scenario',
      scenario: 'Attackers use leaked usernames and passwords from one breach to try logging into thousands of other websites automatically.',
      questions: [
        {
          question: 'What attack is this?',
          type: 'multiple-choice',
          options: [
            'Credential stuffing - automated login attempts using leaked credentials',
            'Brute force attack',
            'Phishing attack',
            'DDoS attack'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Credential stuffing - automated login attempts using leaked credentials',
    },
    points: 45,
    time_limit: 300,
    hint: 'Credential stuffing relies on password reuse across sites',
  },
  {
    category: 'password_security',
    level: 9,
    title: 'Password Policy Best Practices',
    description: 'Learn about effective password policies for organizations.',
    content: {
      type: 'scenario',
      scenario: 'A company implements a password policy requiring 12+ characters, complexity, regular rotation, and prevents common passwords. They also use password history to prevent reuse.',
      questions: [
        {
          question: 'What is the most important aspect?',
          type: 'multiple-choice',
          options: [
            'Length and uniqueness matter more than frequent rotation - focus on strong, unique passwords',
            'Frequent rotation is most important',
            'Complexity rules are enough',
            'Any password policy works'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Length and uniqueness matter more than frequent rotation - focus on strong, unique passwords',
    },
    points: 45,
    time_limit: 300,
    hint: 'Modern best practices favor length over frequent rotation',
  },
  {
    category: 'password_security',
    level: 10,
    title: 'Advanced Password Security',
    description: 'Master advanced password security concepts and future trends.',
    content: {
      type: 'scenario',
      scenario: 'A system uses adaptive authentication that analyzes user behavior, device fingerprinting, and risk scoring to determine if additional verification is needed beyond the password.',
      questions: [
        {
          question: 'What is this approach called?',
          type: 'multiple-choice',
          options: [
            'Risk-based/adaptive authentication - adjusts security based on context and risk',
            'Simple password authentication',
            '2FA only',
            'No authentication'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Risk-based/adaptive authentication - adjusts security based on context and risk',
    },
    points: 50,
    time_limit: 300,
    hint: 'Adaptive authentication adjusts security based on risk factors',
  },

  // ========== PHISHING DETECTION CHALLENGES (Levels 1-10) ==========
  {
    category: 'phishing_detection',
    level: 1,
    title: 'Email Header Analysis',
    description: 'Learn to analyze email headers to detect phishing attempts.',
    content: {
      type: 'email',
      from: 'noreply@microsoft-support.com',
      to: 'user@example.com',
      subject: 'Your Microsoft Account Needs Verification',
      body: 'Click here to verify: https://microsoft-support.com/verify',
      headers: {
        'Return-Path': 'different-sender@unknown-domain.com',
        'X-Originating-IP': '192.168.1.100',
      },
      questions: [
        {
          question: 'What is suspicious about the email headers?',
          type: 'multiple-choice',
          options: [
            'Return-Path does not match sender, suspicious domain, header inconsistencies',
            'Headers look normal',
            'Email is from Microsoft',
            'Nothing suspicious'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Return-Path does not match sender, suspicious domain, header inconsistencies',
    },
    points: 10,
    time_limit: 180,
    hint: 'Email headers reveal the true origin - check Return-Path and SPF records',
  },
  {
    category: 'phishing_detection',
    level: 2,
    title: 'URL Inspection Techniques',
    description: 'Master techniques to inspect URLs before clicking.',
    content: {
      type: 'scenario',
      scenario: 'You receive an email with a link. The visible text says "Click here for PayPal" but when you hover, the actual URL is "http://paypal-security-verify.net/login".',
      questions: [
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Do not click - URL does not match PayPal official domain, check before clicking',
            'Click immediately',
            'Forward to friends',
            'Reply to verify'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Do not click - URL does not match PayPal official domain, check before clicking',
    },
    points: 15,
    time_limit: 180,
    hint: 'Always hover over links to see the actual destination URL',
  },
  {
    category: 'phishing_detection',
    level: 3,
    title: 'Social Engineering Red Flags',
    description: 'Identify social engineering tactics in phishing attempts.',
    content: {
      type: 'email',
      from: 'security@bank.com',
      to: 'user@example.com',
      subject: 'URGENT: Your Account Will Be Closed Today!',
      body: 'We detected suspicious activity. You must verify your identity immediately or your account will be permanently closed in the next 2 hours. Click here now: [link]',
      questions: [
        {
          question: 'What social engineering tactics are used?',
          type: 'multiple-choice',
          options: [
            'Urgency, fear, authority, pressure to act quickly without thinking',
            'Professional communication',
            'Clear instructions',
            'No tactics used'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Urgency, fear, authority, pressure to act quickly without thinking',
    },
    points: 20,
    time_limit: 180,
    hint: 'Phishing uses psychological manipulation to bypass critical thinking',
  },
  {
    category: 'phishing_detection',
    level: 4,
    title: 'Spear Phishing Recognition',
    description: 'Learn to identify targeted spear phishing attacks.',
    content: {
      type: 'email',
      from: 'colleague@company.com',
      to: 'you@company.com',
      subject: 'Re: Project Update You Requested',
      body: 'Hi, as you requested, here is the project update document. [attachment] The sender uses your colleague name and references a real project.',
      questions: [
        {
          question: 'What makes this suspicious despite looking legitimate?',
          type: 'multiple-choice',
          options: [
            'Spear phishing - uses personal information to appear legitimate, verify sender identity',
            'Email looks completely safe',
            'From a known colleague',
            'No reason to be suspicious'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Spear phishing - uses personal information to appear legitimate, verify sender identity',
    },
    points: 25,
    time_limit: 240,
    hint: 'Spear phishing uses personal details to appear trustworthy',
  },
  {
    category: 'phishing_detection',
    level: 5,
    title: 'HTTPS and SSL Certificate Checks',
    description: 'Understand how to verify website security certificates.',
    content: {
      type: 'scenario',
      scenario: 'You click a link and land on a website. The URL shows HTTPS, but your browser shows a certificate warning saying the certificate is invalid or expired.',
      questions: [
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Do not proceed - invalid certificate means the site is not secure',
            'Ignore the warning and continue',
            'The HTTPS is enough',
            'Certificates do not matter'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Do not proceed - invalid certificate means the site is not secure',
    },
    points: 30,
    time_limit: 240,
    hint: 'Invalid SSL certificates indicate potential phishing or man-in-the-middle attacks',
  },
  {
    category: 'phishing_detection',
    level: 6,
    title: 'Brand Impersonation Detection',
    description: 'Learn to spot fake brand impersonation attempts.',
    content: {
      type: 'email',
      from: 'Amazon Customer Service',
      to: 'user@example.com',
      subject: 'Order Confirmation #12345',
      body: 'Your recent order has been confirmed. Click here to track: amaz0n-track.com/order',
      questions: [
        {
          question: 'What indicates this is fake?',
          type: 'multiple-choice',
          options: [
            'Domain typo (amaz0n vs amazon), generic sender name, suspicious link',
            'Email looks official',
            'From Amazon',
            'Nothing indicates it is fake'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Domain typo (amaz0n vs amazon), generic sender name, suspicious link',
    },
    points: 35,
    time_limit: 300,
    hint: 'Brand impersonation uses similar-looking domains and names',
  },
  {
    category: 'phishing_detection',
    level: 7,
    title: 'Vishing (Voice Phishing) Awareness',
    description: 'Recognize voice-based phishing attempts.',
    content: {
      type: 'scenario',
      scenario: 'You receive a phone call from someone claiming to be from your bank. They say your account is compromised and ask you to verify your account number and PIN over the phone.',
      questions: [
        {
          question: 'What should you do?',
          type: 'multiple-choice',
          options: [
            'Hang up and call the bank directly using official number - never verify over incoming calls',
            'Provide the information immediately',
            'Verify your details',
            'Trust the caller'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Hang up and call the bank directly using official number - never verify over incoming calls',
    },
    points: 40,
    time_limit: 300,
    hint: 'Legitimate organizations never ask for sensitive info over unsolicited calls',
  },
  {
    category: 'phishing_detection',
    level: 8,
    title: 'Whaling Attacks',
    description: 'Understand high-value target phishing (whaling).',
    content: {
      type: 'scenario',
      scenario: 'A CEO receives an urgent email from what appears to be the CFO requesting an immediate wire transfer. The email uses the CFO name and references a real business deal.',
      questions: [
        {
          question: 'What type of attack is this?',
          type: 'multiple-choice',
          options: [
            'Whaling attack - targets high-value executives with sophisticated impersonation',
            'Regular phishing',
            'Legitimate request',
            'Email error'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Whaling attack - targets high-value executives with sophisticated impersonation',
    },
    points: 45,
    time_limit: 300,
    hint: 'Whaling targets executives with highly personalized attacks',
  },
  {
    category: 'phishing_detection',
    level: 9,
    title: 'Business Email Compromise (BEC)',
    description: 'Learn about BEC attacks and how to prevent them.',
    content: {
      type: 'scenario',
      scenario: 'An attacker compromises a business email account and monitors communications. They wait for a payment request, then send a fake email with changed bank account details.',
      questions: [
        {
          question: 'What attack is this?',
          type: 'multiple-choice',
          options: [
            'Business Email Compromise (BEC) - uses compromised accounts for financial fraud',
            'Simple phishing',
            'Account takeover',
            'Data breach'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Business Email Compromise (BEC) - uses compromised accounts for financial fraud',
    },
    points: 45,
    time_limit: 300,
    hint: 'BEC attacks use legitimate compromised accounts for fraud',
  },
  {
    category: 'phishing_detection',
    level: 10,
    title: 'Advanced Phishing Detection',
    description: 'Master advanced techniques to detect sophisticated phishing attempts.',
    content: {
      type: 'scenario',
      scenario: 'A phishing email uses legitimate-looking design, correct branding, valid-looking links that redirect, and appears to come from a trusted domain. It passes basic checks but something feels off.',
      questions: [
        {
          question: 'What advanced checks should you perform?',
          type: 'multiple-choice',
          options: [
            'Check SPF/DKIM records, verify sender via separate channel, inspect full email headers, check link redirects',
            'Trust the email if it looks good',
            'Only check the sender name',
            'No additional checks needed'
          ],
        },
      ],
    },
    correct_answers: {
      'question-0': 'Check SPF/DKIM records, verify sender via separate channel, inspect full email headers, check link redirects',
    },
    points: 50,
    time_limit: 300,
    hint: 'Advanced phishing requires multiple verification methods',
  },
]

async function seedDatabase() {
  try {
    await connectPostgreSQL()
    const pool = getPostgreSQLPool()

    console.log('Starting database seed...')

    // Clear existing data (must delete submissions first due to foreign key constraint)
    await pool.query('DELETE FROM challenge_submissions')
    await pool.query('DELETE FROM challenges')

    // Insert challenges
    for (const challenge of challenges) {
      await pool.query(
        `INSERT INTO challenges (category, level, title, description, content, correct_answers, points, time_limit, hint)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          challenge.category,
          challenge.level,
          challenge.title,
          challenge.description,
          JSON.stringify(challenge.content),
          JSON.stringify(challenge.correct_answers),
          challenge.points,
          challenge.time_limit,
          challenge.hint || null,
        ]
      )
    }

    console.log(`Successfully seeded ${challenges.length} challenges`)
    console.log(`Categories: Phishing (10), Password (10), Malware (10), Network (10), Malware Awareness (10), Network Security (10), Password Security (10), Phishing Detection (10)`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
