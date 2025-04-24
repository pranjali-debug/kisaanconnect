import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', organization: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-12 bg-white rounded-lg shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-kisaan-darkbrown mb-3">
            Contact Us
          </h2>
          <div className="w-16 h-1 bg-kisaan-green mx-auto mb-4"></div>
          <p className="max-w-2xl mx-auto text-kisaan-brown">
            Have questions or need assistance? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-kisaan-darkbrown mb-4">Get In Touch</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-kisaan-brown text-sm mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-kisaan-green"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-kisaan-brown text-sm mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-kisaan-green"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-kisaan-brown text-sm mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-kisaan-green"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-kisaan-brown text-sm mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-kisaan-green"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="bg-kisaan-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-kisaan-green/90 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
              
              {submitSuccess && (
                <p className="text-kisaan-green text-sm animate-fade-in">
                  Your message has been sent successfully!
                </p>
              )}
            </form>
          </div>
          
          <div className="lg:col-span-2 bg-kisaan-green text-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-5">Contact Information</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-kisaan-yellow shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Our Location</h4>
                  <p className="opacity-90 text-sm">123 Rural Development Complex, New Delhi, India - 110001</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-kisaan-yellow shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Phone Number</h4>
                  <p className="opacity-90 text-sm">+91 98765 43210</p>
                  <p className="opacity-90 text-sm">+91 12345 67890</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-kisaan-yellow shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Email Address</h4>
                  <p className="opacity-90 text-sm">info@kisaanconnect.org</p>
                  <p className="opacity-90 text-sm">support@kisaanconnect.org</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;