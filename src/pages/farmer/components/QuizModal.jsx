import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Star, RotateCcw, Trophy, ChevronRight } from 'lucide-react';
import './QuizModal.css';

const ui = {
  en: {
    title: 'Module Quiz',
    subtitle: 'Answer all questions to complete this module.',
    check: 'Check Answer',
    next: 'Next Question',
    finish: 'See My Results',
    retry: 'Try Again',
    score: 'Your Score',
    passed: 'Passed!',
    failed: 'Not Passed',
    passMsg: 'Congratulations! You\'ve passed the quiz and earned your certificate.',
    failMsg: 'You need 60% or more to pass. Review the lessons and try again.',
    correct: 'Correct!',
    wrong: 'Incorrect',
    question: 'Question',
    of: 'of',
  },
  hi: {
    title: 'मॉड्यूल क्विज',
    subtitle: 'इस मॉड्यूल को पूरा करने के लिए सभी प्रश्नों के उत्तर दें।',
    check: 'उत्तर जांचें',
    next: 'अगला प्रश्न',
    finish: 'मेरे परिणाम देखें',
    retry: 'फिर से कोशिश करें',
    score: 'आपका स्कोर',
    passed: 'पास!',
    failed: 'पास नहीं',
    passMsg: 'बधाई! आपने क्विज पास कर लिया और प्रमाणपत्र अर्जित कर लिया।',
    failMsg: 'पास करने के लिए 60% या अधिक की आवश्यकता है। पाठ देखें और फिर से प्रयास करें।',
    correct: 'सही!',
    wrong: 'गलत',
    question: 'प्रश्न',
    of: 'में से',
  },
  gu: {
    title: 'મૉડ્યૂલ ક્વિઝ',
    subtitle: 'આ મૉડ્યૂલ પૂર્ણ કરવા માટે બધા પ્રશ્નોના જવાબ આપો.',
    check: 'જવાબ તપાસો',
    next: 'આગળનો પ્રશ્ન',
    finish: 'મારા પરિણામ જુઓ',
    retry: 'ફરીથી પ્રયાસ કરો',
    score: 'તમારો સ્કોર',
    passed: 'પાસ!',
    failed: 'પાસ નહીં',
    passMsg: 'અભિનંદન! તમે ક્વિઝ પાસ કર્યું અને પ્રમાણ પત્ર મળ્યું.',
    failMsg: '60% અથવા વધુ જોઈએ. પાઠ જુઓ અને ફરી પ્રયાસ કરો.',
    correct: 'સાચું!',
    wrong: 'ખોટું',
    question: 'પ્રશ્ન',
    of: 'માંથી',
  },
};

const PASS_SCORE = 60;

const QuizModal = ({ module, lang = 'en', onClose, onComplete }) => {
  const t = ui[lang] || ui.en;
  const questions = module.quiz;

  const [step, setStep] = useState('quiz'); // 'quiz' | 'result'
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);

  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  const handleSelect = (idx) => {
    if (checked) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
  };

  const handleNext = () => {
    const newAnswers = [...answers, { selected, correct: q.correct, isCorrect: selected === q.correct }];
    setAnswers(newAnswers);
    setSelected(null);
    setChecked(false);

    if (isLast) {
      setStep('result');
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleRetry = () => {
    setStep('quiz');
    setCurrentQ(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
  };

  const correctCount = answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= PASS_SCORE;

  const progressPct = ((currentQ) / questions.length) * 100;

  return (
    <div className="quiz-backdrop" onClick={onClose}>
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="quiz-header">
          <div>
            <h2 className="quiz-title">{t.title}</h2>
            <p className="quiz-subtitle">
              {module.title}
            </p>
          </div>
          <button className="quiz-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {step === 'quiz' && (
          <>
            {/* Progress Bar */}
            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((currentQ + (checked ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>

            <div className="quiz-body">
              <div className="quiz-q-meta">
                <span className="quiz-q-num">{t.question} {currentQ + 1} {t.of} {questions.length}</span>
                {checked && (
                  <span className={`quiz-feedback-badge ${selected === q.correct ? 'correct' : 'wrong'}`}>
                    {selected === q.correct ? (
                      <><CheckCircle2 size={14} /> {t.correct}</>
                    ) : (
                      <><XCircle size={14} /> {t.wrong}</>
                    )}
                  </span>
                )}
              </div>

              <p className="quiz-question">
                {lang === 'hi' ? q.questionHi : q.question}
              </p>

              <div className="quiz-options">
                {q.options.map((opt, idx) => {
                  let cls = 'quiz-opt';
                  if (checked) {
                    if (idx === q.correct) cls += ' opt-correct';
                    else if (idx === selected && selected !== q.correct) cls += ' opt-wrong';
                  } else if (idx === selected) {
                    cls += ' opt-selected';
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      onClick={() => handleSelect(idx)}
                      disabled={checked}
                    >
                      <span className="quiz-opt-letter">{String.fromCharCode(65 + idx)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {checked && (
                <div className="quiz-explanation">
                  <strong>{selected === q.correct ? '✓' : '→'} Explanation:</strong>{' '}
                  {q.explanation}
                </div>
              )}
            </div>

            <div className="quiz-footer">
              {!checked ? (
                <button
                  className="quiz-action-btn quiz-check-btn"
                  onClick={handleCheck}
                  disabled={selected === null}
                >
                  {t.check}
                </button>
              ) : (
                <button
                  className="quiz-action-btn quiz-next-btn"
                  onClick={handleNext}
                >
                  {isLast ? t.finish : t.next}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </>
        )}

        {step === 'result' && (
          <div className="quiz-result">
            <div className={`quiz-result-icon ${passed ? 'passed' : 'failed'}`}>
              {passed ? <Trophy size={40} /> : <RotateCcw size={40} />}
            </div>
            <h2 className={`quiz-result-title ${passed ? 'passed' : 'failed'}`}>
              {passed ? t.passed : t.failed}
            </h2>
            <div className="quiz-score-ring">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(11,18,13,0.08)" strokeWidth="8" />
                <circle
                  cx="55" cy="55" r="46" fill="none"
                  stroke={passed ? '#DDFF86' : '#FFAAA4'}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="quiz-score-label">
                <span className="quiz-score-num">{score}%</span>
                <span className="quiz-score-sub">{t.score}</span>
              </div>
            </div>
            <p className="quiz-result-msg">
              {passed ? t.passMsg : t.failMsg}
            </p>

            {/* Per-question breakdown */}
            <div className="quiz-breakdown">
              {questions.map((qq, idx) => (
                <div key={idx} className={`quiz-break-row ${answers[idx]?.isCorrect ? 'break-correct' : 'break-wrong'}`}>
                  <span>{answers[idx]?.isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}</span>
                  <span className="quiz-break-q">{lang === 'hi' ? qq.questionHi : qq.question}</span>
                </div>
              ))}
            </div>

            <div className="quiz-result-actions">
              <button className="quiz-retry-btn" onClick={handleRetry}>
                <RotateCcw size={16} /> {t.retry}
              </button>
              {passed && (
                <button
                  className="quiz-cert-btn"
                  onClick={() => { onComplete(score, true); }}
                >
                  <Trophy size={16} /> Get Certificate
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
