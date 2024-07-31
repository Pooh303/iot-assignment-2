export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  cover: string;
  description: string;
  synopsis: string;
  category: string;
}

export interface Menus {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export interface Order {
  id: number;
  items: string;
  time: Date;
  note: string;
}