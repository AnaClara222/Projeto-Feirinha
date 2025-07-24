import express from "express";
import httpStatus from "http-status";

const app = express();
app.use(express.json());

const items = [];
app.post("/items", (req, res) => { // Rota POST para criar novo item na lista de compras
  const { name, quantity, type } = req.body;

  if (!name || !quantity || !type) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  const exists = items.find(item => item.name === name);
  if (exists) {
    return res.sendStatus(httpStatus.CONFLICT);
  }

  const id = items.length + 1;
  const novoItem = {
    id,
    name,
    quantity,
    type,
  };

  items.push(novoItem);

  return res.status(httpStatus.CREATED).json(novoItem); 
});

app.get("/items", (req, res) => { // Rota GET para listar todos os itens (com ou sem filtro por tipo)
  const { type } = req.query;

  if (type) {
    const filteredItems = items.filter(item => item.type === type); // Filtra itens pelo tipo, se for passado na query
    return res.status(httpStatus.OK).json(filteredItems); 
  }

  res.status(httpStatus.OK).json(items);
});

app.get("/items/:id", (req, res) => {
  const id = req.params.id;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(httpStatus.BAD_REQUEST).send("O ID deve ser um número inteiro positivo."); 
  }

  const item = items.find(item => item.id === Number(id));

  if (!item) {
    return res.status(httpStatus.NOT_FOUND).send("Item não encontrado."); 
  }

  res.status(httpStatus.OK).json(item); 
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
