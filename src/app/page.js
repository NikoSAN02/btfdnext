import Image from "next/image";
import HomePage from "./components/HomePage"; 
import Header from "./components/Header";

export default function Home() {
  return (
       <div className="h-screen flex flex-col bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500 overflow-hidden font-inter">
      <Header/>
      <main className="flex-grow flex items-center justify-center">
        <HomePage/>
      </main>
    </div>
  );
}
