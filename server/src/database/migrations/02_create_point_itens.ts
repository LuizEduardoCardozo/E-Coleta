import Knex from 'knex' // K maiusculo, pois se refere a um tipo (não primitivo)

export async function up(knex: Knex) {
    // Criar a tabela
    return knex.schema.createTable("point_itens",table => {
        table.increments('id').primary();

        table.integer('point_id')
        .notNullable()
        .references('id').inTable('points');

        table.integer('iten_id')
        .notNullable()
        .references('id').inTable('itens');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('point_itens');
}