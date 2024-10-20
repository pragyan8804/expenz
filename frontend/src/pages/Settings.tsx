import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Sun, Moon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useTheme } from '@/components/ThemeContext'
import { Sidebar } from '@/components/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export interface User {
  username: string
  name: string
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token)
        const userId = decodedToken.userId

        // Fetch user details from the backend
        const fetchUserDetails = async () => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/users/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            setUser(response.data) // Set user details from response
          } catch (error) {
            console.error('Failed to fetch user details:', error)
          }
        }

        fetchUserDetails()
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    } else {
      console.warn('No token found in local storage')
    }
  }, [])

  return (
    <div className="flex dark:bg-black dark:text-white h-screen overflow-y-auto">
      <Sidebar />
      <div className="flex-1 max-w-2xl mx-auto p-6 ">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {isAuthenticated && user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <Label>Username: {user.username}</Label>
              </div>
              <div className="mb-2">
                <Label>Name: {user.name}</Label>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>Theme</Label>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
