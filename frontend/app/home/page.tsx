"use client";

import NavLogo from "../../components/NavLogo_Authenticated"

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const handleRedirect = () => {
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/signup")
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/get_user", {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error("Not Authenticated");
        }

        const data = await response.json();
        if(!data.user) {
          throw new Error("No User Data");
        }
        setIsLoading(false);
      } catch (error) {
        setError("Authentication required. Redirecting ...");
        router.push("/")
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="bg-white p-1 rounded">
              <img
                src="/images/medmemo_logo.png"
                alt="MedMemo Logo"
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-5xl font-bold font-mono">MedMemo</h1>
          </div>
          {/* Sign In and Sign Up Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleLogin}
              className="bg-white text-[#D93D3D] px-4 py-2 text-lg rounded-lg font-bold cursor-pointer hover:bg-gray-200 transition"
              >Sign In
            </button>
            <button
              onClick={handleSignUp}
              className="bg-white text-[#D93D3D] px-4 py-2 text-lg rounded-lg font-bold cursor-pointer hover:bg-gray-200 transition"
              >Sign Up
            </button>
          </div>
        </div>
      </nav>
        {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black">
            Loading ...
          </h1>
        </div>
      </main>
    </div>
    )
  }

  const defaultButtonStyle =
  "block px-4 py-2 text-gray-700 hover:bg-gray-200 transition";

  const handleDownload = async () => {
    const visitId = 1; // Download summary based on visitID
    try {
      // download.py runs on port 5000
        const response = await fetch(`http://127.0.0.1:8080/download/${visitId}`);

        if (!response.ok) {
            throw new Error("Download failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `summary_${visitId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error:", error);
    }
};


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <nav style={{ backgroundColor: "#CF4051" }} className="text-white p-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <div className="bg-white p-1 rounded">
              <img
                src="/images/medmemo_logo.png"
                alt="MedMemo Logo"
                className="h-20 w-20"
              />
            </div>
            <h1 className="text-5xl font-bold font-mono">MedMemo</h1>
          </div>
          {/* Dropdown Menu */}
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-white text-[#D93D3D] font-bold rounded-lg hover:bg-gray-200 transition">
              Menu ▼
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white font-bold rounded-md shadow-lg">
                <a href="/" className={defaultButtonStyle}>Home</a>
                <a href="/about" className={defaultButtonStyle}>About</a>
                <a href="/account" className={defaultButtonStyle}>Account</a>
                <button onClick={handleDownload} className={defaultButtonStyle}>
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-grow">
        {/* Sidebar */}
        <div
          className="w-64 text-white p-4 overflow-y-auto h-screen"
          style={{ backgroundColor: "#E0DFDF" }}
        >
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            Sidebar Title
          </h2>
          <p className="mb-4 text-center text-gray-600">
            This is a scrollable sidebar.
          </p>
        </div>
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black">
              Welcome to the Homepage
            </h1>
            <p className="mt-2 text-gray-600">
              This is a simple homepage with a sidebar beside the navbar.
            </p>
          </div>
        </main>
      </div>

    </div>
  );
}