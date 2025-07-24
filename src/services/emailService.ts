import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_f2t090t';
const TEMPLATE_ID = 'template_7xibgbq';
const PUBLIC_KEY = 'MK2OUomFmzWPrHpMW';

export class EmailService {
  static async sendApprovalEmail(requestData: {
    requestNo: string;
    requester: string;
    approverEmail: string;
    accountCode: string;
    accountName: string;
    amount: number;
    requestDate: string;
    items: Array<{ item: string; quantity: number }>;
    approvalUrl: string;
  }): Promise<void> {
    try {
      // สร้างรายการสินค้าเป็น HTML
      const itemsHtml = requestData.items
        .map((item, index) => `${index + 1}. ${item.item} จำนวน ${item.quantity}`)
        .join('\n');

      const templateParams = {
        to_email: requestData.approverEmail,
        request_no: requestData.requestNo,
        requester: requestData.requester,
        account_code: requestData.accountCode,
        account_name: requestData.accountName,
        amount: requestData.amount.toLocaleString(),
        request_date: requestData.requestDate,
        items_list: itemsHtml,
        approval_url: requestData.approvalUrl
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('ไม่สามารถส่งอีเมลได้');
    }
  }

  static generateApprovalUrl(requestId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/approve/${requestId}`;
  }
}