const roupas = [];

const imagensAtuais = {
    parteSuperior: [],
    parteInferior: [],
    parteSuperiorIndex: 0,
    parteInferiorIndex: 0
};

function escolherConjunto() {
    const parteSuperior = document.getElementById('parteSuperior').value;
    const parteInferior = document.getElementById('parteInferior').value;
    const resultado = `Você escolheu: ${parteSuperior} e ${parteInferior}`;
    document.getElementById('resultado').innerText = resultado;
}

function preencherOpcoes() {
    const superiores = document.getElementById('parteSuperior');
    const inferiores = document.getElementById('parteInferior');

    superiores.innerHTML = '';
    inferiores.innerHTML = '';

    const tiposSuperiores = new Set();
    const tiposInferiores = new Set();

    roupas.forEach(roupa => {
        if (roupa.categoria === 'parteSuperior') {
            tiposSuperiores.add(roupa.tipo);
        } else if (roupa.categoria === 'parteInferior') {
            tiposInferiores.add(roupa.tipo);
        }
    });

    tiposSuperiores.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        superiores.appendChild(option);
    });

    tiposInferiores.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        inferiores.appendChild(option);
    });

    atualizarImagem('parteSuperior');
    atualizarImagem('parteInferior');
}

function atualizarImagem(parte) {
    const select = document.getElementById(parte);
    const tipoSelecionado = select.value;

    const roupasDoTipo = roupas.filter(r => r.tipo === tipoSelecionado);

    imagensAtuais[parte] = roupasDoTipo;
    imagensAtuais[parte + 'Index'] = 0;

    mostrarImagemAtual(parte);
}

function mostrarImagemAtual(parte) {
    const img = document.getElementById('imagem' + parte.charAt(0).toUpperCase() + parte.slice(1));
    const index = imagensAtuais[parte + 'Index'];

    if (imagensAtuais[parte].length > 0) {
        const roupa = imagensAtuais[parte][index];
        img.src = 'http://localhost:3000' + roupa.imagem;  // Confere esse caminho
        img.onerror = () => {
            img.src = '';  // Se der erro, limpa a imagem
            console.error(`Erro ao carregar imagem: ${img.src}`);
        };
    } else {
        img.src = '';
    }
}

function proximaImagem(parte) {
    if (imagensAtuais[parte].length > 1) {
        imagensAtuais[parte + 'Index'] = (imagensAtuais[parte + 'Index'] + 1) % imagensAtuais[parte].length;
        mostrarImagemAtual(parte);
    }
}

function imagemAnterior(parte) {
    if (imagensAtuais[parte].length > 1) {
        imagensAtuais[parte + 'Index'] = 
            (imagensAtuais[parte + 'Index'] - 1 + imagensAtuais[parte].length) % imagensAtuais[parte].length;
        mostrarImagemAtual(parte);
    }
}

function inicializarBancoDeDados() {
    fetch('http://localhost:3000/roupas')
        .then(response => response.json())
        .then(dados => {
            roupas.push(...dados);
            preencherOpcoes();
        })
        .catch(error => console.error('Erro ao carregar roupas:', error));
}

function deletarRoupa(parte, index) {
    if (confirm('Tem certeza que deseja excluir esta roupa?')) {
        fetch(`http://localhost:3000/deletar/${parte}/${index}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensagem);
            window.location.reload();  // Recarrega para atualizar a lista
        })
        .catch(error => {
            alert('Erro ao deletar roupa');
            console.error('Erro:', error);
        });
    }
}

function cadastrarRoupa() {
    const formData = new FormData();
    formData.append('categoria', document.getElementById('categoria').value);
    formData.append('tipo', document.getElementById('tipo').value);
    formData.append('imagem', document.getElementById('imagem').files[0]);

    fetch('http://localhost:3000/cadastrar', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensagem);
        window.location.href = 'index.html';
    })
    .catch(error => {
        alert('Erro ao cadastrar roupa');
        console.error('Erro:', error);
    });
}

document.addEventListener('DOMContentLoaded', inicializarBancoDeDados);

function mostrarLookDoDia() {
    const parteSuperior = document.getElementById('parteSuperior').value;
    const parteInferior = document.getElementById('parteInferior').value;
    const supImagem = imagensAtuais.parteSuperior[imagensAtuais.parteSuperiorIndex]?.imagem;
    const infImagem = imagensAtuais.parteInferior[imagensAtuais.parteInferiorIndex]?.imagem;

    document.getElementById('imgLookSuperior').src = 'http://localhost:3000' + supImagem;

    if (parteSuperior.toLowerCase() === 'vestido') {
        document.getElementById('imgLookInferior').style.display = 'none';
    } else {
        document.getElementById('imgLookInferior').style.display = 'inline';
        document.getElementById('imgLookInferior').src = 'http://localhost:3000' + infImagem;
    }

    document.getElementById('modalLook').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalLook').style.display = 'none';
}
