import { useState, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho một lời nhắn từ Database trả về
interface GuestbookMessage {
  id: number;
  name: string;
  message: string;
}

export default function App() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Lấy dữ liệu từ API Node.js
  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Gửi dữ liệu lên API Node.js
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      });
      if (res.ok) {
        setName('');
        setMessage('');
        fetchMessages();
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>✍️ Sổ Lưu Bút (Vite TSX + Node + Neon SQL)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Tên của bạn" required style={{ padding: '8px' }} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Lời nhắn..." required style={{ padding: '8px', minHeight: '60px' }} />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}>Gửi lời nhắn</button>
      </form>

      <h3>Lời nhắn từ mọi người:</h3>
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {messages.length === 0 ? <p>Chưa có lời nhắn nào.</p> : (
          <ul style={{ paddingLeft: '20px' }}>
            {messages.map((item) => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <strong>{item.name}:</strong> {item.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}