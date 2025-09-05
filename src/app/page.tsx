import Image from "next/image";
import Link from "next/link";
import { StarsBackground } from "@/components/star-background";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Full-screen stars background */}
      <StarsBackground className="fixed inset-0 z-0" />
      
      {/* Main content with proper z-index layering */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-8 sm:space-y-12">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white drop-shadow-2xl">
            <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              OpenVerse:
            </span>
            <span className="block mt-2 sm:mt-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Open like Space
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Open-Source Version of Paraverse
          </h2>
          
          {/* Aral Navigation Button */}
          <div className="pt-8 sm:pt-12">
            <Link 
              href="/aral"
              className="group relative inline-block transition-transform duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/50 group-hover:border-blue-500/50 transition-all duration-300">
                <Image
                  src="/Aral.png"
                  alt="Aral - Enter the OpenVerse"
                  width={300}
                  height={200}
                  className="rounded-xl object-cover w-full h-auto max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white font-semibold text-lg drop-shadow-lg">
                    Enter Aral →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Additional atmospheric elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none"></div>
      </div>
    </div>
  );
}
