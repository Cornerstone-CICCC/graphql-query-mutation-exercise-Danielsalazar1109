import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v4 as uuidv4 } from "uuid";

// Interface
interface Product {
  id: string;
  productName: string;
  price: number;
  qty: number;
}

// Products dataset
let products: Product[] = [
  { id: "1", productName: "Apple", price: 3.99, qty: 2 },
  { id: "2", productName: "Banana", price: 1.99, qty: 3 },
  { id: "3", productName: "Orange", price: 2.00, qty: 4 },
  { id: "4", productName: "Mango", price: 5.50, qty: 5 },
  { id: "5", productName: "Watermelon", price: 8.99, qty: 2 },
];

// Type Definitions
const typeDefs = `#graphql
  type Product {
    id: ID!
    productName: String!
    price: Float!
    qty: Int!
  }

  type Query {
    products: [Product]
    getProductById(id: ID!): Product
    getProductTotalPrice(id: ID!): Float
    getTotalQtyOfProducts: Int
  }

  type Mutation {
    addProduct(productName: String!, price: Float!, qty: Int!): Product
    updateProduct(id: ID!, productName: String, price: Float, qty: Int): Product
    deleteProduct(id: ID!): Product
  }
`;

// Resolvers - Finish This
const resolvers = {
  Query: {
    products: () => products,
    
    getProductById: (_: unknown, { id }: { id: string }) => {
      return products.find((product) => product.id === id) || null;
    },
    
    getProductTotalPrice: (_: unknown, { id }: { id: string }) => {
      const product = products.find((product) => product.id === id);
      return product ? product.price * product.qty : null;
    },
    
    getTotalQtyOfProducts: () => {
      return products.reduce((total, product) => total + product.qty, 0);
    },
  },

  Mutation: {
    addProduct: (_: unknown, { productName, price, qty }: { productName: string; price: number; qty: number }) => {
      const newProduct: Product = {
        id: uuidv4(),
        productName,
        price,
        qty,
      };
      products.push(newProduct);
      return newProduct;
    },
    
    updateProduct: (_: unknown, { id, productName, price, qty }: { id: string; productName?: string; price?: number; qty?: number }) => {
      const product = products.find((product) => product.id === id);
      if (!product) return null;

      if (productName) product.productName = productName;
      if (price) product.price = price;
      if (qty) product.qty = qty;

      return product;
    },
    
    deleteProduct: (_: unknown, { id }: { id: string }) => {
      const foundIndex = products.findIndex((product) => product.id === id);
      if (foundIndex === -1) return null;

      const [deletedProduct] = products.splice(foundIndex, 1);
      return deletedProduct;
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server);
  console.log(`Server is running on ${url}...`);
};

// Iniciamos el servidor
startServer();
