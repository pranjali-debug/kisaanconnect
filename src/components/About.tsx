import React from 'react';
import { Leaf, TrendingUp, Users, ShieldCheck } from 'lucide-react';
// Import team images
import harshImage from '../assets/images/harsh.jpeg';
import sahajpreetImage from '../assets/images/sahajpreet.jpeg';
import pranjaliImage from '../assets/images/pranjali.jpg';

const About: React.FC = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-kisaan-green" />,
      title: 'Sustainable Farming',
      description: 'Supporting eco-friendly agricultural practices that preserve the environment for future generations.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-kisaan-green" />,
      title: 'Fair Compensation',
      description: 'Ensuring farmers receive fair prices for their produce, improving rural livelihoods.',
    },
    {
      icon: <Users className="h-8 w-8 text-kisaan-green" />,
      title: 'Community Support',
      description: 'Building stronger agricultural communities through knowledge sharing and collaboration.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-kisaan-green" />,
      title: 'Quality Assurance',
      description: 'Maintaining high standards for all produce to ensure satisfaction for NGOs and end consumers.',
    },
  ];

  const teamMembers = [
    {
      name: "Pranjali Sadafule",
      role: "Project Lead & Backend Developer",
      description: "Defined project strategy and engineered Firebase backend with authentication and Google Maps integration. Integrated Gemini chatbot for agronomic insights.",
      image: pranjaliImage
    },
    {
      name: "Harsh Kumar Singh",
      role: "Research & Outreach Coordinator",
      description: "Conducted farmer/NGO interviews to guide features, authored platform content, and partnered with organizations to validate solutions and drive adoption.",
      image: harshImage
    },
    {
      name: "Sahajpreet Kaur",
      role: "Frontend Developer & UI Designer",
      description: "Developed responsive React/TypeScript interface with map-based listings and seamless Firebase integration.",
      image: sahajpreetImage
    }
  ];

  return (
    <section id="about" className="py-12 bg-white rounded-lg shadow-sm mb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-kisaan-darkbrown mb-3">
            About KisaanConnect
          </h2>
          <div className="w-16 h-1 bg-kisaan-green mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-kisaan-brown">
            We bridge the gap between Indian farmers and NGOs, creating sustainable solutions for agricultural surplus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-10">
          <div className="overflow-hidden rounded-lg">
            <img
              src="https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Farmers working in field"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-kisaan-darkbrown mb-3">Our Mission</h3>
            <p className="text-kisaan-brown mb-4">
              KisaanConnect is a smart, farmer-first e-commerce platform that bridges the gap between Indian farmers and NGOs or buyers. It allows farmers to upload surplus agricultural produce—such as fruits, vegetables, and grains—that would otherwise go to waste.
            </p>
            <p className="text-kisaan-brown">
              NGOs and buyers can view, request, and coordinate directly with farmers, creating a sustainable ecosystem of food distribution and reduced waste.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow transition-shadow group"
            >
              <div className="mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-kisaan-darkbrown mb-2 group-hover:text-kisaan-green transition-colors">
                {feature.title}
              </h3>
              <p className="text-kisaan-brown text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Video Section */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-kisaan-darkbrown mb-3">
              See KisaanConnect in Action
            </h2>
            <div className="w-16 h-1 bg-kisaan-green mx-auto mb-4"></div>
          </div>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="https://www.youtube.com/embed/Jvjon13vfaY?start=10&modestbranding=1&rel=0&showinfo=0&controls=0&disablekb=1&iv_load_policy=3" 
              title="KisaanConnect Introduction Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-[400px]"
            ></iframe>
          </div>
        </div>

        {/* Meet Our Team Section */}
        <div className="mb-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-kisaan-darkbrown mb-3">
              Meet Our Team
            </h2>
            <div className="w-16 h-1 bg-kisaan-green mx-auto mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-5 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-kisaan-cream">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-kisaan-darkbrown">
                    {member.name}
                  </h3>
                  <p className="text-kisaan-green font-medium text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-kisaan-brown text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;