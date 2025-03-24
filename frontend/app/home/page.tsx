import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav style={{ backgroundColor: '#d93d3d' }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="bg-white p-1 rounded">
              <img src="/images/medmemo_logo.png" alt="MedMemo Logo" className="h-20 w-20" />
            </div>
            <h1 className="text-5xl font-bold font-mono">MedMemo</h1>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-5 font-bold text-xl font-mono">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
      </nav>
  
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-64 text-white p-4 overflow-y-auto h-screen" style={{ backgroundColor: '#E0DFDF' }}>
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Sidebar Title</h2>
          <p className="mb-4 text-center text-gray-600">This is a scrollable sidebar.</p>
        </div>
    
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">Welcome to the Homepage</h1>
            <p className="mt-2 text-gray-600">This is a simple homepage with a sidebar beside the navbar.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
