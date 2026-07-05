import React, { useState, useEffect } from 'react';
import { Star, Send, Image, ThumbsUp, ThumbsDown, Filter, SortAsc } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import './Ratings.css';

const Ratings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('write'); // write, browse
  const [ratingType, setRatingType] = useState('event'); // event, artist
  const [selectedItem, setSelectedItem] = useState(null);
  const [starRating, setStarRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Browse state
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for selection
  const mockEvents = [
    { id: 1, name: 'Coldplay World Tour - Bangkok', type: 'event' },
    { id: 2, name: 'Taylor Swift Eras Tour', type: 'event' },
    { id: 3, name: 'Blackpink Born Pink Concert', type: 'event' },
  ];

  const mockArtists = [
    { id: 101, name: 'Coldplay', type: 'artist' },
    { id: 102, name: 'Taylor Swift', type: 'artist' },
    { id: 103, name: 'Blackpink', type: 'artist' },
    { id: 104, name: 'BTS', type: 'artist' },
  ];

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchReviews();
    }
  }, [activeTab, filterRating, sortBy]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      // In production, fetch from Supabase
      // For demo, using mock data
      const mockReviews = [
        {
          id: 1,
          user_name: 'Somchai F.',
          user_avatar: null,
          rating: 5,
          review_text: 'คอนเสิร์ตสุดยอดมาก! ศิลปินแสดงได้เยี่ยมมาก คุ้มค่าตั๋วจริงๆ',
          review_images: ['https://via.placeholder.com/300x200?text=Concert+Photo'],
          created_at: '2024-01-15T19:30:00Z',
          helpful_count: 24,
          not_helpful_count: 2,
          item_type: 'event',
          item_name: 'Coldplay World Tour - Bangkok'
        },
        {
          id: 2,
          user_name: 'Nida K.',
          user_avatar: null,
          rating: 4,
          review_text: 'บรรยากาศดีมาก แต่เสียงดังเกินไปหน่อยโดยรวมแล้วประทับใจ',
          review_images: [],
          created_at: '2024-01-14T20:15:00Z',
          helpful_count: 18,
          not_helpful_count: 5,
          item_type: 'event',
          item_name: 'Taylor Swift Eras Tour'
        },
        {
          id: 3,
          user_name: 'Pong P.',
          user_avatar: null,
          rating: 5,
          review_text: 'วงนี้เก่งมาก แสดงสดดีกว่าในคลิปอีก ต้องมาดูให้ได้!',
          review_images: ['https://via.placeholder.com/300x200?text=Artist+Photo', 'https://via.placeholder.com/300x200?text=Stage'],
          created_at: '2024-01-13T18:45:00Z',
          helpful_count: 32,
          not_helpful_count: 1,
          item_type: 'artist',
          item_name: 'Blackpink'
        },
      ];

      let filtered = mockReviews;
      
      // Apply filter
      if (filterRating !== 'all') {
        filtered = filtered.filter(r => r.rating === parseInt(filterRating));
      }

      // Apply sort
      if (sortBy === 'recent') {
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortBy === 'helpful') {
        filtered.sort((a, b) => b.helpful_count - a.helpful_count);
      } else if (sortBy === 'rating_high') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'rating_low') {
        filtered.sort((a, b) => a.rating - b.rating);
      }

      setReviews(filtered);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + reviewImages.length > 5) {
      alert('สามารถอัปโหลดได้สูงสุด 5 รูปภาพ');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!selectedItem) {
      setSubmitMessage('กรุณาเลือกกิจกรรมหรือศิลปิน');
      return;
    }
    
    if (starRating === 0) {
      setSubmitMessage('กรุณาให้คะแนน');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setSubmitMessage('กรุณาเขียนรีวิวอย่างน้อย 10 ตัวอักษร');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // In production, upload to Supabase
      // await supabase.from('reviews').insert({...});
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitMessage('✅ ส่งรีวิวเรียบร้อยแล้ว! ขอบคุณสำหรับความคิดเห็นของคุณ');
      
      // Reset form
      setStarRating(0);
      setReviewText('');
      setReviewImages([]);
      setSelectedItem(null);
      
    } catch (error) {
      setSubmitMessage('❌ เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่อีกครั้ง');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reviewId, voteType) => {
    // In production, update in Supabase
    console.log(`Voted ${voteType} on review ${reviewId}`);
    // Update local state optimistically
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          helpful_count: voteType === 'helpful' ? review.helpful_count + 1 : review.helpful_count,
          not_helpful_count: voteType === 'not_helpful' ? review.not_helpful_count + 1 : review.not_helpful_count
        };
      }
      return review;
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating, interactive = false, size = 'md') => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`star-icon ${size} ${interactive ? 'interactive' : ''} ${
              star <= (interactive ? hoverRating || starRating : rating) ? 'filled' : ''
            }`}
            onClick={() => interactive && setStarRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="ratings-page container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="page-title mb-4">
            <Star className="me-2" /> ระบบให้คะแนนและรีวิว
          </h2>

          {/* Tabs */}
          <div className="nav nav-tabs mb-4" role="tablist">
            <button
              className={`nav-link ${activeTab === 'write' ? 'active' : ''}`}
              onClick={() => setActiveTab('write')}
            >
              ✍️ เขียนรีวิว
            </button>
            <button
              className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              📖 อ่านรีวิว
            </button>
          </div>

          {/* Write Review Tab */}
          {activeTab === 'write' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleSubmitReview}>
                  {/* Select Item Type */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">ประเภทที่ต้องการรีวิว</label>
                    <div className="btn-group w-100" role="group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="ratingType"
                        id="typeEvent"
                        value="event"
                        checked={ratingType === 'event'}
                        onChange={(e) => {
                          setRatingType(e.target.value);
                          setSelectedItem(null);
                        }}
                      />
                      <label className="btn btn-outline-primary" htmlFor="typeEvent">
                        🎵 กิจกรรม/คอนเสิร์ต
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="ratingType"
                        id="typeArtist"
                        value="artist"
                        checked={ratingType === 'artist'}
                        onChange={(e) => {
                          setRatingType(e.target.value);
                          setSelectedItem(null);
                        }}
                      />
                      <label className="btn btn-outline-primary" htmlFor="typeArtist">
                        🎤 ศิลปิน
                      </label>
                    </div>
                  </div>

                  {/* Select Item */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      เลือก{ratingType === 'event' ? 'กิจกรรม' : 'ศิลปิน'}
                    </label>
                    <select
                      className="form-select"
                      value={selectedItem?.id || ''}
                      onChange={(e) => {
                        const items = ratingType === 'event' ? mockEvents : mockArtists;
                        const selected = items.find(item => item.id === parseInt(e.target.value));
                        setSelectedItem(selected);
                      }}
                      required
                    >
                      <option value="">-- กรุณาเลือก --</option>
                      {(ratingType === 'event' ? mockEvents : mockArtists).map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Star Rating */}
                  {selectedItem && (
                    <>
                      <div className="mb-4 text-center">
                        <label className="form-label fw-bold d-block mb-2">ให้คะแนน</label>
                        <div className="d-flex justify-content-center">
                          {renderStars(starRating, true, 'lg')}
                        </div>
                        <div className="mt-2 text-muted">
                          {starRating === 1 && 'แย่มาก'}
                          {starRating === 2 && 'แย่'}
                          {starRating === 3 && 'พอใช้'}
                          {starRating === 4 && 'ดี'}
                          {starRating === 5 && 'ยอดเยี่ยม'}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div className="mb-4">
                        <label className="form-label fw-bold">เขียนรีวิว</label>
                        <textarea
                          className="form-control"
                          rows="5"
                          placeholder="แบ่งปันประสบการณ์ของคุณกับผู้อื่น... (อย่างน้อย 10 ตัวอักษร)"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        />
                        <div className="form-text">
                          {reviewText.length} ตัวอักษร
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="mb-4">
                        <label className="form-label fw-bold">อัปโหลดรูปภาพ (สูงสุด 5 รูป)</label>
                        <div className="image-upload-area">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="form-control"
                            disabled={reviewImages.length >= 5}
                          />
                          {reviewImages.length > 0 && (
                            <div className="image-preview-container mt-3">
                              {reviewImages.map((img, index) => (
                                <div key={index} className="image-preview-item">
                                  <img src={img} alt={`Preview ${index}`} />
                                  <button
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={() => removeImage(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" />
                              กำลังส่งรีวิว...
                            </>
                          ) : (
                            <>
                              <Send className="me-2" size={18} />
                              ส่งรีวิว
                            </>
                          )}
                        </button>
                      </div>

                      {submitMessage && (
                        <div className={`alert ${submitMessage.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                          {submitMessage}
                        </div>
                      )}
                    </>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Browse Reviews Tab */}
          {activeTab === 'browse' && (
            <div>
              {/* Filters */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <Filter size={16} className="me-1" />
                        กรองตามคะแนน
                      </label>
                      <select
                        className="form-select"
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                      >
                        <option value="all">ทุกคะแนน</option>
                        <option value="5">⭐⭐⭐⭐⭐ (5 ดาว)</option>
                        <option value="4">⭐⭐⭐⭐ (4 ดาว)</option>
                        <option value="3">⭐⭐⭐ (3 ดาว)</option>
                        <option value="2">⭐⭐ (2 ดาว)</option>
                        <option value="1">⭐ (1 ดาว)</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        <SortAsc size={16} className="me-1" />
                        เรียงลำดับ
                      </label>
                      <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="recent">ล่าสุด</option>
                        <option value="helpful">มีประโยชน์ที่สุด</option>
                        <option value="rating_high">คะแนนสูงไปต่ำ</option>
                        <option value="rating_low">คะแนนต่ำไปสูง</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">กำลังโหลด...</span>
                  </div>
                  <p className="mt-2">กำลังโหลดรีวิว...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="alert alert-info text-center">
                  ยังไม่มีรีวิวในขณะนี้ เป็นคนแรกที่จะเขียนรีวิวเลย!
                </div>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="card shadow-sm mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="user-avatar me-3">
                              {review.user_avatar ? (
                                <img src={review.user_avatar} alt={review.user_name} />
                              ) : (
                                <div className="avatar-placeholder">
                                  {review.user_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold">{review.user_name}</h6>
                              <small className="text-muted">
                                รีวิวเมื่อ {formatDate(review.created_at)}
                              </small>
                            </div>
                          </div>
                          <div className="text-end">
                            {renderStars(review.rating)}
                            <div className="badge bg-primary mt-1">
                              {review.item_type === 'event' ? '🎵 กิจกรรม' : '🎤 ศิลปิน'}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h6 className="fw-bold text-primary">
                            {review.item_name}
                          </h6>
                          <p className="review-text mb-3">{review.review_text}</p>
                          
                          {review.review_images && review.review_images.length > 0 && (
                            <div className="review-images mb-3">
                              {review.review_images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Review image ${idx}`}
                                  className="review-image-item"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="d-flex gap-3">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleVote(review.id, 'helpful')}
                          >
                            <ThumbsUp size={14} className="me-1" />
                            มีประโยชน์ ({review.helpful_count})
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleVote(review.id, 'not_helpful')}
                          >
                            <ThumbsDown size={14} className="me-1" />
                            ไม่มีประโยชน์ ({review.not_helpful_count})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ratings;
