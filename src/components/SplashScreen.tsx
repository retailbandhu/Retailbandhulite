import bandhuMascot from 'figma:asset/4d93b3d1b087e58174e0c66cc9a52e892bfab633.png';

export function SplashScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1E88E5] to-[#FF6F00] p-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto flex items-center justify-center mb-6">
            <img src={bandhuMascot} alt="Retail Bandhu" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-4xl mb-2">Retail Bandhu</h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full">
            <span className="text-white text-sm">Lite</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-12">
          <p className="text-white text-xl">
            Bolo Bandhu, Bill Bana Do
          </p>
          <p className="text-white/90 text-lg">
            अब बिज़नेस बोलेगा, आप नहीं।
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-white/80 text-sm">
          Powered by Retail Bandhu — Har Dukaan, Digital Dukaan.
        </p>
      </div>
    </div>
  );
}