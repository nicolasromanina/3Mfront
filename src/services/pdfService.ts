import PDFDocument from 'pdfkit';
import { IOrder } from '@/types';
import { logger } from '@/utils/logger';

class PDFService {
  generateQuote(order: IOrder): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('DEVIS', 50, 50);
        doc.fontSize(12).text(`Numéro: ${order.orderNumber}`, 50, 80);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 50, 95);

        // Company info
        doc.text('PrintPro', 400, 50);
        doc.text('123 Rue de l\'Impression', 400, 65);
        doc.text('75001 Paris', 400, 80);
        doc.text('Tél: 01 23 45 67 89', 400, 95);

        // Client info
        doc.text('Client:', 50, 140);
        doc.text(order.client.name, 50, 155);
        doc.text(order.client.email, 50, 170);
        if (order.client.phone) {
          doc.text(order.client.phone, 50, 185);
        }
        if (order.client.address) {
          doc.text(order.client.address, 50, 200);
        }

        // Line
        doc.moveTo(50, 230).lineTo(550, 230).stroke();

        // Items table header
        let yPosition = 250;
        doc.text('Description', 50, yPosition);
        doc.text('Quantité', 250, yPosition);
        doc.text('Prix unitaire', 350, yPosition);
        doc.text('Total', 450, yPosition);

        // Line under header
        yPosition += 20;
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

        // Items
        yPosition += 20;
        order.items.forEach((item) => {
          doc.text(item.service.name, 50, yPosition);
          doc.text(item.quantity.toString(), 250, yPosition);
          doc.text(`${item.unitPrice.toFixed(2)} MGA`, 350, yPosition);
          doc.text(`${item.totalPrice.toFixed(2)} MGA`, 450, yPosition);
          yPosition += 20;

          // Options
          if (Object.keys(item.options).length > 0) {
            Object.entries(item.options).forEach(([key, value]) => {
              doc.fontSize(10).text(`  ${key}: ${value}`, 50, yPosition);
              yPosition += 15;
            });
            doc.fontSize(12);
          }
        });

        // Total line
        yPosition += 10;
        doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 20;
        doc.fontSize(14).text(`TOTAL: ${order.totalPrice.toFixed(2)} MGA`, 400, yPosition);

        // Notes
        if (order.notes) {
          yPosition += 40;
          doc.fontSize(12).text('Remarques:', 50, yPosition);
          yPosition += 20;
          doc.text(order.notes, 50, yPosition, { width: 500 });
        }

        // Footer
        doc.fontSize(10).text('Ce devis est valable 30 jours.', 50, 700);
        doc.text('Merci de votre confiance !', 50, 715);

        doc.end();
      } catch (error) {
        logger.error('Error generating quote PDF:', error);
        reject(error);
      }
    });
  }

  generateInvoice(order: IOrder): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('FACTURE', 50, 50);
        doc.fontSize(12).text(`Numéro: ${order.orderNumber}`, 50, 80);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 50, 95);
        if (order.completedAt) {
          doc.text(`Date de livraison: ${new Date(order.completedAt).toLocaleDateString('fr-FR')}`, 50, 110);
        }

        // Company info
        doc.text('PrintPro', 400, 50);
        doc.text('123 Rue de l\'Impression', 400, 65);
        doc.text('75001 Paris', 400, 80);
        doc.text('Tél: 01 23 45 67 89', 400, 95);
        doc.text('SIRET: 123 456 789 00012', 400, 110);

        // Client info
        doc.text('Facturé à:', 50, 150);
        doc.text(order.client.name, 50, 165);
        doc.text(order.client.email, 50, 180);
        if (order.client.phone) {
          doc.text(order.client.phone, 50, 195);
        }
        if (order.client.address) {
          doc.text(order.client.address, 50, 210);
        }

        // Line
        doc.moveTo(50, 240).lineTo(550, 240).stroke();

        // Items table header
        let yPosition = 260;
        doc.text('Description', 50, yPosition);
        doc.text('Quantité', 250, yPosition);
        doc.text('Prix unitaire', 350, yPosition);
        doc.text('Total HT', 450, yPosition);

        // Line under header
        yPosition += 20;
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

        // Items
        yPosition += 20;
        order.items.forEach((item) => {
          doc.text(item.service.name, 50, yPosition);
          doc.text(item.quantity.toString(), 250, yPosition);
          doc.text(`${item.unitPrice.toFixed(2)} MGA`, 350, yPosition);
          doc.text(`${item.totalPrice.toFixed(2)} MGA`, 450, yPosition);
          yPosition += 20;

          // Options
          if (Object.keys(item.options).length > 0) {
            Object.entries(item.options).forEach(([key, value]) => {
              doc.fontSize(10).text(`  ${key}: ${value}`, 50, yPosition);
              yPosition += 15;
            });
            doc.fontSize(12);
          }
        });

        // Totals
        yPosition += 10;
        doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 20;
        
        const totalHT = order.totalPrice;
        const tva = totalHT * 0.2; // 20% TVA
        const totalTTC = totalHT + tva;

        doc.text(`Total HT: ${totalHT.toFixed(2)} MGA`, 400, yPosition);
        yPosition += 15;
        doc.text(`TVA (20%): ${tva.toFixed(2)} MGA`, 400, yPosition);
        yPosition += 15;
        doc.fontSize(14).text(`TOTAL TTC: ${totalTTC.toFixed(2)} MGA`, 400, yPosition);

        // Payment info
        yPosition += 40;
        doc.fontSize(12).text('Conditions de paiement:', 50, yPosition);
        yPosition += 15;
        doc.text('Paiement à réception de facture', 50, yPosition);

        // Footer
        doc.fontSize(10).text('Merci de votre confiance !', 50, 700);
        doc.text('PrintPro - Votre partenaire impression', 50, 715);

        doc.end();
      } catch (error) {
        logger.error('Error generating invoice PDF:', error);
        reject(error);
      }
    });
  }

  async generateReport(data: any, type: 'orders' | 'revenue' | 'clients'): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        const titles = {
          orders: 'RAPPORT DES COMMANDES',
          revenue: 'RAPPORT DE CHIFFRE D\'AFFAIRES',
          clients: 'RAPPORT CLIENTS'
        };

        doc.fontSize(20).text(titles[type], 50, 50);
        doc.fontSize(12).text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 50, 80);

        // Content based on type
        let yPosition = 120;

        if (type === 'orders') {
          doc.text(`Nombre total de commandes: ${data.totalOrders}`, 50, yPosition);
          yPosition += 20;
          doc.text(`Commandes en cours: ${data.pendingOrders}`, 50, yPosition);
          yPosition += 20;
          doc.text(`Commandes terminées: ${data.completedOrders}`, 50, yPosition);
          yPosition += 40;

          // Recent orders table
          doc.text('Commandes récentes:', 50, yPosition);
          yPosition += 30;
          
          data.recentOrders?.forEach((order: any) => {
            doc.text(`#${order.orderNumber} - ${order.client.name} - ${order.totalPrice.toFixed(2)} MGA`, 50, yPosition);
            yPosition += 15;
          });
        }

        doc.end();
      } catch (error) {
        logger.error('Error generating report PDF:', error);
        reject(error);
      }
    });
  }
}

export const pdfService = new PDFService();