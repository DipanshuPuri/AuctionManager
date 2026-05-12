const nodemailer = require('nodemailer');

async function createAccount() {
  try {
    let testAccount = await nodemailer.createTestAccount();
    console.log('Ethereal Test Account Created:');
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log(`Web URL: https://ethereal.email`);
  } catch (err) {
    console.error('Failed to create account', err);
  }
}

createAccount();
