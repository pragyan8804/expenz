//https://tailwindui.com/components/marketing/sections/feature-sections

import { BarChart, CreditCard } from 'lucide-react'

export default function Features() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
          <div className="lg:pr-8 lg:pt-4 flex flex-col">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Organize your finances
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Seamless financial management
              </p>
              <p className="mt-6 text-md leading-8 text-gray-600">
                With Expenz, track your expenses, manage investments, and
                monitor your income effortlessly. Our simple yet powerful
                interface ensures you have all the tools you need to stay on top
                of your finances.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <BarChart className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                    Visualize your finances
                  </dt>{' '}
                  <dd className="inline">
                    Gain insights into your spending habits with detailed charts
                    and graphs, making budgeting easier than ever.
                  </dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <CreditCard className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                    Secure and convenient
                  </dt>{' '}
                  <dd className="inline">
                    Your financial data is stored securely, and you can manage
                    your expenses with peace of mind, knowing your data is safe.
                  </dd>
                </div>
                {/* <div className="relative pl-9">
                  <dt className="inline font-semibold text-gray-900">
                    <Database className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                    Automatic backups
                  </dt>{' '}
                  <dd className="inline">
                    All your transactions and financial data are automatically
                    backed up, so you never lose any important information.
                  </dd>
                </div> */}
              </dl>
            </div>
          </div>
          <img
            src="/public/dashboardScreenshot.png"
            alt="Dashboard screenshot"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width="2432"
            height="1442"
          />
        </div>
      </div>
    </div>
  )
}
