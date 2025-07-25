import React from "react";

type EmailPreviewProps = {
  approverName: string;
  requester: string;
  accountName: string;
  amount: number;
  items: { item: string; quantity: number }[];
  note: string;
  approveUrl: string;
  rejectUrl: string;
};

function generateItemsTable(items: { item: string; quantity: number }[]) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}>
      <thead>
        <tr style={{ backgroundColor: "#f8f9fa" }}>
          <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>ลำดับ</th>
          <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "left" }}>รายการ</th>
          <th style={{ border: "1px solid #ddd", padding: 12, textAlign: "center" }}>จำนวน</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={idx}>
            <td style={{ border: "1px solid #ddd", padding: 12, textAlign: "center" }}>{idx + 1}</td>
            <td style={{ border: "1px solid #ddd", padding: 12 }}>{item.item}</td>
            <td style={{ border: "1px solid #ddd", padding: 12, textAlign: "center" }}>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function EmailPreview(props: EmailPreviewProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6, color: "#333" }}>
      <h2 style={{ color: "#0056b3" }}>คำขออนุมัติใช้งบประมาณ</h2>
      <p>
        เรียน ผจศ. คุณ <strong>{props.approverName}</strong>,
      </p>
      <p>
        ด้วยคุณ <strong>{props.requester}</strong> ได้ขอใช้งบประมาณ <strong>{props.accountName}</strong>
      </p>
      <p>
        เป็นจำนวนเงิน <strong>{props.amount.toLocaleString()}</strong> บาท เพื่อจัดหารายการตามตารางดังต่อไปนี้:
      </p>
      {generateItemsTable(props.items)}
      <p>
        <strong>หมายเหตุ:</strong> {props.note || "ไม่มี"}
      </p>
      <p>จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ</p>
      <div style={{ marginTop: 25, textAlign: "center" }}>
        <a
          href={props.approveUrl}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 25px",
            textDecoration: "none",
            borderRadius: 5,
            marginRight: 10,
            fontWeight: "bold",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          อนุมัติ
        </a>
        <a
          href={props.rejectUrl}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            padding: "12px 25px",
            textDecoration: "none",
            borderRadius: 5,
            fontWeight: "bold",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          ไม่อนุมัติ
        </a>
      </div>
      <p style={{ marginTop: 30, fontSize: 12, color: "#777", textAlign: "center" }}>
        อีเมลนี้ถูกส่งจากระบบจัดการวัสดุสำนักงาน Deluxe
      </p>
    </div>
  );
}
