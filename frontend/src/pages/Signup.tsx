import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { signup } from '@/services/api'
import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/context/AuthContext'

export function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login: loginUser } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const response = await signup({ name, username, password })
      // Store both userId and token
      loginUser(response.token, response.userId)
      toast({
        title: 'Account created',
        description: "You've successfully signed up!",
      })
      navigate('/dashboard')
    } catch (error) {
      setError('Signup failed. Please try again.')
      toast({
        title: 'User already exists',
        description: 'Please try logging in.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="absolute top-0 z-[-2] w-screen transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]">
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account by filling out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <p className="text-sm text-center">
              <span className="text-gray-500">Already have an account? </span>
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
        <Toaster />
      </div>
    </div>
  )
}
