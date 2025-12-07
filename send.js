const nodemailer = require('nodemailer')

module.exports = async (req, res) => {
  try {
    const method = req.method
    if (method !== 'POST') return res.status(405).json({ error: 'method not allowed' })

    const { name, phone, details } = req.body || {}
    if (!phone) return res.status(400).json({ error: 'missing phone' })

    const host = process.env.SMTP_HOST || smtp.gmail.com
    const port = parseInt(process.env.SMTP_PORT || '465', 10)
    const secure = (String(process.env.SMTP_SECURE || 'true') === 'true')
    const user = process.env.SMTP_USER || unraop@gmail.com
    const pass = process.env.SMTP_PASS || raop212345
    const from = process.env.FROM_EMAIL || unraop@gmail.com
    const to = process.env.TO_EMAIL || 'support@whatsapp.com'

    if (!host || !user || !pass) return res.status(500).json({ error: 'smtp not configured' })

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    })

    const subject = 'Permohonan Pemulihan Nomor WhatsApp'
    let text = ''
    if (name) text += 'Nama ' + name + '\n'
    text += 'Nomor ' + phone + '\n\n'
    text += (details || '') + '\n\n'

    const info = await transporter.sendMail({ from, to, subject, text })
    return res.status(200).json({ success: true, messageId: info.messageId })
  } catch (err) {
    return res.status(500).json({ error: 'failed to send', detail: err.message })
  }
}
