import express from 'express';

const app = express();

/*
    Arquivos do tipo .ts não podem ser executados pelo node. Para isso, é necessário um pacote extra, chamado
    "ts-node"

    É preciso ter um arquivo de configurações do typescript toda vez que for usar-lo
    (npx tsc --init) para criar esse arquvo

    Após ter o typescript e o ts-node instalados, para rodar o servidor, basta usar (npx ts-node <arquivo>)

*/

app.get('/users', (req,res) => console.log("Olá, mundo!"));

app.listen(3000);