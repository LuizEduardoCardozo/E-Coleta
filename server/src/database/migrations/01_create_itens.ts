import Knex from 'knex' // K maiusculo, pois se refere a um tipo (não primitivo)

export async function up(knex: Knex) {
    // Criar a tabela
    return knex.schema.createTable("itens",table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('itens');
}