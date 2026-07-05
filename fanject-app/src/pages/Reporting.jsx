import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle, FileText, User, MessageSquare } from 'lucide-react';
import './Reporting.css';

const Reporting = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [reportType, setReportType] = useState('');
  const [targetType, setTargetType] = useState('post');
  const [targetId, setTargetId] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [submittedReports, setSubmittedReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data for submitted reports
  useEffect(() => {
    // In real app, fetch from Supabase
    const mockReports = [
      {
        id: 1,
        type: 'inappropriate_content',
        targetType: 'post',
        targetId: 'post_123',
        description: 'โพสต์นี้มีเนื้อหาที่ไม่เหมาะสม',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z',
        updatedAt: null
      },
      {
        id: 2,
        type: 'spam',
        targetType: 'user',
        targetId: 'user_456',
        description: 'ผู้ใช้คนนี้ส่งสแปม',
        status: 'resolved',
        submittedAt: '2024-01-14T08:15:00Z',
        updatedAt: '2024-01-15T14:20:00Z'
      },
      {
        id: 3,
        type: 'harassment',
        targetType: 'comment',
        targetId: 'comment_789',
        description: 'ความคิดเห็นนี้เป็นการกลั่นแกล้ง',
        status: 'rejected',
        submittedAt: '2024-01-13T16:45:00Z',
        updatedAt: '2024-01-14T09:00:00Z'
      }
    ];
    setSubmittedReports(mockReports);
  }, []);

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportType || !description) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReport = {
      id: Date.now(),
      type: reportType,
      targetType,
      targetId: targetId || `auto_${Date.now()}`,
      description,
      evidence: evidence ? URL.createObjectURL(evidence) : null,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      updatedAt: null
    };

    setSubmittedReports([newReport, ...submittedReports]);
    setIsLoading(false);
    setShowSuccess(true);
    
    // Reset form
    setReportType('');
    setTargetType('post');
    setTargetId('');
    setDescription('');
    setEvidence(null);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="status-icon pending" size={20} />;
      case 'resolved':
        return <CheckCircle className="status-icon resolved" size={20} />;
      case 'rejected':
        return <XCircle className="status-icon rejected" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'รอดำเนินการ';
      case 'resolved':
        return 'แก้ไขแล้ว';
      case 'rejected':
        return 'ปฏิเสธ';
      default:
        return status;
    }
  };

  const getReportTypeText = (type) => {
    const types = {
      inappropriate_content: 'เนื้อหาไม่เหมาะสม',
      spam: 'สแปม',
      harassment: 'การกลั่นแกล้ง',
      hate_speech: 'คำพูดแสดงความเกลียดชัง',
      misinformation: 'ข้อมูลเท็จ',
      copyright: 'ละเมิดลิขสิทธิ์',
      other: 'อื่นๆ'
    };
    return types[type] || type;
  };

  return (
    <div className="reporting-container">
      <div className="reporting-header">
        <h1 className="reporting-title">
          <AlertTriangle className="me-2" size={28} />
          ระบบรายงานและแจ้งปัญหา
        </h1>
        <p className="reporting-subtitle">ช่วยเราดูแลชุมชนให้ปลอดภัยและน่าอยู่</p>
      </div>

      {/* Tabs */}
      <div className="reporting-tabs mb-4">
        <button 
          className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          <FileText size={18} className="me-2" />
          ส่งรายงานใหม่
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={18} className="me-2" />
          ประวัติการรายงาน
        </button>
      </div>

      {activeTab === 'submit' && (
        <div className="submit-report-section">
          {showSuccess && (
            <div className="alert alert-success d-flex align-items-center">
              <CheckCircle className="me-2" size={20} />
              ส่งรายงานเรียบร้อยแล้ว เราจะตรวจสอบภายใน 24-48 ชั่วโมง
            </div>
          )}

          <form onSubmit={handleSubmitReport} className="report-form">
            <div className="form-section">
              <h5 className="section-title">ประเภทเป้าหมาย</h5>
              <div className="btn-group-toggle mb-3">
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="targetType" 
                  id="target-post" 
                  autoComplete="off"
                  checked={targetType === 'post'}
                  onChange={() => setTargetType('post')}
                />
                <label className="btn btn-outline-primary" htmlFor="target-post">โพสต์</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="targetType" 
                  id="target-comment" 
                  autoComplete="off"
                  checked={targetType === 'comment'}
                  onChange={() => setTargetType('comment')}
                />
                <label className="btn btn-outline-primary" htmlFor="target-comment">ความคิดเห็น</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="targetType" 
                  id="target-user" 
                  autoComplete="off"
                  checked={targetType === 'user'}
                  onChange={() => setTargetType('user')}
                />
                <label className="btn btn-outline-primary" htmlFor="target-user">ผู้ใช้</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="targetType" 
                  id="target-event" 
                  autoComplete="off"
                  checked={targetType === 'event'}
                  onChange={() => setTargetType('event')}
                />
                <label className="btn btn-outline-primary" htmlFor="target-event">กิจกรรม</label>
              </div>
            </div>

            <div className="form-section">
              <h5 className="section-title">เหตุผลในการรายงาน</h5>
              <select 
                className="form-select mb-3"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value="">เลือกเหตุผล</option>
                <option value="inappropriate_content">เนื้อหาไม่เหมาะสม</option>
                <option value="spam">สแปมหรือโฆษณา</option>
                <option value="harassment">การกลั่นแกล้งหรือคุกคาม</option>
                <option value="hate_speech">คำพูดแสดงความเกลียดชัง</option>
                <option value="misinformation">ข้อมูลเท็จหรือผิดเพี้ยน</option>
                <option value="copyright">ละเมิดลิขสิทธิ์</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div className="form-section">
              <h5 className="section-title">รหัสเป้าหมาย (ถ้ามี)</h5>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="เช่น post_123, user_456 (เว้นว่างได้หากไม่ทราบ)"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              />
            </div>

            <div className="form-section">
              <h5 className="section-title">รายละเอียดเพิ่มเติม</h5>
              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder="อธิบายรายละเอียดของปัญหาที่พบ..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-section">
              <h5 className="section-title">หลักฐาน (รูปภาพ/ไฟล์)</h5>
              <div className="evidence-upload mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => setEvidence(e.target.files[0])}
                />
                {evidence && (
                  <div className="evidence-preview mt-2">
                    <small className="text-muted">
                      <FileText size={14} className="me-1" />
                      {evidence.name}
                    </small>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    กำลังส่งรายงาน...
                  </>
                ) : (
                  <>
                    <AlertTriangle size={20} className="me-2" />
                    ส่งรายงาน
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-section">
          <h5 className="section-title mb-3">ประวัติการรายงานของคุณ</h5>
          
          {submittedReports.length === 0 ? (
            <div className="empty-state text-center py-5">
              <FileText size={48} className="text-muted mb-3" />
              <p className="text-muted">ยังไม่มีประวัติการรายงาน</p>
            </div>
          ) : (
            <div className="reports-list">
              {submittedReports.map((report) => (
                <div key={report.id} className="report-card card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-secondary me-2">
                          {getReportTypeText(report.type)}
                        </span>
                        <span className="badge bg-light text-dark">
                          {report.targetType === 'post' && 'โพสต์'}
                          {report.targetType === 'comment' && 'ความคิดเห็น'}
                          {report.targetType === 'user' && 'ผู้ใช้'}
                          {report.targetType === 'event' && 'กิจกรรม'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(report.status)}
                        <span className={`status-text ${report.status} ms-2`}>
                          {getStatusText(report.status)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="card-text mb-2">{report.description}</p>
                    
                    <div className="report-meta text-muted small">
                      <div className="d-flex justify-content-between">
                        <span>
                          <Clock size={14} className="me-1" />
                          ส่งเมื่อ: {new Date(report.submittedAt).toLocaleDateString('th-TH')}
                        </span>
                        {report.updatedAt && (
                          <span>
                            อัปเดต: {new Date(report.updatedAt).toLocaleDateString('th-TH')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reporting;
