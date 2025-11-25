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
  mySubmission?: Submission;
}

export default function StudentAssignmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignment();
  }, [params.id]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/assignments/${params.id}/my-submission`, {
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

  const getQuestionResult = (questionIndex: number): { correct: boolean; studentAnswer: string } => {
    const question = assignment?.questions[questionIndex];
    const answer = assignment?.mySubmission?.answers.find(a => a.questionIndex === questionIndex);
    
    return {
      correct: question?.correctAnswer ? answer?.answer === question.correctAnswer : false,
      studentAnswer: answer?.answer || 'No answer provided'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-2xl text-maroon">Loading...</div>
      </div>
    );
  }

  if (!assignment || !assignment.mySubmission) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-maroon mb-4">Assignment or submission not found</p>
          <Link href="/student/dashboard">
            <button className="bg-maroon text-white px-6 py-2 rounded-lg">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isGraded = assignment.mySubmission.score !== undefined;
  const percentage = isGraded 
    ? (assignment.mySubmission.score! / assignment.totalPoints) * 100 
    : 0;

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
        {/* Grade Card */}
        {isGraded ? (
          <div className={`rounded-lg shadow-lg p-8 mb-8 ${
            percentage >= 70 
              ? 'bg-gradient-to-r from-green-600 to-green-700' 
              : percentage >= 50 
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-700'
              : 'bg-gradient-to-r from-red-600 to-red-700'
          } text-white`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Your Score</p>
                <p className="text-6xl font-bold mt-2">
                  {assignment.mySubmission.score}/{assignment.totalPoints}
                </p>
                <p className="text-2xl mt-2">{percentage.toFixed(1)}%</p>
                <p className="text-sm mt-4 opacity-90">
                  Graded on: {new Date(assignment.mySubmission.gradedAt!).toLocaleString()}
                </p>
              </div>
              <div className="text-8xl opacity-75">
                {percentage >= 90 ? '🌟' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-300 text-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏳</span>
              <div>
                <p className="font-semibold text-lg">Awaiting Grade</p>
                <p className="text-sm">Your submission is being reviewed by your tutor.</p>
                <p className="text-xs mt-1">
                  Submitted: {new Date(assignment.mySubmission.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tutor Feedback */}
        {assignment.mySubmission.feedback && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-maroon mb-3">Tutor Feedback</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-800 leading-relaxed">{assignment.mySubmission.feedback}</p>
            </div>
          </div>
        )}

        {/* Questions Review */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-maroon mb-6">Review Your Answers</h2>
          
          <div className="space-y-6">
            {assignment.questions.map((question, idx) => {
              const result = getQuestionResult(idx);
              const isAutoGraded = question.correctAnswer !== undefined;
              const isCorrect = result.correct;

              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Question {idx + 1} ({question.points} points)
                    </h3>
                    {isGraded && isAutoGraded && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? `✓ Correct (+${question.points})` : '✗ Incorrect (0)'}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{question.question}</p>

                  {/* Show options for multiple choice */}
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

                  {/* Your Answer */}
                  <div className={`p-4 rounded-lg mb-2 ${
                    isGraded && isAutoGraded
                      ? isCorrect 
                        ? 'bg-green-50 border-2 border-green-300'
                        : 'bg-red-50 border-2 border-red-300'
                      : 'bg-blue-50 border-2 border-blue-300'
                  }`}>
                    <p className="text-sm font-semibold mb-1">Your Answer:</p>
                    <p className="font-medium">{result.studentAnswer}</p>
                  </div>

                  {/* Correct Answer (if available and wrong) */}
                  {question.correctAnswer && (!isCorrect || !isGraded) && (
                    <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-green-900 mb-1">Correct Answer:</p>
                      <p className="text-green-800 font-medium">{question.correctAnswer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignment Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-maroon mb-4">Assignment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Subject</p>
              <p className="font-semibold text-gray-800">{assignment.class.subject.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="font-semibold text-gray-800">{assignment.totalPoints}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(assignment.dueDate).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="font-semibold text-gray-800">
                {new Date(assignment.mySubmission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
