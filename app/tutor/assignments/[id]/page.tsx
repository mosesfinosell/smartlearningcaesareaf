'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  question: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

interface Submission {
  _id: string;
  student: {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  answers: Array<{
    questionIndex: number;
    answer: string;
  }>;
  score?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
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
  submissions: Submission[];
}

export default function GradeAssignmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grading, setGrading] = useState<{[key: number]: number}>({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [params.id]);

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

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || '');
    
    // Initialize grading for manual questions
    const initialGrading: {[key: number]: number} = {};
    assignment?.questions.forEach((q, idx) => {
      if (q.type === 'short_answer' || q.type === 'essay') {
        const studentAnswer = submission.answers.find(a => a.questionIndex === idx);
        if (studentAnswer) {
          initialGrading[idx] = 0;
        }
      }
    });
    setGrading(initialGrading);
  };

  const calculateAutoScore = (submission: Submission): number => {
    let score = 0;
    
    assignment?.questions.forEach((question, idx) => {
      const studentAnswer = submission.answers.find(a => a.questionIndex === idx);
      
      if (studentAnswer && question.correctAnswer) {
        // Auto-gradeable questions
        if (studentAnswer.answer === question.correctAnswer) {
          score += question.points;
        }
      }
    });

    return score;
  };

  const getTotalScore = (): number => {
    if (!selectedSubmission || !assignment) return 0;
    
    let total = calculateAutoScore(selectedSubmission);
    
    // Add manual grades
    Object.values(grading).forEach(points => {
      total += points;
    });
    
    return total;
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission || !assignment) return;
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${apiBase}/assignments/${params.id}/submissions/${selectedSubmission._id}/grade`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            score: getTotalScore(),
            feedback: feedback
          })
        }
      );

      if (response.ok) {
        alert('Grade submitted successfully!');
        fetchAssignment();
        setSelectedSubmission(null);
      } else {
        throw new Error('Failed to submit grade');
      }
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-2xl text-maroon">Loading...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-maroon mb-4">Assignment not found</p>
          <Link href="/tutor/dashboard">
            <button className="bg-maroon text-white px-6 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const gradedCount = assignment.submissions.filter(s => s.score !== undefined).length;
  const pendingCount = assignment.submissions.length - gradedCount;

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Link href="/tutor/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-gold mt-1">{assignment.class.subject.name}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Total Submissions</p>
            <p className="text-3xl font-bold text-maroon mt-1">{assignment.submissions.length}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Graded</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{gradedCount}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-3xl font-bold text-gold mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <p className="text-sm text-gray-600">Total Points</p>
            <p className="text-3xl font-bold text-maroon mt-1">{assignment.totalPoints}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-maroon mb-4">
                Submissions ({assignment.submissions.length})
              </h2>

              {assignment.submissions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No submissions yet</p>
              ) : (
                <div className="space-y-3">
                  {assignment.submissions.map((submission) => (
                    <button
                      key={submission._id}
                      onClick={() => handleSelectSubmission(submission)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedSubmission?._id === submission._id
                          ? 'border-maroon bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-gray-800">
                        {submission.student.userId.firstName} {submission.student.userId.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      {submission.score !== undefined ? (
                        <p className="text-sm font-semibold text-green-600 mt-2">
                          ✓ Graded: {submission.score}/{assignment.totalPoints}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-gold mt-2">
                          ⏳ Pending Review
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grading Interface */}
          <div className="lg:col-span-2">
            {!selectedSubmission ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl text-gray-600">Select a submission to grade</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-maroon">
                      {selectedSubmission.student.userId.firstName} {selectedSubmission.student.userId.lastName}
                    </h2>
                    <p className="text-gray-600">{selectedSubmission.student.userId.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedSubmission.score !== undefined && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Previous Grade</p>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedSubmission.score}/{assignment.totalPoints}
                      </p>
                    </div>
                  )}
                </div>

                {/* Questions and Answers */}
                <div className="space-y-6 mb-6">
                  {assignment.questions.map((question, idx) => {
                    const studentAnswer = selectedSubmission.answers.find(a => a.questionIndex === idx);
                    const isCorrect = studentAnswer?.answer === question.correctAnswer;
                    const isAutoGraded = question.correctAnswer !== undefined;

                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-800">
                            Question {idx + 1} ({question.points} points)
                          </h3>
                          {isAutoGraded && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isCorrect 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isCorrect ? `✓ Correct (+${question.points})` : '✗ Incorrect (0)'}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-700 mb-3">{question.question}</p>

                        {question.options && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm font-semibold text-gray-600 mb-2">Options:</p>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {question.options.map((opt, optIdx) => (
                                <li key={optIdx}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="bg-blue-50 p-3 rounded-lg mb-2">
                          <p className="text-sm font-semibold text-blue-900">Student Answer:</p>
                          <p className="text-blue-800 mt-1">{studentAnswer?.answer || 'No answer provided'}</p>
                        </div>

                        {question.correctAnswer && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-semibold text-green-900">Correct Answer:</p>
                            <p className="text-green-800 mt-1">{question.correctAnswer}</p>
                          </div>
                        )}

                        {/* Manual Grading for Essay/Short Answer */}
                        {!isAutoGraded && studentAnswer && (
                          <div className="mt-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Award Points (0-{question.points})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={question.points}
                              value={grading[idx] || 0}
                              onChange={(e) => setGrading({
                                ...grading,
                                [idx]: Math.min(question.points, Math.max(0, parseInt(e.target.value) || 0))
                              })}
                              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Score Summary */}
                <div className="bg-gradient-to-r from-maroon to-red-900 text-white rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-90">Total Score</p>
                      <p className="text-4xl font-bold mt-1">
                        {getTotalScore()}/{assignment.totalPoints}
                      </p>
                      <p className="text-sm mt-2">
                        Percentage: {((getTotalScore() / assignment.totalPoints) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-6xl opacity-75">
                      {getTotalScore() / assignment.totalPoints >= 0.7 ? '🎉' : '📊'}
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feedback for Student
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                    placeholder="Provide constructive feedback..."
                  />
                </div>

                {/* Submit Grade */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmitGrade}
                    disabled={submitting}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Grade'}
                  </button>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
