import pool from '../../../lib/db';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send({ message: 'Method not allowed' });

  // Agora recebemos o username, pois é o que identifica o user no login
  const { username } = req.body; 

  try {
    // 1. Busca o e-mail associado a esse username
    const [users] = await pool.query('SELECT email FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    const userEmail = users[0].email;
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // PIN de 6 dígitos
    const expires = new Date(Date.now() + 600000); // 10 minutos de validade

    // 2. Salva o PIN e a Expiração no Banco
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_expires = ? WHERE username = ?',
      [pin, expires, username]
    );

    // 3. Configuração do Transporte (GMAIL) usando Variáveis de Ambiente
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Aquela App Password de 16 dígitos
      },
    });

    // 4. Envio do E-mail
    const mailOptions = {
      from: `"Chroutine Security" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Seu Código de Recuperação - Chroutine",
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #c59d5f; padding: 20px; text-align: center;">
          <h2 style="color: #c59d5f;">CHROUTINE</h2>
          <p>Você solicitou a recuperação de senha para a conta: <b>${username}</b></p>
          <p>Seu código de verificação é:</p>
          <h1 style="background: #f4f4f4; padding: 10px; letter-spacing: 5px;">${pin}</h1>
          <p style="font-size: 0.8rem; color: #888;">Este código expira em 10 minutos.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Código enviado com sucesso para o seu e-mail!' });

  } catch (error) {
    console.error("Erro no envio:", error);
    return res.status(500).json({ message: 'Erro ao processar a recuperação.' });
  }
}