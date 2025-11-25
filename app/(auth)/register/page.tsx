'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authAPI, handleApiError } from '@/lib/api'
import { Users, GraduationCap, BookOpen } from 'lucide-react'

type UserRole = 'parent' | 'student' | 'tutor' | null

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 'Nigeria',
  })

  const roles = [
    {
      value: 'parent',
      icon: <Users className="w-12 h-12 mb-4 text-brand-gold" />,
      title: 'Parent/Guardian',
      description: 'Enroll and monitor your children',
    },
    {
      value: 'student',
      icon: <GraduationCap className="w-12 h-12 mb-4 text-brand-gold" />,
      title: 'Student',
      description: 'Start learning with expert tutors',
    },
    {
      value: 'tutor',
      icon: <BookOpen className="w-12 h-12 mb-4 text-brand-gold" />,
      title: 'Tutor',
      description: 'Teach students globally',
    },
  ]

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register({
        ...formData,
        role: selectedRole,
      })

      if (response.data.success) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.data.accessToken)
        localStorage.setItem('refreshToken', response.data.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))

        // Redirect based on role
        switch (selectedRole) {
          case 'parent':
            router.push('/parent/dashboard')
            break
          case 'student':
            router.push('/student/dashboard')
            break
          case 'tutor':
            router.push('/tutor/verification')
            break
          default:
            router.push('/dashboard')
        }
      }
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-brand-gold mb-2">
              CAESAREA SMART SCHOOL
            </h1>
          </Link>
          <p className="text-brand-warm-grey">
            Create your account and start learning
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-brand-gold text-white' : 'bg-gray-300'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-brand-gold' : 'bg-gray-300'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-brand-gold text-white' : 'bg-gray-300'
            }`}>
              2
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 ? 'Choose Your Role' : 'Create Your Account'}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? 'Select how you will be using Caesarea Smart School'
                : 'Fill in your details to complete registration'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              /* Role Selection */
              <div className="grid md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSelect(role.value as UserRole)}
                    className="p-6 border-2 border-brand-light-gold rounded-lg hover:border-brand-gold hover:shadow-lg transition-all text-center"
                  >
                    {role.icon}
                    <h3 className="font-semibold text-lg mb-2">{role.title}</h3>
                    <p className="text-sm text-brand-warm-grey">{role.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+234 XXX XXX XXXX"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-brand-gold focus:ring-brand-gold border-brand-light-gold rounded"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Link href="/terms" className="text-brand-gold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-brand-gold hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-brand-gold hover:underline font-semibold"
                  >
                    Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-brand-warm-grey hover:text-brand-gold transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
