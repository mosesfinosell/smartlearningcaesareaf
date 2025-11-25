'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function MessagingInterface() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchData = async () => {
    try {
      const userRes = await api.get('/auth/me');
      const user = userRes.data.data.user || userRes.data.data;
      const mappedUser = { ...user, id: user.id || user._id };
      setCurrentUser(mappedUser);

      const conversationsRes = await api.get(`/messages/user/${mappedUser.id}`);
      setConversations(conversationsRes.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const loadConversation = async (conversation: any) => {
    try {
      const otherUserId = conversation.participants.find((p: string) => p !== currentUser.id);
      const res = await api.get(`/messages/conversation/${currentUser.id}/${otherUserId}`);
      setMessages(res.data.data);
      setSelectedConversation(conversation);

      // Mark as read
      const unreadMessages = res.data.data.filter(
        (m: any) => m.recipientId === currentUser.id && !m.isRead
      );
      for (const msg of unreadMessages) {
        await api.put(`/messages/${msg._id}/read`);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const otherUserId = selectedConversation.participants.find((p: string) => p !== currentUser.id);

      await api.post('/messages', {
        recipientId: otherUserId,
        content: newMessage,
      });

      setNewMessage('');
      loadConversation(selectedConversation);
      fetchData();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A05C]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No conversations yet</p>
                  </div>
                ) : (
                  <div>
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.conversationId}
                        onClick={() => loadConversation(conversation)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                          selectedConversation?.conversationId === conversation.conversationId
                            ? 'bg-[#C9A05C]/5'
                            : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[#C9A05C] rounded-full flex items-center justify-center text-white font-semibold">
                            {conversation.otherUser?.profile?.firstName?.[0] || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900 truncate">
                                {conversation.otherUser?.profile?.firstName || 'User'}{' '}
                                {conversation.otherUser?.profile?.lastName || ''}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-[#C9A05C] text-white text-xs rounded-full">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {conversation.lastMessage?.createdAt
                                ? new Date(conversation.lastMessage.createdAt).toLocaleString()
                                : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="col-span-8 flex flex-col">
              {!selectedConversation ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#C9A05C] rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversation.otherUser?.profile?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedConversation.otherUser?.profile?.firstName || 'User'}{' '}
                        {selectedConversation.otherUser?.profile?.lastName || ''}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.otherUser?.role || 'User'}
                      </p>
                    </div>
                    {selectedConversation.isMonitored && (
                      <span className="ml-auto px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        🔍 Monitored
                      </span>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.senderId === currentUser.id;
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                isOwn
                                  ? 'bg-[#C9A05C] text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn ? 'text-white/70' : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {isOwn && (
                                  <span className="ml-2">
                                    {message.isRead ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A05C] focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 bg-[#C9A05C] text-white rounded-lg hover:bg-[#C9A05C]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
