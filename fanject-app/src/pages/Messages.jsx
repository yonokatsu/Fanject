import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Send, Image, Smile, Search, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // โหลดรายการบทสนทนา
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // โหลดข้อความเมื่อเลือกบทสนทนา
  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      subscribeToMessages();
    }
    return () => {
      if (selectedConversation) {
        supabase.channel(`chat:${selectedConversation.id}`).unsubscribe();
      }
    };
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          participant_ids,
          last_message,
          last_message_at,
          unread_count,
          participants:users!participant_ids (
            id,
            username,
            avatar_url
          )
        `)
        .contains('participant_ids', [user.id])
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          image_url,
          sender_id,
          created_at,
          is_read,
          sender:users!sender_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // ทำเครื่องหมายว่าอ่านแล้ว
      await markAsRead(selectedConversation.id);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat:${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return channel;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const messageData = {
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        receiver_id: selectedConversation.participant_ids.find(id => id !== user.id),
        content: newMessage.trim(),
        is_read: false
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageData]);

      if (error) throw error;

      // อัปเดตบทสนทนาล่าสุด
      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString()
        })
        .eq('id', selectedConversation.id);

      setNewMessage('');
      loadMessages();
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv) => {
    if (!conv.participants) return null;
    return conv.participants.find(p => p.id !== user.id);
  };

  const filteredConversations = conversations.filter(conv => {
    const participant = getOtherParticipant(conv);
    return participant?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">กำลังโหลดบทสนทนา...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid messages-container">
      <div className="row h-100 g-0">
        {/* รายการบทสนทนา */}
        <div className={`col-md-4 col-lg-3 conversations-list ${selectedConversation ? 'd-none d-md-block' : ''}`}>
          <div className="conversations-header p-3 border-bottom">
            <h5 className="mb-0">ข้อความ</h5>
            <div className="input-group mt-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="ค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-secondary btn-sm" type="button">
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="conversations-body">
            {filteredConversations.length === 0 ? (
              <div className="text-center p-4 text-muted">
                <p>ยังไม่มีบทสนทนา</p>
                <small>เริ่มพูดคุยกับแฟนคลับคนอื่นได้เลย!</small>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const participant = getOtherParticipant(conv);
                return (
                  <div
                    key={conv.id}
                    className={`conversation-item p-3 border-bottom cursor-pointer ${
                      selectedConversation?.id === conv.id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={participant?.avatar_url || 'https://via.placeholder.com/40'}
                        alt={participant?.username}
                        className="rounded-circle me-3"
                        width="40"
                        height="40"
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 text-truncate">{participant?.username}</h6>
                          <small className="text-muted">
                            {new Date(conv.last_message_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </small>
                        </div>
                        <p className="mb-0 text-muted text-truncate small">
                          {conv.last_message || 'ยังไม่มีข้อความ'}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="badge bg-primary rounded-pill ms-2">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ห้องแชท */}
        <div className={`col-md-8 col-lg-9 chat-area ${!selectedConversation ? 'd-none d-md-block' : ''}`}>
          {selectedConversation ? (
            <>
              <div className="chat-header p-3 border-bottom d-flex align-items-center">
                <button 
                  className="btn btn-link d-md-none me-2"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={getOtherParticipant(selectedConversation)?.avatar_url || 'https://via.placeholder.com/40'}
                  alt={getOtherParticipant(selectedConversation)?.username}
                  className="rounded-circle me-3"
                  width="40"
                  height="40"
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0">{getOtherParticipant(selectedConversation)?.username}</h6>
                  <small className="text-muted">ออนไลน์</small>
                </div>
                <div className="chat-actions">
                  <button className="btn btn-link">
                    <Phone size={20} />
                  </button>
                  <button className="btn btn-link">
                    <Video size={20} />
                  </button>
                  <button className="btn btn-link">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="chat-messages p-3">
                {messages.map((msg, index) => {
                  const isOwn = msg.sender_id === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`message-bubble mb-3 ${isOwn ? 'own-message' : 'other-message'}`}
                    >
                      {!isOwn && (
                        <img
                          src={msg.sender?.avatar_url || 'https://via.placeholder.com/30'}
                          alt={msg.sender?.username}
                          className="message-avatar rounded-circle me-2"
                          width="30"
                          height="30"
                        />
                      )}
                      <div className={`message-content ${isOwn ? 'bg-primary text-white' : 'bg-light'}`}>
                        {msg.image_url && (
                          <img 
                            src={msg.image_url} 
                            alt="Shared image" 
                            className="img-fluid rounded mb-2"
                            style={{ maxWidth: '200px' }}
                          />
                        )}
                        <p className="mb-1">{msg.content}</p>
                        <small className={`message-time ${isOwn ? 'text-white-50' : 'text-muted'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </small>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="chat-input p-3 border-top">
                <form onSubmit={sendMessage} className="d-flex align-items-center">
                  <button type="button" className="btn btn-link me-2">
                    <Image size={20} />
                  </button>
                  <button type="button" className="btn btn-link me-2">
                    <Smile size={20} />
                  </button>
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="พิมพ์ข้อความ..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!newMessage.trim() || sending}
                  >
                    {sending ? (
                      <span className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </span>
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center text-muted">
                <Send size={64} className="mb-3 opacity-25" />
                <h5>เลือกบทสนทนาเพื่อเริ่มพูดคุย</h5>
                <p>ติดต่อกับแฟนคลับคนอื่น ๆ ได้ที่นี่</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
