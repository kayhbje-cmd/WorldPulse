// src/pages/Chat.tsx
import React, { useState } from 'react';
import { Problem, ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, ShieldCheck, User } from 'lucide-react';
import { formatTimeAgo } from '../utils/formatters';

interface Props {
  problem: Problem;
  onBack: () => void;
}

export const ChatScreen: React.FC<Props> = ({ problem, onBack }) => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      conversation_id: `conv-${problem.id}`,
      sender_id: 'off-101',
      sender_name: problem.assigned_officer_name || 'Er. Rajesh Kulkarni',
      sender_role: 'officer',
      message: `Namaste ${problem.user.name}. We have acknowledged Ticket #${problem.id}. Our maintenance team is scheduled to inspect the location today.`,
      created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: 'msg-2',
      conversation_id: `conv-${problem.id}`,
      sender_id: user?.id || 'usr-1',
      sender_name: user?.name || 'Aarav Sharma',
      sender_role: 'citizen',
      message: 'Thank you Sir. Please ensure the work is done before peak evening traffic as this causes huge jams.',
      created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: `conv-${problem.id}`,
      sender_id: user?.id || 'usr-1',
      sender_name: user?.name || 'Aarav Sharma',
      sender_role: user?.role || 'citizen',
      message: inputMessage.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate officer automated response after 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          conversation_id: `conv-${problem.id}`,
          sender_id: 'off-101',
          sender_name: problem.assigned_officer_name || 'Er. Rajesh Kulkarni',
          sender_role: 'officer',
          message: 'Noted with priority. The site supervisor has been notified via the municipal field tablet.',
          created_at: new Date().toISOString(),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-700 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-gray-900">
                {problem.assigned_officer_name || 'Er. Rajesh Kulkarni'}
              </h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-sm">
                OFFICER
              </span>
            </div>
            <p className="text-[11px] text-gray-500 truncate max-w-xs">
              Re: #{problem.id} • {problem.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
          <ShieldCheck size={13} />
          <span>Encrypted Official Desk</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/30">
        {messages.map((msg) => {
          const isMe = msg.sender_id === (user?.id || 'usr-1');
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-gray-400 font-medium mb-0.5 px-1">
                {msg.sender_name} • {formatTimeAgo(msg.created_at)}
              </span>
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-xs shadow-2xs'
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* Send Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type official message to officer..."
          className="flex-1 bg-gray-50 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
        >
          <Send size={14} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
