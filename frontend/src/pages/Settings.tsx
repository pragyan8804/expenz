import React from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sun, Moon } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useTheme } from '@/components/ThemeContext'
import {Sidebar} from '@/components/Sidebar'

export interface User {
  username: string
  email: string
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex dark:bg-black dark:text-white h-screen overflow-y-auto">
      <Sidebar />
      <div className="flex-1 max-w-2xl mx-auto p-6 ">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

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
                {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Settings
