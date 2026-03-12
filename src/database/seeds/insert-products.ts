import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("products").del();

  // Inserts seed entries
  await knex("products").insert([
    { name: "Hambúrguer Artesanal", price: 35.9 },
    { name: "Batata Frita Canoa", price: 22.5 },
    { name: "Filé Mignon ao Molho Madeira", price: 58.0 },
    { name: "Espaguete à Carbonara", price: 42.9 },
    { name: "Salmão Grelhado com Legumes", price: 65.0 },
    { name: "Salada Caesar", price: 28.0 },
    { name: "Risoto de Cogumelos", price: 49.9 },
    { name: "Pizza Margherita Individual", price: 38.0 },
    { name: "Lasanha à Bolonhesa", price: 45.0 },
    { name: "Iscas de Frango Empanadas", price: 29.9 },
    { name: "Petit Gâteau com Sorvete", price: 24.5 },
    { name: "Pudim de Leite Condensado", price: 12.0 },
    { name: "Mousse de Maracujá", price: 10.5 },
    { name: "Refrigerante Lata", price: 6.5 },
    { name: "Suco de Laranja Natural", price: 9.9 },
    { name: "Água Mineral sem Gás", price: 4.5 },
    { name: "Cerveja Artesanal IPA", price: 18.0 },
    { name: "Taça de Vinho Tinto", price: 22.0 },
    { name: "Café Expresso", price: 5.5 },
    { name: "Bruschetta de Tomate e Manjericão", price: 19.9 },
  ]);
}
