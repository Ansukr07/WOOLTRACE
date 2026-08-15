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
  Lock,
  Star,
  BarChart2,
  Download,
  Share2,
  Volume2,
  Maximize2,
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
    locked: 'Complete previous lesson first',
    level: 'Level',
    duration: 'Duration',
    languages: 'Languages',
    format: 'Format',
    about: 'About this module',
    playlist: 'Lesson Playlist',
    currentLesson: 'Now Playing',
    next: 'Next Lesson',
    completionNote: 'Complete all lessons and pass the quiz to earn your certificate.',
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
    locked: 'पहले पिछला पाठ पूरा करें',
    level: 'स्तर',
    duration: 'अवधि',
    languages: 'भाषाएं',
    format: 'प्रारूप',
    about: 'इस मॉड्यूल के बारे में',
    playlist: 'पाठ सूची',
    currentLesson: 'अभी चल रहा है',
    next: 'अगला पाठ',
    completionNote: 'अपना प्रमाणपत्र अर्जित करने के लिए सभी पाठ पूरे करें और क्विज पास करें।',
  },
  gu: {
    back: 'અકાડેમી પર પાછા જાઓ',
    lessons: 'પાઠ',
    quiz: 'ક્વિઝ આપો',
    quizPassed: 'ક્વિઝ પાસ',
    certificate: 'પ્રમાણપત્ર જુઓ',
    progress: 'પ્રગતિ',
    markDone: 'સંપૂર્ણ તરીકે ચિહ્નિત કરો',
    done: 'સંપૂર્ણ',
    locked: 'પ્રથમ પાછલો પાઠ પૂર્ણ કરો',
    level: 'સ્તર',
    duration: 'સમયગાળો',
    languages: 'ભાષાઓ',
    format: 'ફોર્મેટ',
    about: 'આ મૉડ્યૂલ વિશે',
    playlist: 'પાઠ પ્લેલિસ્ટ',
    currentLesson: 'હવે ચાલી રહ્યું છે',
    next: 'આગળનો પાઠ',
    completionNote: 'પ્રમાણ પત્ર મેળવવા માટે બધા પાઠ પૂર્ણ કરો અને ક્વિઝ પાસ કરો.',
  },
  raj: {
    back: 'अकादमी पे वापस',
    lessons: 'पाठ',
    quiz: 'क्विज दो',
    quizPassed: 'क्विज पास',
    certificate: 'सर्टिफिकेट देखो',
    progress: 'प्रगति',
    markDone: 'पूरो हुयो',
    done: 'पूरो',
    locked: 'पहला पाठ पूरो करो',
    level: 'स्तर',
    duration: 'समय',
    languages: 'भाषा',
    format: 'फॉर्मेट',
    about: 'इस मॉड्यूल के बारे में',
    playlist: 'पाठ सूची',
    currentLesson: 'अभी चल रयो है',
    next: 'अगलो पाठ',
    completionNote: 'सर्टिफिकेट पाण के लिए सब पाठ पूरा करो और क्विज पास करो।',
  },
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

  const module = moduleData.find((m) => m.id === moduleId);
  const lang = localStorage.getItem('wt_academy_lang') || 'en';
  const t = ui[lang] || ui.en;

  const storageKey = `wt_module_progress_${moduleId}`;
  const quizKey = `wt_quiz_${moduleId}`;

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
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!module) {
    return (
      <div className="md-not-found">
        <h2>Module not found</h2>
        <button onClick={() => navigate('/farmer/academy')} className="md-back-btn">
          <ArrowLeft size={18} /> Back to Academy
        </button>
      </div>
    );
  }

  const totalLessons = module.lessons.length;
  const completedCount = completedLessons.length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);
  const allDone = completedCount === totalLessons;

  const markComplete = (lessonId) => {
    if (completedLessons.includes(lessonId)) return;
    const updated = [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Auto-advance to next lesson
    const idx = module.lessons.findIndex((l) => l.id === lessonId);
    if (idx < module.lessons.length - 1) {
      setTimeout(() => setActiveLesson(idx + 1), 600);
    }
  };

  const handleQuizComplete = (score, passed) => {
    const result = { score, passed, date: new Date().toISOString() };
    setQuizResult(result);
    localStorage.setItem(quizKey, JSON.stringify(result));
    setShowQuiz(false);
    if (passed) setTimeout(() => setShowCert(true), 400);
  };

  const currentLesson = module.lessons[activeLesson];
  const isLessonLocked = (idx) => idx > 0 && !completedLessons.includes(module.lessons[idx - 1].id);

  // Resolve the correct YouTube ID for the current language, with English fallback
  const getYtId = (lesson) => {
    const ids = lesson.youtubeIds || {};
    return ids[lang] || ids.en || '';
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
        style={{ background: toneGradient[module.tone] }}
      >
        <div className="md-header-content">
          <div className="md-badges">
            <span className="md-level-badge">{module.level}</span>
            <span className="md-format-badge">{module.format}</span>
          </div>
          <h1 className="md-title">
            {lang === 'hi' ? module.titleHi : lang === 'gu' ? module.titleGu : module.title}
          </h1>
          <p className="md-desc">{module.description}</p>
          <div className="md-meta-row">
            <span><Clock size={15} /> {module.duration}</span>
            <span><BookOpen size={15} /> {totalLessons} {t.lessons}</span>
            <span><Languages size={15} /> {module.languageCount} languages</span>
          </div>
        </div>

        {/* Progress Ring */}
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
          ) : allDone ? (
            <button className="md-quiz-btn" onClick={() => setShowQuiz(true)}>
              <Star size={16} /> {t.quiz}
            </button>
          ) : null}
        </div>
      </div>

      {/* ── Main Content: Player + Playlist ── */}
      <div className="md-body">
        {/* ── Left: Video Player ── */}
        <div className="md-player-col">
          <div className="md-now-playing-label">
            <PlayCircle size={16} />
            <span>{t.currentLesson}</span>
          </div>

          {/* YouTube iframe embed */}
          <div className="md-video-wrapper">
            <iframe
              ref={playerRef}
              key={getYtId(currentLesson)}
              src={ytSrc}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="md-video-iframe"
            />
          </div>

          {/* Lesson Info */}
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

            {/* Next lesson CTA */}
            {activeLesson < totalLessons - 1 && (
              <button
                className="md-next-btn"
                onClick={() => {
                  markComplete(currentLesson.id);
                  setActiveLesson(activeLesson + 1);
                }}
              >
                <span>{t.next}: {module.lessons[activeLesson + 1].title}</span>
                <ChevronRight size={18} />
              </button>
            )}

            {/* Quiz CTA after last lesson */}
            {activeLesson === totalLessons - 1 && !quizResult?.passed && (
              <div className="md-quiz-cta">
                <div className="md-quiz-cta-text">
                  <Star size={18} />
                  <span>{t.completionNote}</span>
                </div>
                {allDone && (
                  <button className="md-quiz-launch-btn" onClick={() => setShowQuiz(true)}>
                    {t.quiz} <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Playlist ── */}
        <div className="md-playlist-col">
          <div className="md-playlist-header">
            <h3>{t.playlist}</h3>
            <span>{completedCount}/{totalLessons}</span>
          </div>

          <div className="md-playlist">
            {module.lessons.map((lesson, idx) => {
              const isDone = completedLessons.includes(lesson.id);
              const isActive = idx === activeLesson;
              const locked = isLessonLocked(idx);

              return (
                <button
                  key={lesson.id}
                  className={`md-playlist-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${locked ? 'locked' : ''}`}
                  onClick={() => !locked && setActiveLesson(idx)}
                  title={locked ? t.locked : lesson.title}
                  disabled={locked}
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
                      {locked ? (
                        <Lock size={16} />
                      ) : isDone ? (
                        <CheckCircle size={18} className="md-check-icon" />
                      ) : isActive ? (
                        <PlayCircle size={20} className="md-play-icon" />
                      ) : (
                        <PlayCircle size={16} />
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

            {/* Quiz row at the bottom of playlist */}
            <button
              className={`md-playlist-quiz-row ${quizResult?.passed ? 'quiz-passed' : ''} ${!allDone ? 'quiz-locked' : ''}`}
              onClick={() => allDone && !quizResult?.passed && setShowQuiz(true)}
              disabled={!allDone || quizResult?.passed}
            >
              <div className="md-quiz-row-icon">
                {quizResult?.passed ? <CheckCircle size={18} /> : <Star size={18} />}
              </div>
              <div>
                <p className="md-playlist-title">
                  {quizResult?.passed ? t.quizPassed : t.quiz}
                </p>
                {quizResult?.passed && (
                  <span className="md-playlist-dur">Score: {quizResult.score}%</span>
                )}
                {!allDone && (
                  <span className="md-playlist-dur">Complete all lessons first</span>
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
            </button>
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
                <strong>{module.languageCount} languages</strong>
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
          quizResult={quizResult}
          lang={lang}
          onClose={() => setShowCert(false)}
        />
      )}
    </div>
  );
};

export default ModuleDetail;
