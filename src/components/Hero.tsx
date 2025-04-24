import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToNextSection = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-[85vh] bg-cover bg-center relative flex items-center py-16"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-kisaan-darkbrown/70 to-kisaan-green/50"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Connecting Farmers with Purpose
          </h1>
          <p className="text-lg text-white opacity-90 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            KisaanConnect bridges Indian farmers with NGOs, enabling sustainable trade of surplus produce to reduce waste and support communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <a 
              href="#produce" 
              className="bg-kisaan-yellow text-kisaan-darkbrown px-5 py-2.5 rounded-md font-medium hover:bg-kisaan-yellow/90 transition-colors inline-block text-center"
            >
              Browse Produce
            </a>
            <a 
              href="#about" 
              className="bg-transparent border-2 border-white text-white px-5 py-2.5 rounded-md font-medium hover:bg-white/10 transition-colors inline-block text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white animate-bounce w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} />
      </button>
    </section>
  );
};

export default Hero;