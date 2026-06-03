export default function Navbar() {
  return (
    <div className="w-full border-b bg-black text-white px-8 py-5 flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        PrepPilot AI
      </h1>

      <button className="bg-white text-black px-4 py-2 rounded-xl">
        Login
      </button>

    </div>
  );
}