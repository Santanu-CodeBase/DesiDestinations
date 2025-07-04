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

  // Rotate images every 25 seconds
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 25000);
    return () => clearInterval(imageTimer);
  }, [images.length]);

  return (
    <div className="w-3/5 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: `url(${images[currentImageIndex].url})`,
        }}
      >
        {/* Warmer Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/10 to-red-900/30"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-between p-8">
        
        {/* Image Caption Tile */}
        <div className="mt-auto">
          <div className="bg-gradient-to-r from-amber-900/90 to-orange-900/90 backdrop-blur-md rounded-2xl p-6 text-white border border-amber-300/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-3">{images[currentImageIndex].caption}</h3>
            <p className="text-base opacity-95 mb-4 leading-relaxed">
              {images[currentImageIndex].description}
            </p>
            
            {/* Image Indicators */}
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentImageIndex 
                      ? 'bg-amber-300 scale-125 shadow-lg' 
                      : 'bg-white/40 hover:bg-white/60'
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
              <button className="text-white hover:text-amber-300 font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl">
                Accessibility
              </button>
              <button className="text-white hover:text-amber-300 font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl">
                Privacy Policy
              </button>
              <button className="text-white hover:text-amber-300 font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl">
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