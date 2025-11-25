'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Class {
  _id: string;
  subject: {
    name: string;
    level: string;
  };
}

interface Question {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState({
    classId: '',
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 100,
    questions: [] as Question[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${apiBase}/classes/tutor/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const rawClasses = data.data || data || [];
      const normalized = rawClasses.map((cls: any) => ({
        _id: cls._id,
        subject: {
          name: cls.subject?.name || cls.subjectId?.name || 'Subject',
          level: cls.subject?.level || cls.subjectId?.level || ''
        }
      }));
      setClasses(normalized);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      question: '',
      type: type,
      points: 10
    };

    if (type === 'multiple_choice') {
      newQuestion.options = ['', '', '', ''];
      newQuestion.correctAnswer = '';
    } else if (type === 'true_false') {
      newQuestion.options = ['True', 'False'];
      newQuestion.correctAnswer = '';
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    if (newQuestions[qIndex].options) {
      newQuestions[qIndex].options![optIndex] = value;
      setFormData({ ...formData, questions: newQuestions });
    }
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const calculateTotalPoints = () => {
    return formData.questions.reduce((sum, q) => sum + q.points, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiBase}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          totalPoints: calculateTotalPoints()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create assignment');
      }

      alert('Assignment created successfully!');
      router.push('/tutor/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-white py-6 px-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Link href="/tutor/dashboard" className="text-gold hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Create New Assignment</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Class *
              </label>
              <select
                required
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              >
                <option value="">Choose a class</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.subject.name} - {classItem.subject.level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="e.g., Chapter 5 Quiz - Photosynthesis"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                placeholder="Provide instructions for students..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              />
            </div>

            {/* Questions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-maroon">
                  Questions ({formData.questions.length})
                  <span className="ml-3 text-sm text-gray-600">
                    Total: {calculateTotalPoints()} points
                  </span>
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addQuestion('multiple_choice')}
                    className="text-sm bg-gold text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    + Multiple Choice
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuestion('true_false')}
                    className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                  >
                    + True/False
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuestion('short_answer')}
                    className="text-sm bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
                  >
                    + Short Answer
                  </button>
                </div>
              </div>

              {formData.questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No questions added yet</p>
                  <p className="text-sm text-gray-400 mt-2">Click a button above to add questions</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-maroon text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Question {qIndex + 1} - {question.type.replace('_', ' ')}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Question Text *
                          </label>
                          <textarea
                            rows={2}
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                            placeholder="Enter your question..."
                          />
                        </div>

                        {question.type === 'multiple_choice' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Options
                            </label>
                            {question.options?.map((option, optIndex) => (
                              <input
                                key={optIndex}
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-maroon"
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              />
                            ))}
                            <select
                              value={question.correctAnswer || ''}
                              onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-maroon"
                            >
                              <option value="">Select correct answer</option>
                              {question.options?.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                  {option || `Option ${String.fromCharCode(65 + optIndex)}`}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {question.type === 'true_false' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Correct Answer
                            </label>
                            <select
                              value={question.correctAnswer || ''}
                              onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                            >
                              <option value="">Select correct answer</option>
                              <option value="True">True</option>
                              <option value="False">False</option>
                            </select>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={question.points}
                            onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-maroon text-white py-3 rounded-lg font-semibold hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Assignment...' : 'Create Assignment'}
              </button>
              <Link href="/tutor/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
