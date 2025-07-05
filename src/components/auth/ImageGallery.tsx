import React, { useState, useEffect } from 'react';

interface ImageData {
  url: string;
  caption: string;
  description: string;
}

interface ImageGalleryProps {
  images: ImageData[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 30 seconds for better viewing
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 30000);
    return () => clearInterval(imageTimer);
  }, [images.length]);

  return (
    <div className="w-3/5 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out"
        style={{
          backgroundImage: `url(${images[currentImageIndex].url})`,
        }}
      >
        {/* Enhanced Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-8">
        
        {/* Image Caption Tile - Enhanced for better visibility */}
        <div className="mt-auto">
          <div className="bg-gradient-to-r from-black/80 to-black/70 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
              {images[currentImageIndex].caption}
            </h3>
            <p className="text-base text-white/95 mb-4 leading-relaxed drop-shadow-md">
              {images[currentImageIndex].description}
            </p>
            
            {/* Image Indicators with better visibility */}
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Links with High Contrast */}
        <div className="absolute bottom-4 left-8 right-8">
          <div className="flex justify-end">
            <div className="flex items-center space-x-8 text-xs">
              <button className="text-white/90 hover:text-white font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Accessibility
              </button>
              <button className="text-white/90 hover:text-white font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Privacy Policy
              </button>
              <button className="text-white/90 hover:text-white font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;