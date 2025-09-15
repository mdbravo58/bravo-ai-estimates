import bravoLogo from "@/assets/bravo-logo.png";

interface BookCoverProps {
  className?: string;
}

export function BookCover({ className = "" }: BookCoverProps) {
  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      {/* Book Cover */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-l-lg shadow-2xl transform perspective-1000 rotate-y-12">
        {/* Spiral Binding */}
        <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-l-lg">
          <div className="flex flex-col justify-evenly h-full px-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-4 h-3 bg-gray-600 rounded-full shadow-inner" />
            ))}
          </div>
        </div>
        
        {/* Cover Content */}
        <div className="pl-8 pr-6 py-12 h-96 flex flex-col justify-between">
          {/* Logo Section */}
          <div className="flex justify-center">
            <img 
              src={bravoLogo} 
              alt="Bravo AI Systems Logo" 
              className="w-32 h-32 object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-white text-2xl font-bold leading-tight">
              Business Management
            </h1>
            <h2 className="text-blue-100 text-xl font-semibold">
              AI Platform
            </h2>
            <h3 className="text-blue-200 text-lg">
              for Home Services
            </h3>
          </div>
          
          {/* Bottom Accent */}
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-100 rounded-full" />
          </div>
        </div>
        
        {/* Book Spine Shadow */}
        <div className="absolute right-0 top-0 w-2 h-full bg-gradient-to-r from-blue-900 to-transparent rounded-r-lg" />
      </div>
      
      {/* Book Shadow */}
      <div className="absolute top-4 left-4 w-full h-full bg-black/20 rounded-l-lg -z-10 transform rotate-y-12" />
    </div>
  );
}