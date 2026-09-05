import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle2,
  CheckCircle,
  Clock,
  Languages,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  Download,
  Share2,
  Volume2,
  Sparkles,
  FileCheck,
  HelpCircle
} from 'lucide-react';
import { moduleData } from './moduleData';
import QuizModal from './QuizModal';
import CertificateModal from './CertificateModal';
import './ModuleDetail.css';

/* ─── Language map for UI strings ─── */
const ui = {
  en: {
    back: 'Back to Academy',
    lessons: 'Lessons',
    quiz: 'Take the Quiz',
    quizPassed: 'Quiz Passed',
    certificate: 'View Certificate',
    progress: 'Progress',
    markDone: 'Mark as Completed',
    done: 'Completed',
    level: 'Level',
    duration: 'Duration',
    languages: 'Languages',
    format: 'Format',
    about: 'About this module',
    playlist: 'Lesson Playlist',
    currentLesson: 'Now Playing',
    next: 'Next Lesson',
    prev: 'Previous Lesson',
    completionNote: 'Complete lessons and take the quiz to earn your verifiable digital certificate.',
    notesTitle: 'Lesson Notes & Practical Field Guide',
    audioGuide: 'Play Audio Summary (AI Voice)',
    keyTakeaways: 'Key Farmer Takeaways'
  },
  hi: {
    back: 'अकादमी पर वापस जाएं',
    lessons: 'पाठ',
    quiz: 'क्विज दें',
    quizPassed: 'क्विज पास',
    certificate: 'प्रमाणपत्र देखें',
    progress: 'प्रगति',
    markDone: 'पूर्ण के रूप में चिह्नित करें',
    done: 'पूर्ण',
    level: 'स्तर',
    duration: 'अवधि',
    languages: 'भाषाएं',
    format: 'प्रारूप',
    about: 'इस मॉड्यूल के बारे में',
    playlist: 'पाठ सूची',
    currentLesson: 'अभी चल रहा है',
    next: 'अगला पाठ',
    prev: 'पिछला पाठ',
    completionNote: 'अपना प्रमाणपत्र अर्जित करने के लिए पाठ पूरे करें और क्विज पास करें।',
    notesTitle: 'पाठ सारांश और व्यावहारिक मार्गदर्शिका',
    audioGuide: 'ऑडियो सारांश सुनें (एआई आवाज)',
    keyTakeaways: 'प्रमुख किसान बिंदु'
  }
};

const toneGradient = {
  ivory: 'linear-gradient(135deg, #EDEDCE 0%, #F8F6E8 100%)',
  blue: 'linear-gradient(135deg, #BED5E5 0%, #E8F4FA 100%)',
  lime: 'linear-gradient(135deg, #DDFF86 0%, #EAFFC3 100%)',
  coral: 'linear-gradient(135deg, #FFAAA4 0%, #FFE0DE 100%)',
};

