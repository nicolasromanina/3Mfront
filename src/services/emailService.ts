import nodemailer from 'nodemailer';
import { logger } from '@/utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  private async sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }) {
    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${options.to}: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Bienvenue chez PrintPro !</h1>
        <p>Bonjour ${name},</p>
        <p>Nous sommes ravis de vous accueillir dans la famille PrintPro !</p>
        <p>Votre compte a été créé avec succès. Vous pouvez maintenant :</p>
        <ul>
          <li>Découvrir nos services d'impression</li>
          <li>Passer vos premières commandes</li>
          <li>Suivre vos commandes en temps réel</li>
          <li>Contacter notre équipe support</li>
        </ul>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>L'équipe PrintPro</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Bienvenue chez PrintPro !',
      html
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string, name: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Réinitialisation de mot de passe</h1>
        <p>Bonjour ${name},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expire dans 10 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <p>Cordialement,<br>L'équipe PrintPro</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html
    });
  }

  async sendOrderStatusUpdate(email: string, orderData: {
    orderId: string;
    status: string;
    userName: string;
  }) {
    const statusLabels: Record<string, string> = {
      'devis': 'Devis généré',
      'en_attente': 'En attente de validation',
      'en_cours': 'En cours de production',
      'terminee': 'Terminée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Mise à jour de votre commande</h1>
        <p>Bonjour ${orderData.userName},</p>
        <p>Le statut de votre commande <strong>#${orderData.orderId}</strong> a été mis à jour :</p>
        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1F2937;">
            ${statusLabels[orderData.status] || orderData.status}
          </p>
        </div>
        <p>Vous pouvez suivre l'évolution de votre commande dans votre espace client.</p>
        <a href="${process.env.FRONTEND_URL}/orders" style="display: inline-block; background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Voir ma commande
        </a>
        <p>Cordialement,<br>L'équipe PrintPro</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: `Commande #${orderData.orderId} - ${statusLabels[orderData.status]}`,
      html
    });
  }

  async sendOrderConfirmation(email: string, orderData: any) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Confirmation de commande</h1>
        <p>Bonjour ${orderData.clientName},</p>
        <p>Nous avons bien reçu votre commande <strong>#${orderData.orderNumber}</strong>.</p>
        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3>Détails de la commande :</h3>
          <p><strong>Numéro :</strong> ${orderData.orderNumber}</p>
          <p><strong>Total :</strong> ${orderData.totalPrice.toFixed(2)} MGA</p>
          <p><strong>Statut :</strong> ${orderData.status}</p>
        </div>
        <p>Nous traiterons votre commande dans les plus brefs délais.</p>
        <p>Cordialement,<br>L'équipe PrintPro</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject: `Confirmation de commande #${orderData.orderNumber}`,
      html
    });
  }
}

export const emailService = new EmailService();