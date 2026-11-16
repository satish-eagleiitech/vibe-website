export type FnBItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  veg: boolean;
  imageUrl: string;
};

export const MOVIE_FNB_ITEMS: FnBItem[] = [
  {
    id: "popcorn-fries",
    name: "Popcorn Fries Combo",
    description: "Large popcorn + fries + 2 soft drinks",
    price: 360,
    veg: true,
    imageUrl: "/images/movies/fnb/popcorn-fries.jpg",
  },
  {
    id: "couple-combo",
    name: "Couple Combo",
    description: "2 medium popcorn + 2 cola 400ml",
    price: 420,
    veg: true,
    imageUrl: "/images/movies/fnb/couple-combo.jpg",
  },
  {
    id: "festival-combo",
    name: "Festival Combo",
    description: "Caramel popcorn + nachos + large soda",
    price: 390,
    originalPrice: 415,
    veg: true,
    imageUrl: "/images/movies/fnb/festival-combo.jpg",
  },
  {
    id: "pizza-soda",
    name: "Pizza & Soda",
    description: "Personal cheese pizza + cola",
    price: 299,
    veg: true,
    imageUrl: "/images/movies/fnb/pizza-soda.jpg",
  },
];

export function findFnBItems(ids: string[]) {
  return MOVIE_FNB_ITEMS.filter((item) => ids.includes(item.id));
}
