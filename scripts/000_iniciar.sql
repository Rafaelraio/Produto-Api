\c product-api;

CREATE TABLE Produto (
    ID SERIAL PRIMARY KEY,
    DESCRICAO VARCHAR(255) NOT NULL,
    PRECO DECIMAL(10, 2) NOT NULL,
    ESTOQUE INT NOT NULL,
    DATA TIMESTAMP NOT NULL
);