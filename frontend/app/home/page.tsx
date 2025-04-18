"use client";

export default function Home() {

  return (
    <div className="flex flex-grow">

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Welcome to the Homepage
          </h1>
          <p className="mt-2">
            This is a simple homepage with a sidebar beside the navbar.
          </p>
        </div>
      </main>

    </div>
  );
}