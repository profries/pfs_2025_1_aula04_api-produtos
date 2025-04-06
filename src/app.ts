import express, { Request, Response } from 'express';
import { Produto } from './types/produto';

const app = express();
const port = 3000;

let listaProdutos: Produto[] = [];
let proximoId = 1;

app.use(express.json());

app.get('/hello', (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
})

//listar produtos
app.get('/api/produtos', (req: Request, res: Response) => {
    res.json(listaProdutos);
})

//inserir produto
app.post('/api/produtos', async (req: Request, res: Response): Promise<any> => {
    const produto = req.body;
    if(!produto.nome || !produto.categoria || !produto.preco) {
        return res.status(400).json({error: "Falta dados obrigatorios"});    
    }

    const novoProduto: Produto = {
        id: proximoId++,
        nome: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco        
    }

    listaProdutos.push(novoProduto);
    res.status(201).json(novoProduto);
})

//buscar produto por id
app.get('/api/produtos/:id', async (req: Request, res: Response): Promise<any> => {
    const id = parseInt(req.params.id);

    const produto = listaProdutos.find( function (prod) {
        return (prod.id === id);
    } )

    if(!produto) {
        return res.status(404).json(
            {error: "Produto nao encontrado"}
        );
    }

    res.json(produto);
})

//atualizar produto
app.put('/api/produtos/:id', async (req: Request, res: Response): Promise<any> => {
    const id = parseInt(req.params.id);
    const { nome, categoria, preco } = req.body;
    const produtoIndex = listaProdutos.findIndex(p => p.id === id);
  
    if (produtoIndex === -1) {
      return res.status(404).json({ error: 'Produto Não encontrado' });
    }
  
    if (!nome || !categoria || preco === undefined) {
      return res.status(400).json({ error: 'Falta dados obrigatorios' });
    }
  
    listaProdutos[produtoIndex] = {
      ...listaProdutos[produtoIndex], //mantém os outros dados de produto (id)
      nome,
      categoria,
      preco
    };
  
    res.json(listaProdutos[produtoIndex]);
  });
  
//deletar produto
app.delete('/api/produtos/:id', async(req: Request, res: Response): Promise<any> => {
    const id = parseInt(req.params.id);
    const produtoIndex = listaProdutos.findIndex(p => p.id === id);
  
    if (produtoIndex === -1) {
      return res.status(404).json({ error: 'produto not found' });
    }
  
    let produtoDeletado = listaProdutos.splice(produtoIndex, 1);
    res.json(produtoDeletado);
});
  
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});