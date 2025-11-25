'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  points: number;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  class: {
    subject: {
      name: string;
    };
  };
  questions: Question[];
  totalPoints: number;
  dueDate: Date;
}

export default function SubmitAssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    fetchAssignment();
  }, [params.id]);

  useEffect(() => {
    if (assignment) {
      const interval = setInterval(() => {
        const now = new Date();
        const due = new Date(assignment.dueDate);
        const diff = due.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining('Overdue');
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeRemaining(`${days} day${days > 1 ? 's' : ''} ${hours}h ${minutes}m`);
          } else if (hours > 0) {
            setTimeRemaining(`${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`);
          } else {
            setTimeRemaining(`${minutes} minute${minutes > 1 ? 's' : ''}`);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [assignment]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/assignments/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAssignment(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignment) return;

    // Check if all questions are answered
    if (getAnsweredCount() < assignment.questions.length) {
      const confirm = window.confirm(
        `You have only answered ${getAnsweredCount()} out of ${assignment.questions.length} questions. Submit anyway?`
      );
      if (!confirm) return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([index, answer]) => ({
        questionIndex: parseInt(index),
        answer: answer
      }));

      const response = await fetch(`${apiBase}/assignments/${params.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: formattedAnswers
        })
      });

      if (response.ok) {
        alert('Assignment submitted successfully!');
        router.push('/student/dashboard');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit assignment');
      }
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      alert(error.message || 'Failed to submit assignment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-2xl text-maroon">Loading assignment...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-maroon mb-4">Assignment not found</p>
          <Link href="/student/dashboard">
            <button className="bg-maroon text-white px-6 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Link href="/student/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-gold mt-1">{assignment.class.subject.name}</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-8">
        {/* Assignment Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-maroon">Assignment Details</h2>
              <p className="text-gray-700 mt-2">{assignment.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-maroon">{assignment.totalPoints}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(assignment.dueDate).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Remaining</p>
              <p className={`font-semibold ${
                isOverdue ? 'text-red-600' : timeRemaining.includes('minute') ? 'text-red-600' : 'text-green-600'
              }`}>
                {timeRemaining}
              </p>
            </div>
          </div>

          {isOverdue && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
              ⚠️ This assignment is overdue. Late submissions may receive reduced points.
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Progress: {getAnsweredCount()} of {assignment.questions.length} questions answered
            </p>
            <p className="text-sm text-gray-600">
              {((getAnsweredCount() / assignment.questions.length) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(getAnsweredCount() / assignment.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 mb-8">
            {assignment.questions.map((question, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-maroon">
                    Question {idx + 1}
                  </h3>
                  <span className="bg-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {question.points} points
                  </span>
                </div>

                <p className="text-gray-800 mb-4 text-lg">{question.question}</p>

                {/* Multiple Choice */}
                {question.type === 'multiple_choice' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <label 
                        key={optIdx}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[idx] === option 
                            ? 'border-maroon bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={option}
                          checked={answers[idx] === option}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          className="mr-3 w-5 h-5"
                        />
                        <span className="text-gray-800">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {question.type === 'true_false' && (
                  <div className="space-y-2">
                    {['True', 'False'].map((option) => (
                      <label 
                        key={option}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          answers[idx] === option 
                            ? 'border-maroon bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={option}
                          checked={answers[idx] === option}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          className="mr-3 w-5 h-5"
                        />
                        <span className="text-gray-800">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Short Answer */}
                {question.type === 'short_answer' && (
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="Type your answer here..."
                  />
                )}

                {/* Essay */}
                {question.type === 'essay' && (
                  <textarea
                    rows={6}
                    value={answers[idx] || ''}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="Type your essay answer here..."
                  />
                )}

                {answers[idx] && (
                  <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
                    <span>✓</span>
                    <span>Answer saved</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-maroon mb-2">Ready to Submit?</h3>
              <p className="text-gray-700">
                You have answered <span className="font-bold">{getAnsweredCount()}</span> out of{' '}
                <span className="font-bold">{assignment.questions.length}</span> questions.
              </p>
              {getAnsweredCount() < assignment.questions.length && (
                <p className="text-red-600 text-sm mt-2">
                  ⚠️ You haven't answered all questions
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || getAnsweredCount() === 0}
                className="flex-1 bg-green-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
              <Link href="/student/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full bg-gray-300 text-gray-700 py-4 rounded-lg text-lg font-bold hover:bg-gray-400 transition-colors"
                >
                  Save Draft & Exit
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
