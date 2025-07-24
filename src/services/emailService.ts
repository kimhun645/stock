import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_f2t090t';
const TEMPLATE_ID = 'template_7xibgbq';
const PUBLIC_KEY = 'MK2OUomFmzWPrHpMW';

export class EmailService {
  static async sendApprovalEmail(requestData: {
    requestNo: string;
    requester: string;
    approverEmail: string;
    approverName?: string;
    accountCode: string;
    accountName: string;
    amount: number;
    requestDate: string;
    items: Array<{ item: string; quantity: number }>;
    note?: string;
  }): Promise<void> {
    try {
      // สร้างตาราง HTML สำหรับรายการสินค้า
      const itemsTable = `
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">ลำดับ</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">รายการ</th>
              <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            ${requestData.items.map((item, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 12px;">${item.item}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${item.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // สร้าง URL สำหรับการอนุมัติและปฏิเสธ
      const baseUrl = window.location.origin;
      const approveUrl = `${baseUrl}/approve/${requestData.requestNo}?action=approve`;
      const rejectUrl = `${baseUrl}/approve/${requestData.requestNo}?action=reject`;

      const templateParams = {
        to_email: requestData.approverEmail,
        approver_name: requestData.approverName || 'ผู้อนุมัติ',
        requester: requestData.requester,
        account_name: requestData.accountName,
        amount: requestData.amount.toLocaleString(),
        items_table: itemsTable,
        note: requestData.note || 'ไม่มี',
        approve_url: approveUrl,
        reject_url: rejectUrl
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('Email sent successfully');
    } catch (error) {
  console.error('Error sending email (real detail):', error);
  // ส่งรายละเอียด error จริง กลับไปด้วย
  throw new Error('ไม่สามารถส่งอีเมลได้: ' + (error?.text || error?.message || JSON.stringify(error)));
}
  }
}
