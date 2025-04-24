# KisaanConnect

## Connecting Farmers with Purpose

KisaanConnect is a smart, farmer-first e-commerce platform that bridges the gap between Indian farmers and NGOs. It enables sustainable trade of surplus produce to reduce waste and support communities.

🌐 **Live Demo**: [https://kisaanconnect.vercel.app/](https://kisaanconnect.vercel.app/)

![KisaanConnect Banner](https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## 📌 About

KisaanConnect allows farmers to upload surplus agricultural produce—such as fruits, vegetables, grains, and spices—that would otherwise go to waste. NGOs and buyers can view, request, and coordinate directly with farmers, creating a sustainable ecosystem of food distribution and reduced waste.

## ✨ Features

- **Interactive Map**: Geolocation-based produce discovery
- **User Authentication**: Separate workflows for farmers and NGOs
- **Product Management**: Easy listing of agricultural surplus
- **Real-time Chat**: Built-in communication between farmers and NGOs
- **Shopping Cart & Checkout**: Streamlined purchasing process
- **AI-powered Chatbot**: Assistance for platform navigation and queries
- **Responsive Design**: Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **State Management**: React Context API
- **Maps Integration**: Google Maps API
- **AI Integration**: Google Generative AI
- **Authentication & Database**: Firebase
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/kisaanconnect.git
cd kisaanconnect
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file in the root directory and add your API keys
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📱 Usage

### For Farmers
- Sign up as a farmer
- Add your surplus produce with details and location
- Communicate with interested NGOs
- Manage your listings

### For NGOs
- Browse available produce on the map or list view
- Add items to cart
- Complete checkout process
- Contact farmers directly

## 📂 Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # React components
│   └── Auth/        # Authentication components
├── contexts/        # React context providers
├── data/            # Sample data
├── firebase/        # Firebase configuration
├── services/        # External API services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Google Maps API](https://developers.google.com/maps)
- [Google Generative AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

Made with ❤️ for Indian Farmers and NGOs
