import bravoLogo from "@/assets/bravo-logo.png";
import aiPersonCover from "@/assets/ai-person-cover.jpg";

interface BookCoverProps {
  className?: string;
}

export function BookCover({ className = "" }: BookCoverProps) {
  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      {/* Book Cover */}
      <div className="relative bg-cover bg-center rounded-lg shadow-2xl overflow-hidden" style={{ backgroundImage: `url(${aiPersonCover})` }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        
        {/* Cover Content */}
        <div className="relative px-6 py-12 h-96 flex flex-col justify-between text-white">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <img 
                src={bravoLogo} 
                alt="Bravo AI Systems Logo" 
                className="w-24 h-24 object-contain drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-white text-2xl font-bold leading-tight drop-shadow-lg">
              Business Management
            </h1>
            <h2 className="text-blue-100 text-xl font-semibold drop-shadow-lg">
              AI Platform
            </h2>
            <h3 className="text-blue-200 text-lg drop-shadow-lg">
              for Home Services
            </h3>
          </div>
          
          {/* Bottom Accent */}
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-100 rounded-full drop-shadow-lg" />
          </div>
        </div>
      </div>
      
      {/* Book Shadow */}
      <div className="absolute top-4 left-4 w-full h-full bg-black/20 rounded-lg -z-10" />
    </div>
  );
}