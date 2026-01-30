import { Product } from "../types/Product";
//No es de mi proyecto , se actualizara cuando se implementn los productos.
export const getProduct = async (): Promise<Product[]> => {
  const listaFakeProducts: Product[] = [
    {
    id: 1,
    title: 'Camiseta React Native',
    price: 19.99,
    description: 'Camiseta de algodón 100% con estampado de React Native.',
    } ,

    {
    id: 1,
    title: 'Camiseta Flutter',
    price: 20,
    description: 'Camiseta de Poliester 100% con estampado de React Native.',
    },
    {
    id: 1,
    title: 'Camiseta Flutter',
    price: 20,
    description: 'Camiseta de Poliester 100% con estampado de React Native.',
    }
];


  

  // Simulamos una llamada asíncrona
  return new Promise(async (resolve) => {
      const response = await fetch('https://fakestoreapi.com/products/');
        const data = await response.json();
      resolve(data);
  });
};
