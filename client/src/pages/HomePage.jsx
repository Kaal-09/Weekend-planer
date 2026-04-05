import Navbar from '../components/Navbar'
import MapShower from '../components/MapShower'
import Sidebar from '../components/LeftSideBar'
import ChatSidebar from '../components/RightSideBar'

function HomePage() {
  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar />

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 lg:p-10 ml-72 transition-all duration-500">
          <div className="w-full max-w-6xl mb-4 flex justify-between items-end px-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trip Explorer</h1>
              <p className="text-sm text-gray-500 font-medium">Select a destination to start routing</p>
            </div>
          </div>

          <div className="relative w-full h-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
            <MapShower />
          </div>
        </main>

        <ChatSidebar />
      </div>
    </div>
  )
}

export default HomePage