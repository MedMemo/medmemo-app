import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My Website</h1>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to the Homepage</h1>
        <p className="mt-2 text-gray-600">This is a simple homepage with a navbar.</p>
      </main>
    </div>
  );
}
