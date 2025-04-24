export interface ProduceItem {
  id: string;
  name: string;
  farmer: string;
  location: string;
  quantity: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  available: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FarmerStory {
  id: string;
  name: string;
  location: string;
  image: string;
  story: string;
}

export interface NavItem {
  label: string;
  href: string;
}