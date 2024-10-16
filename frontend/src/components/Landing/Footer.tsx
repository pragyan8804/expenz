import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 text-gray-700 py-4 rounded-xl">
      <div className="container mx-auto flex flex-col md:flex-row justify-between md:items-center gap-6 px-6">
        <div className="flex items-center space-x-3">
          <img src="/public/logo.png" alt="Expenz Logo" className="w-10 h-10" />
          <span className="text-xl font-semibold">Expenz</span>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-left">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://pragyan8804.vercel.app"
            className="hover:text-gray-900"
          >
            About Me
          </a>
          <a
            href="#features"
            className="hover:text-gray-900"
            onClick={(e) => {
              e.preventDefault() // Prevent default anchor behavior
              document
                .getElementById('features')
                ?.scrollIntoView({ behavior: 'smooth' }) // Smooth scroll to features section
            }}
          >
            Features
          </a>
        </div>

        <a
          href="https://github.com/pragyan8804/expenz"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 flex items-center space-x-5"
        >
          <Github size={24} />
          GitHub
        </a>
      </div>
    </footer>
  )
}
