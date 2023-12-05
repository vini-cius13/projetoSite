const http = require('http')

let vendas = [
    { codVendedor: 1, nome: 'A', cargo: 'junior', codVenda: 1, valorVenda: 10 },
    { codVendedor: 2, nome: 'B', cargo: 'pleno', codVenda: 2, valorVenda: 20 }
]

function getVendas(req, res) {
    res.statusCode = 200
    res.end(JSON.stringify(vendas))
}

function createVenda(req, res) {
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        let venda = JSON.parse(body)
        vendas.push(venda)
        res.statusCode = 200
        res.end(JSON.stringify(venda))
    })
}

function updateVenda(req, res) {
    const vendaSearch = req.url.split('/')[2]
    let body = ''
    req.on('data', chunk => {
        body += chunk.toString()
    })
    req.on('end', () => {
        const index = vendas.findIndex(venda => venda.codVenda == vendaSearch)
        if (index >= 0) {
            vendas[index] = JSON.parse(body)
            res.statusCode = 200
            res.end(JSON.stringify(vendas[index]))
        } else {
            res.statusCode = 404
            res.end(JSON.stringify({ mensagem: 'Rota não encontrada.' }))
        }
    })
}

function eraseVenda(req, res) {
    const vendaSearch = req.url.split('/')[2]
    const index = vendas.findIndex(venda => venda.codVenda == vendaSearch)
    if (index >= 0) {
        vendas.splice(index, 1);
        res.statusCode = 200
        res.end(JSON.stringify({ mensagem: "Venda apagada." }))
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: 'Rota não encontrada.' }))
    }
}

const servidorWEB = http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204; // No Content
        res.end();
        return;
    }
    res.setHeader('Content-Type', 'application/json')
    if (req.url === '/api') {
        getVendas(req, res)
    } else if (req.url === '/create' && req.method === 'POST') {
        createVenda(req, res)
    } else if (req.url.startsWith('/update/') && req.method === 'PUT') {
        updateVenda(req, res)
    } else if (req.url.startsWith('/delete/') && req.method === 'DELETE') {
        eraseVenda(req, res)
    } else {
        res.statusCode = 404
        res.end(JSON.stringify({ mensagem: "Rota não encontrada." }))
    }
})

servidorWEB.listen(5000, () => console.log("O Servidor está online."))