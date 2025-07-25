import React, { useState } from "react";
import EmailPreview from "./EmailPreview";
import Modal from "../UI/Modal";

// ตัวอย่างแบบฟอร์ม
export default function BudgetRequestForm() {
  const [formData, setFormData] = useState({
    requester: "",
    approverName: "",
    approverEmail: "",
    accountName: "",
    amount: 0,
    note: "",
  });
  const [items, setItems] = useState<{ item: string; quantity: number }[]>([
    { item: "", quantity: 1 },
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [previewApproverEmail, setPreviewApproverEmail] = useState("");
  // ตัวอย่าง requestNo สมมติ
  const [requestNo] = useState("REQ20250725-001");

  // ฟังก์ชันเมื่อกด "ส่งคำขอ"
  function handleOpenPreview(e: React.FormEvent) {
    e.preventDefault();
    setPreviewApproverEmail(formData.approverEmail);
    setShowConfirmation(true);
  }

  // ฟังก์ชันเมื่อกดยืนยันส่ง
  function handleConfirmSubmit() {
    // ส่ง previewApproverEmail ไปแทนค่า formData.approverEmail
    // หรือ sync กลับก่อน submit จริง
    alert(`จะส่งหาผู้อนุมัติอีเมล: ${previewApproverEmail}`);
    setShowConfirmation(false);
  }

  return (
    <div>
      <form onSubmit={handleOpenPreview}>
        <div>
          <label>ชื่อผู้ขอ:</label>
          <input
            value={formData.requester}
            onChange={e => setFormData(f => ({ ...f, requester: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>ชื่อผู้อนุมัติ:</label>
          <input
            value={formData.approverName}
            onChange={e => setFormData(f => ({ ...f, approverName: e.target.value }))}
          />
        </div>
        <div>
          <label>อีเมลผู้อนุมัติ:</label>
          <input
            type="email"
            value={formData.approverEmail}
            onChange={e => setFormData(f => ({ ...f, approverEmail: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>ชื่อบัญชี:</label>
          <input
            value={formData.accountName}
            onChange={e => setFormData(f => ({ ...f, accountName: e.target.value }))}
            required
          />
        </div>
        <div>
          <label>จำนวนเงิน:</label>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData(f => ({ ...f, amount: Number(e.target.value) }))}
            required
          />
        </div>
        <div>
          <label>หมายเหตุ:</label>
          <input
            value={formData.note}
            onChange={e => setFormData(f => ({ ...f, note: e.target.value }))}
          />
        </div>
        {/* ตัวอย่างรายการ */}
        <div>
          <label>รายการ:</label>
          {items.map((it, idx) => (
            <div key={idx}>
              <input
                placeholder="ชื่อรายการ"
                value={it.item}
                onChange={e =>
                  setItems(arr =>
                    arr.map((i, j) => (j === idx ? { ...i, item: e.target.value } : i))
                  )
                }
                required
              />
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={e =>
                  setItems(arr =>
                    arr.map((i, j) => (j === idx ? { ...i, quantity: Number(e.target.value) } : i))
                  )
                }
                required
              />
              {/* เพิ่ม/ลบแถวรายการ */}
              {items.length > 1 && (
                <button type="button" onClick={() => setItems(arr => arr.filter((_, j) => j !== idx))}>ลบ</button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setItems(arr => [...arr, { item: "", quantity: 1 }])}
          >
            เพิ่มรายการ
          </button>
        </div>
        <button type="submit">ส่งคำขอ</button>
      </form>

      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="ตรวจสอบรายละเอียดคำขอ"
        size="lg"
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <label>
              <b>อีเมล์ผู้อนุมัติ (แก้ไขใน Preview ได้):</b>
              <input
                type="email"
                value={previewApproverEmail}
                onChange={e => setPreviewApproverEmail(e.target.value)}
                style={{ marginLeft: 8, padding: 4, minWidth: 250 }}
                required
              />
            </label>
          </div>
          <EmailPreview
            approverName={formData.approverName || "ผู้อนุมัติ"}
            requester={formData.requester}
            accountName={formData.accountName}
            amount={formData.amount}
            items={items}
            note={formData.note}
            approveUrl={`${window.location.origin}/approve/${requestNo}?action=approve`}
            rejectUrl={`${window.location.origin}/approve/${requestNo}?action=reject`}
          />
          <div style={{ marginTop: 24 }}>
            <button
              onClick={handleConfirmSubmit}
              style={{
                background: "#28a745",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: 4,
              }}
            >
              ยืนยันส่งอีเมล
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              style={{ marginLeft: 12 }}
            >
              ย้อนกลับ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
             
           
                             
