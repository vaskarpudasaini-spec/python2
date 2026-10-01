const stats = [
  {
    title: "Total Students",
    value: "842",
    description: "Across all classes",
  },
  {
    title: "Today's Attendance",
    value: "96.2%",
    description: "810 present today",
  },
  {
    title: "Fees Collected",
    value: "Rs. 8.4L",
    description: "This month",
  },
  {
    title: "New Inquiries",
    value: "23",
    description: "This month",
  },
];

const quickActions = [
  {
    title: "Add Student",
    description: "Register a new student",
  },
  {
    title: "Record Payment",
    description: "Add a fee payment",
  },
  {
    title: "Take Attendance",
    description: "Mark today's attendance",
  },
  {
    title: "New Inquiry",
    description: "Add admission inquiry",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-white lg:block">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold text-gray-900">
              SchoolOS
            </h1>
          </div>

          <nav className="p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Main
            </p>

            <div className="space-y-1">
              <button className="w-full rounded-xl bg-gray-100 px-3 py-2.5 text-left text-sm font-medium text-gray-900">
                🏠 Dashboard
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                👨‍🎓 Students
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                💰 Fees
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                📋 Attendance
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                📝 Academics
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                🎯 Admissions
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                📢 Communication
              </button>

              <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
                📊 Reports
              </button>
            </div>

            <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              System
            </p>

            <button className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50">
              ⚙️ Settings
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex-1">

          {/* Top bar */}
          <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div>
              <p className="text-sm text-gray-500">
                SchoolOS Nepal
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-lg border px-3 py-2 text-sm">
                नेपाली
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
                A
              </div>
            </div>
          </header>

          <div className="p-6 lg:p-8">

            {/* Welcome */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Good morning, Admin 👋
              </h2>

              <p className="mt-2 text-gray-500">
                Here's what's happening at your school today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Lower sections */}
            <div className="mt-8 grid gap-6 xl:grid-cols-2">

              {/* Quick Actions */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      className="rounded-xl border p-4 text-left hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">
                        {action.title}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {action.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Overview */}
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Today's Overview
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">
                      Absent students
                    </span>
                    <strong>32</strong>
                  </div>

                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">
                      Pending fee payments
                    </span>
                    <strong>117</strong>
                  </div>

                  <div className="flex justify-between border-b pb-4">
                    <span className="text-gray-600">
                      Admission follow-ups
                    </span>
                    <strong>8</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Important notices
                    </span>
                    <strong>4</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}