# Projeto - Entrega 4

##Grupo 1
Trabalho realizado por:
* Hernâni Araújo
* Miguel Albernaz
* Miguel Braz
* Gonçalo Arruda

---

##Tecnologias Utilizadas



### Front-end
* **React:** Biblioteca de código aberto focada na criação de interfaces de utilizador (UI) dinâmicas e interativas.

### Back-end & Armazenamento
* **IndexedDB:** Sistema de base de dados NoSQL do lado do cliente, projetado para armazenar grandes quantidades de dados estruturados e ficheiros diretamente no dispositivo do utilizador.
* **MongoDB:** Sistema de base de dados NoSQL orientado a documentos (semelhante a JSON), utilizado para o armazenamento centralizado e persistente no servidor.

---

##Como Correr a Aplicação

---

## Estrutura da Aplicação

A estrutura do projeto foi dividida em duas diretorias principais no repositório para separar claramente as responsabilidades:


projeto-caca/
├── backend/                  # 
│   ├── config/               # Configurações de BD e variáveis de ambiente
│   ├── controllers/          # Lógica de negócio
│   ├── middleware/           # Middlewares
│   ├── models/               # Modelos de dados
│   ├── routes/               # Definição dos Endpoints da API
│   ├── .env.example          # Modelo de variáveis de ambiente
│   ├── package.json          # Dependências do Back-end
│   └── server.js             # Ponto de entrada do servidor
│
└── frontend/                 
    ├── public/               # Ativos públicos estáticos
    └── src/
        ├── assets/           # Imagens, logótipos e estilos globais
        ├── components/       # Componentes React (Navbar, Footer, Notícias, Investigação)
        ├── utils/            # Funções utilitárias e ajudas locais
        ├── App.css           # Estilos específicos do App
        ├── App.js            # Componente principal e definição de Rotas
        ├── index.css         # Estilos globais e resets CSS
        └── package.json      # Dependências do Front-end (react, react-router-dom, axios)

---

## Decisões de Design e Implementação



---

## Acessibilidade, Responsividade e Segurança

### Acessibilidade
* Navegação completa por teclado com foco visível.
* Contraste rigoroso de cores respeitando a identidade visual.
* Fontes definidas em unidades relativas (`rem`/`em`), permitindo o zoom do navegador sem deformar o layout.

### Responsividade
* Desenvolvida com a abordagem **Mobile-First**, garantindo o funcionamento perfeito desde smartphones em ambiente clínico até monitores de secretária.
* Utilização de **Flexbox** e **CSS Grid** para a criação de layouts fluidos.
* Imagens otimizadas com **lazy loading** para poupar o consumo de dados móveis.

### Segurança
A autenticação é gerida via JSON Web Tokens. Após o login, o utilizador recebe um token assinado pelo servidor que autoriza os seus pedidos seguintes.
O token carrega o perfil do utilizador, permitindo que middlewares no back-end barrem acessos não autorizados a áreas sensíveis do sistema.

---

## APIs Externas Utilizadas

* **OpenStreetMap:** Disponibiliza um mapa interativo ao utilizador, permitindo visualizar a localização exata onde os próximos eventos serão realizados.
* **wttr.in:**
Para obter-mos o tempo, utilizamos a API wttr.in. Esta permite, a partir do local (obtido por openstreetmap) e data (definida pelo utilizador) do evento em questão, obter informações como:
Temperatura média do dia (temperatura certa para uma data atual)
-Estado geral do tempo (escolhido dependendo do weathercode retornado pelo fetch) 
-Vento 
-Humidade
Caso não seja possível obter os valores (erro no fetch, falta de informação para o local, etc.) "N/A" é retornado para todos estes valores.
* **rss2json:**
Utilizado como um servidor proxy para converter feeds RSS públicos em ficheiros JSON (através do endpoint `https://api.rss2json.com/v1/api.json?rss_url=`). 
Nota de implementação: Devido à dificuldade em encontrar feeds RSS públicos compatíveis sem restrições de CORS, a aplicação exibe atualmente um feed de notícias *placeholder* como prova de conceito.
