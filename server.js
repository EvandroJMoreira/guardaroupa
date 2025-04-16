const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const DATA_FILE = 'roupas.json';

// Carrega ou inicializa o arquivo JSON
let roupas = [];
if (fs.existsSync(DATA_FILE)) {
    roupas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} else {
    fs.writeFileSync(DATA_FILE, JSON.stringify(roupas, null, 2));
}

// Configuração de upload de imagem
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Listar roupas
app.get('/roupas', (req, res) => {
    res.json(roupas);
});

// Cadastrar nova roupa
app.post('/cadastrar', upload.single('imagem'), (req, res) => {
    const { categoria, tipo } = req.body;
    const imagem = '/uploads/' + req.file.filename;

    const novaRoupa = {
        id: Date.now(),
        categoria,
        tipo,
        imagem
    };

    roupas.push(novaRoupa);
    salvarRoupas();

    res.json({ mensagem: 'Roupa cadastrada com sucesso!' });
});

// Excluir roupa
app.delete('/deletar/:parte/:index', (req, res) => {
    const { parte, index } = req.params;
    const roupas = JSON.parse(fs.readFileSync('roupas.json'));

    if (!roupas[parte] || !roupas[parte][index]) {
        return res.status(404).json({ mensagem: 'Roupa não encontrada' });
    }

    // Remove a roupa
    const [roupaRemovida] = roupas[parte].splice(index, 1);

    // Atualiza o arquivo
    fs.writeFileSync('roupas.json', JSON.stringify(roupas, null, 2));

    // Opcional: remover a imagem do sistema de arquivos
    if (roupaRemovida.imagem) {
        const caminhoImagem = path.join(__dirname, roupaRemovida.imagem);
        fs.unlink(caminhoImagem, (err) => {
            if (err) console.error('Erro ao remover imagem:', err);
        });
    }

    res.json({ mensagem: 'Roupa excluída com sucesso!' });
});


function salvarRoupas() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(roupas, null, 2));
}

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
