/**
 * Email utility using Resend (or any SMTP configured in .env).
 * In development it just logs to the console.
 * Install: npm install resend
 */

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    from?: string
}

async function sendViaSMTP({ to, subject, html, from }: SendEmailOptions) {
    try {
        // If Resend API key is provided, use it
        const RESEND_API_KEY = process.env.RESEND_API_KEY
        if (RESEND_API_KEY) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: from || process.env.EMAIL_FROM || 'DigitalMarket <noreply@digitalmarket.com>',
                    to: [to],
                    subject,
                    html,
                }),
            })
            if (!res.ok) throw new Error(await res.text())
            return { success: true }
        }

        // Fallback: log the email in development
        console.log('\n====================================')
        console.log('📧 [DEV EMAIL]')
        console.log(`TO: ${to}`)
        console.log(`SUBJECT: ${subject}`)
        console.log(html.replace(/<[^>]+>/g, '').trim().slice(0, 300))
        console.log('====================================\n')
        return { success: true }
    } catch (err) {
        console.error('sendEmail error:', err)
        return { success: false, error: err }
    }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function baseTemplate(content: string) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#F8F9FA;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FA;padding:32px 16px;">
        <tr><td>
          <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#FF6B35,#FF8C61);padding:32px;text-align:center;">
                <h1 style="color:#FFFFFF;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                  🎵 DigitalMarket
                </h1>
                <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">
                  Tu plataforma de productos digitales
                </p>
              </td>
            </tr>
            <!-- Content -->
            <tr><td style="padding:40px 32px;">${content}</td></tr>
            <!-- Footer -->
            <tr>
              <td style="background:#F8F9FA;padding:24px 32px;text-align:center;border-top:1px solid #E9ECEF;">
                <p style="color:#ADB5BD;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} DigitalMarket · Todos los derechos reservados<br>
                  <a href="#" style="color:#FF6B35;text-decoration:none;">Darse de baja</a> · 
                  <a href="#" style="color:#FF6B35;text-decoration:none;">Política de privacidad</a>
                </p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `
}

export async function sendOrderConfirmationEmail(opts: {
    to: string
    name: string
    orderId: string
    products: { title: string; price: number }[]
    total: number
}) {
    const productRows = opts.products.map((p) =>
        `<tr>
      <td style="padding:8px 0;color:#343A40;font-size:14px;">${p.title}</td>
      <td style="padding:8px 0;color:#FF6B35;font-weight:700;font-size:14px;text-align:right;">$${p.price}</td>
    </tr>`
    ).join('')

    const html = baseTemplate(`
    <h2 style="color:#343A40;font-size:22px;font-weight:800;margin:0 0 8px;">¡Pago exitoso! 🎉</h2>
    <p style="color:#6C757D;font-size:15px;margin:0 0 24px;">Hola ${opts.name}, tu compra fue procesada correctamente.</p>

    <div style="background:#F8F9FA;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#ADB5BD;font-size:12px;font-weight:600;margin:0 0 12px;">NÚMERO DE ORDEN</p>
      <p style="color:#FF6B35;font-weight:800;font-size:18px;margin:0;">${opts.orderId}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <th style="text-align:left;color:#ADB5BD;font-size:12px;font-weight:600;padding-bottom:8px;border-bottom:2px solid #E9ECEF;">PRODUCTO</th>
        <th style="text-align:right;color:#ADB5BD;font-size:12px;font-weight:600;padding-bottom:8px;border-bottom:2px solid #E9ECEF;">PRECIO</th>
      </tr>
      ${productRows}
      <tr>
        <td style="padding-top:12px;border-top:2px solid #E9ECEF;font-weight:800;font-size:16px;">Total</td>
        <td style="padding-top:12px;border-top:2px solid #E9ECEF;text-align:right;color:#FF6B35;font-weight:800;font-size:18px;">$${opts.total}</td>
      </tr>
    </table>

    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://digitalmarket.com'}/dashboard/purchases"
       style="display:block;background:linear-gradient(135deg,#FF6B35,#FF8C61);color:#FFFFFF;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-weight:700;font-size:15px;margin-top:8px;">
      Ver mis compras →
    </a>
  `)

    return sendViaSMTP({ to: opts.to, subject: `✅ Confirmación de pago — ${opts.orderId}`, html })
}

export async function sendWelcomeEmail(opts: { to: string; name: string }) {
    const html = baseTemplate(`
    <h2 style="color:#343A40;font-size:22px;font-weight:800;margin:0 0 8px;">Bienvenido, ${opts.name}! 🎵</h2>
    <p style="color:#6C757D;font-size:15px;margin:0 0 20px;">
      Tu cuenta en DigitalMarket ha sido creada exitosamente. Ya puedes explorar nuestro catálogo de cursos, samples y música.
    </p>

    <div style="background:linear-gradient(135deg,rgba(255,107,53,0.06),rgba(78,205,196,0.06));border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="color:#343A40;font-weight:700;margin:0 0 8px;">🎁 Cupón de bienvenida</p>
      <p style="color:#FF6B35;font-size:24px;font-weight:800;letter-spacing:4px;margin:0;">BIENVENIDO10</p>
      <p style="color:#6C757D;font-size:13px;margin:8px 0 0;">10% de descuento en tu primera compra</p>
    </div>

    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://digitalmarket.com'}/products"
       style="display:block;background:linear-gradient(135deg,#FF6B35,#FF8C61);color:#FFFFFF;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-weight:700;font-size:15px;">
      Explorar productos →
    </a>
  `)

    return sendViaSMTP({ to: opts.to, subject: '🎵 Bienvenido a DigitalMarket — Tu cupón de bienvenida', html })
}

export async function sendPasswordResetEmail(opts: { to: string; name: string; resetUrl: string }) {
    const html = baseTemplate(`
    <h2 style="color:#343A40;font-size:22px;font-weight:800;margin:0 0 8px;">Restablecer contraseña</h2>
    <p style="color:#6C757D;font-size:15px;margin:0 0 24px;">
      Hola ${opts.name}, recibimos una solicitud para restablecer la contraseña de tu cuenta. El enlace expira en 1 hora.
    </p>

    <a href="${opts.resetUrl}"
       style="display:block;background:linear-gradient(135deg,#FF6B35,#FF8C61);color:#FFFFFF;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-weight:700;font-size:15px;margin-bottom:20px;">
      Restablecer contraseña →
    </a>

    <p style="color:#ADB5BD;font-size:13px;margin:0;">
      Si no solicitaste esto, ignora este correo. Tu contraseña no será cambiada.
    </p>
  `)

    return sendViaSMTP({ to: opts.to, subject: '🔒 Restablecer contraseña — DigitalMarket', html })
}
