import knexFactory from "knex";    // nome novo para a função
import config from "../../knexfile";

export const knex = knexFactory(config);   // agora funciona!