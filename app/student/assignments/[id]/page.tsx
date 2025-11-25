'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';

export default function StudentAssignmentDetails() {
  const router = useRouter();
  const params = useParams();
  const assignmentId = params.id;
  
  const [assignment, setAssignment] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const res = await api.get(`/assignments/${assignmentId}`);
      const data = res.data.data;
      setAssignment(data);
      
      // Check if student has already submitted
      const userRes = await api.get('/auth/me');
      const userData = userRes.data.data.user || userRes.data.data;
      const userId = userData.id || userData._id;
      const studentRes = await api.get(`/students/user/${userId}`);
      const studentData = studentRes.data.data;
      const studentId = studentData.id || studentData._id;
      
      const existing = data.submissions?.find((s: any) => s.studentId === studentId);
      if (existing) {
        setSubmission(existing);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      const userRes = await api.get('/auth/me');
      const userData = userRes.data.data.user || userRes.data.data;
      const userId = userData.id || userData._id;
      const studentRes = await api.get(`/students/user/${userId}`);
      const studentData = studentRes.data.data;
      const studentId = studentData.id || studentData._id;

      const submissionData = {
        studentId,
        answers: Object.keys(answers).map(questionId => ({
          questionId,
          answer: answers[questionId],
        })),
      };

      await api.post(`/assignments/${assignmentId}/submit`, submissionData);
      
      alert('Assignment submitted successfully!');
      fetchAssignment();
    } catch (error: any) {
      console.error('Error submitting:', error);
      alert(error.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A05C]"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="text-gray-600">Assignment not found</p>
      </div>
    );
  }

  const isLate = new Date() > new Date(assignment.dueDate);
  const isSubmitted = submission && submission.status !== 'in-progress';
  const isGraded = submission?.status === 'graded';

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Assignments
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
              <p className="text-gray-600 mt-1">{assignment.subject?.name} • {assignment.class?.classCode}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isGraded
                ? 'bg-green-100 text-green-800'
                : isSubmitted
                ? 'bg-blue-100 text-blue-800'
                : isLate
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isGraded ? 'Graded' : isSubmitted ? 'Submitted' : isLate ? 'Late' : 'Pending'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium text-gray-900 capitalize">{assignment.type}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Marks</p>
              <p className="font-medium text-gray-900">{assignment.totalMarks}</p>
            </div>
            <div>
              <p className="text-gray-600">Due Date</p>
              <p className="font-medium text-gray-900">
                {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {assignment.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Instructions</p>
              <p className="text-gray-900 mt-1">{assignment.description}</p>
            </div>
          )}
        </div>

        {/* Grade Display (if graded) */}
        {isGraded && submission && (
          <div className="bg-gradient-to-br from-[#C9A05C] to-[#8B1538] rounded-xl shadow-lg p-6 mb-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Your Grade</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm opacity-90">Score</p>
                <p className="text-3xl font-bold">{submission.score}/{assignment.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Percentage</p>
                <p className="text-3xl font-bold">{submission.percentage?.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Grade</p>
                <p className="text-3xl font-bold">{submission.grade}</p>
              </div>
            </div>
            {submission.feedback && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm opacity-90">Tutor Feedback</p>
                <p className="mt-1">{submission.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions</h2>
          
          <div className="space-y-6">
            {assignment.questions?.map((question: any, index: number) => (
              <div key={question._id || index} className="pb-6 border-b border-gray-200 last:border-0">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-[#C9A05C] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{question.questionText}</p>
                    <p className="text-sm text-gray-600 mt-1">Marks: {question.marks}</p>
                  </div>
                </div>

                {/* Multiple Choice */}
                {question.questionType === 'multiple-choice' && (
                  <div className="ml-11 space-y-2">
                    {question.options?.map((option: string, i: number) => (
                      <label
                        key={i}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition cursor-pointer ${
                          isSubmitted
                            ? option === question.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : submission?.answers?.find((a: any) => a.questionId === question._id)?.answer === option
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                            : answers[question._id] === option
                            ? 'border-[#C9A05C] bg-[#C9A05C]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          value={option}
                          checked={answers[question._id] === option || submission?.answers?.find((a: any) => a.questionId === question._id)?.answer === option}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          disabled={isSubmitted}
                          className="text-[#C9A05C]"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {question.questionType === 'true-false' && (
                  <div className="ml-11 space-y-2">
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition cursor-pointer ${
                          isSubmitted
                            ? option === question.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : submission?.answers?.find((a: any) => a.questionId === question._id)?.answer === option
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200'
                            : answers[question._id] === option
                            ? 'border-[#C9A05C] bg-[#C9A05C]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question._id}
                          value={option}
                          checked={answers[question._id] === option || submission?.answers?.find((a: any) => a.questionId === question._id)?.answer === option}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          disabled={isSubmitted}
                          className="text-[#C9A05C]"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Short Answer / Essay */}
                {(question.questionType === 'short-answer' || question.questionType === 'essay') && (
                  <div className="ml-11">
                    <textarea
                      value={answers[question._id] || submission?.answers?.find((a: any) => a.questionId === question._id)?.answer || ''}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      disabled={isSubmitted}
                      rows={question.questionType === 'essay' ? 6 : 3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A05C] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder={isSubmitted ? 'Your submitted answer' : 'Type your answer here...'}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Ready to submit? Make sure you've answered all questions.
                </p>
                {isLate && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ This assignment is past the due date. Late submissions may receive penalties.
                  </p>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-[#8B1538] text-white rounded-lg hover:bg-[#8B1538]/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