const ModuleDetail = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const module = moduleData.find((m) => m.id === moduleId) || moduleData[0];
  const lang = localStorage.getItem('wt_academy_lang') || 'en';
  const t = ui[lang] || ui.en;

  const storageKey = `wt_module_progress_${module.id}`;
  const quizKey = `wt_quiz_${module.id}`;

  const [completedLessons, setCompletedLessons] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  });
  const [quizResult, setQuizResult] = useState(() => {
    try { return JSON.parse(localStorage.getItem(quizKey)) || null; }
    catch { return null; }
  });
  const [activeLesson, setActiveLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // notes | checklist

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [moduleId]);

  const totalLessons = module.lessons.length;
  const completedCount = completedLessons.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);
  const allDone = completedCount === totalLessons;

  const markComplete = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    // Auto-advance to next lesson if not at end
    const idx = module.lessons.findIndex((l) => l.id === lessonId);
    if (idx < module.lessons.length - 1) {
      setActiveLesson(idx + 1);
    }
  };

  const handleQuizComplete = (score, passed, options = {}) => {
    const { closeQuiz = true, showCertificate = true } = options;
    const result = { score, passed, date: new Date().toISOString() };
    setQuizResult(result);
    localStorage.setItem(quizKey, JSON.stringify(result));
    if (closeQuiz) setShowQuiz(false);
    if (passed && showCertificate) setTimeout(() => setShowCert(true), 400);
  };

  const currentLesson = module.lessons[activeLesson] || module.lessons[0];

  const getYtId = (lesson) => {
    const ids = lesson.youtubeIds || {};
    return ids[lang] || ids.en || 'kxsa7zATRWQ';
  };

  const ytSrc = `https://www.youtube.com/embed/${getYtId(currentLesson)}?autoplay=0&rel=0&modestbranding=1&color=white&controls=1`;

  return (
    <div className="md-page">
      {/* ── Back Button ── */}
      <button className="md-back-btn" onClick={() => navigate('/farmer/academy')}>
        <ArrowLeft size={18} />
        <span>{t.back}</span>
      </button>

      {/* ── Module Header ── */}
      <div
        className="md-header"
        style={{ background: toneGradient[module.tone] || toneGradient.ivory }}
      >
        <div className="md-header-content">
          <div className="md-badges">
            <span className="md-level-badge">{module.level}</span>
            <span className="md-format-badge">{module.format}</span>
          </div>
          <h1 className="md-title">
            {lang === 'hi' ? module.titleHi : module.title}
          </h1>
          <p className="md-desc">{module.description}</p>
          <div className="md-meta-row">
            <span><Clock size={15} /> {module.duration}</span>
            <span><BookOpen size={15} /> {totalLessons} {t.lessons}</span>
            <span><Languages size={15} /> {module.languageCount || 8} languages</span>
          </div>
        </div>

        {/* Progress Ring & Quiz Action */}
        <div className="md-progress-panel">
          <div className="md-progress-ring-wrap">
            <svg width="92" height="92" viewBox="0 0 92 92">
              <circle cx="46" cy="46" r="38" fill="none" stroke="rgba(11,18,13,0.1)" strokeWidth="7" />
              <circle
                cx="46" cy="46" r="38" fill="none"
                stroke="#0B120D" strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 38}`}
                strokeDashoffset={`${2 * Math.PI * 38 * (1 - progressPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 46 46)"
                style={{ transition: 'stroke-dashoffset 0.7s ease' }}
              />
            </svg>
            <span className="md-ring-pct">{progressPct}%</span>
          </div>
          <span className="md-ring-label">{t.progress}</span>
          <span className="md-ring-sub">{completedCount}/{totalLessons} {t.lessons}</span>

          {quizResult?.passed ? (
            <button className="md-cert-btn" onClick={() => setShowCert(true)}>
              <Award size={16} /> {t.certificate}
            </button>
          ) : (
            <button className="md-quiz-btn" onClick={() => setShowQuiz(true)}>
              <Star size={16} /> {t.quiz}
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content: Player + Playlist ── */}
      <div className="md-body">
        {/* ── Left: Video Player & Rich Lesson Notes ── */}
        <div className="md-player-col">
          <div className="md-now-playing-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlayCircle size={16} />
              <span>Lesson {activeLesson + 1} of {totalLessons}: {currentLesson.title}</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#666' }}>
              {currentLesson.duration}
            </span>
          </div>

          {/* YouTube iframe embed */}
          <div className="md-video-wrapper">
            <iframe
              key={getYtId(currentLesson)}
              src={ytSrc}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="md-video-iframe"
            />
          </div>

          {/* Lesson Actions & Info */}
          <div className="md-lesson-info">
            <div className="md-lesson-info-top">
              <div>
                <h2 className="md-lesson-title">
                  {lang === 'hi' ? currentLesson.titleHi : currentLesson.title}
                </h2>
                <p className="md-lesson-desc">{currentLesson.description}</p>
              </div>
              <div className="md-lesson-actions">
                {completedLessons.includes(currentLesson.id) ? (
                  <button className="md-done-btn" disabled>
                    <CheckCircle size={17} /> {t.done}
                  </button>
                ) : (
                  <button
                    className="md-mark-btn"
                    onClick={() => markComplete(currentLesson.id)}
                  >
                    <CheckCircle2 size={17} /> {t.markDone}
                  </button>
                )}
              </div>
            </div>

            {/* Audio Summary Simulation Button */}
            <div style={{
              background: '#F8F8F3',
              border: '1px solid rgba(11,18,13,0.08)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '16px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={20} color="#166534" />
                <div>
                  <strong style={{ fontSize: '13px', color: '#0B120D' }}>{t.audioGuide}</strong>
                  <div style={{ fontSize: '11px', color: '#666' }}>Listen to key concepts in clear spoken language.</div>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsPlayingAudio(!isPlayingAudio);
                  if (!isPlayingAudio) {
                    const utterance = new SpeechSynthesisUtterance(`${currentLesson.title}. ${currentLesson.description}`);
                    utterance.rate = 0.95;
                    window.speechSynthesis.speak(utterance);
                  } else {
                    window.speechSynthesis.cancel();
                  }
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: isPlayingAudio ? '#0B120D' : '#DDFF86',
                  color: isPlayingAudio ? '#DDFF86' : '#0B120D',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {isPlayingAudio ? '⏹ Stop Audio' : '▶ Play Audio'}
              </button>
            </div>

            {/* Comprehensive Lesson Notes Tab & Checklist */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(11,18,13,0.10)',
              borderRadius: '14px',
              padding: '20px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(11,18,13,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    color: activeTab === 'notes' ? '#0B120D' : '#888',
                    borderBottom: activeTab === 'notes' ? '2px solid #0B120D' : 'none',
                    paddingBottom: '4px',
                    cursor: 'pointer'
                  }}
                >
                  📖 {t.notesTitle}
                </button>
                <button
                  onClick={() => setActiveTab('checklist')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '13px',
                    color: activeTab === 'checklist' ? '#0B120D' : '#888',
                    borderBottom: activeTab === 'checklist' ? '2px solid #0B120D' : 'none',
                    paddingBottom: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Field Checklist
                </button>
              </div>

              {activeTab === 'notes' ? (
                <div style={{ fontSize: '13px', lineHeight: '1.7', color: '#333' }}>
                  <div style={{ fontWeight: '700', color: '#0B120D', marginBottom: '8px', fontSize: '14px' }}>
                    {t.keyTakeaways}:
                  </div>
                  <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0' }}>
                    <li><strong>Preparation:</strong> Keep sheep off feed and water for 8–10 hours prior to shearing to prevent stress and contamination.</li>
                    <li><strong>Blade Technique:</strong> Maintain flat blade contact to eliminate second-cuts that reduce fleece fiber staple length.</li>
                    <li><strong>Skirting & Quality:</strong> Remove belly, stained tags, and burrs immediately before rolling the fleece into breathable jute packs.</li>
                    <li><strong>Moisture Control:</strong> Never shear or bale damp wool. Maintain 10–12% relative moisture baseline to preserve fiber elasticity and prevent fungal discoloration.</li>
                  </ul>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: '#333' }}>
                  <div style={{ fontWeight: '700', color: '#0B120D', marginBottom: '10px' }}>
                    On-Field Operational Checklist:
                  </div>
                  {[
                    'Clean shearing floor covered with tarpaulin or slatted wood.',
                    'Check blade sharpness and lubrication temperature every 15 sheep.',
                    'Keep separate color-coded bins for belly wool, fleece, and tags.',
                    'Fasten WoolTrace digital QR tag onto each completed 50 KG bale.'
                  ].map((item, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={i === 0} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation CTA: Prev / Next / Quiz */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {activeLesson > 0 && (
                <button
                  className="md-next-btn"
                  onClick={() => setActiveLesson(activeLesson - 1)}
                  style={{ background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.12)', color: '#0B120D' }}
                >
                  <ChevronLeft size={18} />
                  <span>{t.prev}</span>
                </button>
              )}

              {activeLesson < totalLessons - 1 ? (
                <button
                  className="md-next-btn"
                  onClick={() => {
                    markComplete(currentLesson.id);
                    setActiveLesson(activeLesson + 1);
                  }}
                  style={{ flex: 1 }}
                >
                  <span>{t.next}: {module.lessons[activeLesson + 1].title}</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  className="md-quiz-launch-btn"
                  onClick={() => setShowQuiz(true)}
                  style={{ flex: 1 }}
                >
                  <Star size={16} /> Take Module Quiz & Earn Certificate <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Playlist ── */}
        <div className="md-playlist-col">
          <div className="md-playlist-header">
            <h3>{t.playlist}</h3>
            <span>{completedCount}/{totalLessons} completed</span>
          </div>

          <div className="md-playlist">
            {module.lessons.map((lesson, idx) => {
              const isDone = completedLessons.includes(lesson.id);
              const isActive = idx === activeLesson;

              return (
                <button
                  key={lesson.id}
                  className={`md-playlist-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  onClick={() => setActiveLesson(idx)}
                  title={lesson.title}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Thumbnail */}
                  <div className="md-thumb-wrap">
                    <img
                      src={`https://img.youtube.com/vi/${getYtId(lesson)}/mqdefault.jpg`}
                      alt={lesson.title}
                      className="md-thumb"
                      loading="lazy"
                    />
                    <div className="md-thumb-overlay">
                      {isDone ? (
                        <CheckCircle size={18} className="md-check-icon" />
                      ) : (
                        <PlayCircle size={20} className="md-play-icon" />
                      )}
                    </div>
                    <span className="md-thumb-duration">{lesson.duration}</span>
                  </div>

                  {/* Info */}
                  <div className="md-playlist-info">
                    <span className="md-playlist-num">
                      {isDone ? (
                        <CheckCircle size={14} className="md-done-icon" />
                      ) : (
                        `${idx + 1}.`
                      )}
                    </span>
                    <div>
                      <p className="md-playlist-title">
                        {lang === 'hi' ? lesson.titleHi : lesson.title}
                      </p>
                      <span className="md-playlist-dur"><Clock size={11} /> {lesson.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Quiz Row at the bottom of playlist */}
            <div
              className={`md-playlist-quiz-row ${quizResult?.passed ? 'quiz-passed' : ''}`}
              onClick={() => setShowQuiz(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowQuiz(true);
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <div className="md-quiz-row-icon">
                {quizResult?.passed ? <CheckCircle size={18} /> : <Star size={18} />}
              </div>
              <div>
                <p className="md-playlist-title">
                  {quizResult?.passed ? t.quizPassed : t.quiz}
                </p>
                {quizResult?.passed ? (
                  <span className="md-playlist-dur">Score: {quizResult.score}% (Passed)</span>
                ) : (
                  <span className="md-playlist-dur">Test your knowledge & earn badge</span>
                )}
              </div>
              {quizResult?.passed && (
                <button
                  className="md-mini-cert-btn"
                  onClick={(e) => { e.stopPropagation(); setShowCert(true); }}
                >
                  <Award size={14} />
                </button>
              )}
            </div>
          </div>

          {/* About Section */}
          <div className="md-about-card">
            <h4>{t.about}</h4>
            <div className="md-about-grid">
              <div>
                <span>{t.level}</span>
                <strong>{module.level}</strong>
              </div>
              <div>
                <span>{t.duration}</span>
                <strong>{module.duration}</strong>
              </div>
              <div>
                <span>{t.languages}</span>
                <strong>{module.languageCount || 8} languages</strong>
              </div>
              <div>
                <span>{t.format}</span>
                <strong>{module.format}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showQuiz && (
        <QuizModal
          module={module}
          lang={lang}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
      {showCert && (
        <CertificateModal
          module={module}
          quizResult={quizResult || { score: 95, passed: true }}
          lang={lang}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
};

export default ModuleDetail;
