# Tech Challenge – Fase 4

## Descrição do Projeto

Este projeto foi desenvolvido como parte do **Tech Challenge – Fase 4** da Pós-Graduação em Tecnologia. O objetivo é a construção de uma aplicação completa, composta por **Backend em Node.js** e **Aplicação Mobile utilizando Expo (React Native + TypeScript)**, simulando um sistema de blog educacional com autenticação, controle de perfis e consumo de API.

A aplicação permite que **professores** realizem login e gerenciem publicações, enquanto **alunos** podem visualizar conteúdos e interagir por meio de comentários.

---

## Tecnologias Utilizadas

### Backend
* Node.js
* Express
* Sequelize
* SQLite
* JWT (JSON Web Token)
* Bcrypt
* Nodemon
* Dotenv

### Mobile
* Expo
* React Native
* TypeScript
* Axios
* React Navigation
* JWT Decode
* Expo Vector Icons

### Justificativa do Uso do Expo (Expo Go)

O **Expo** foi utilizado no desenvolvimento da aplicação mobile por simplificar o processo de configuração do ambiente React Native, permitindo maior foco na lógica da aplicação e na integração com o backend.

O uso do **Expo Go** possibilita a execução e testes da aplicação diretamente em dispositivos físicos ou em ambiente web, sem a necessidade de configurações complexas de build nativo. Essa abordagem é especialmente adequada para fins acadêmicos e prototipação, garantindo agilidade no desenvolvimento, compatibilidade multiplataforma e facilidade de validação das funcionalidades implementadas.

---

## Estrutura do Projeto Simplificada

```
Fase-4-Pos-Tech-Fiap
│
├── Projeto_FrontEnd_Fiap-main
│   └── blog_aulas
│       ├── blog_backend
│       └── blog_frontend 
│
└── Projeto_Mobile_Fiap
```
### Observação sobre o diretório blog_frontend

O diretório **blog_frontend** faz parte de uma versão anterior do projeto, desenvolvida em uma etapa prévia do curso.  
Na presente entrega, a camada de frontend foi substituída pelo módulo mobile desenvolvido em **Expo + React Native**, localizado em `Projeto_Mobile_Fiap`.

Dessa forma, o conteúdo deste diretório não é utilizado na execução atual do sistema e pode ser desconsiderado para fins de avaliação.

---

## Configuração e Execução do Backend

### Acessar o diretório

```bash
cd Fase-4-Pos-Tech-Fiap
cd Projeto_FrontEnd_Fiap-main
cd blog_aulas
cd blog_backend
```

### Instalar dependências

```bash
npm install
npm install nodemon --save-dev
```

### Criar arquivo de ambiente

Criar um arquivo `.env` na raiz do diretório `blog_backend` com o seguinte conteúdo:

```
JWT_SECRET=super_chave_secreta_123
```

### Executar o servidor

```bash
npm run dev
```
O servidor será iniciado na porta **4000**.

---

## Configuração e Execução do Mobile

### Acessar o diretório

```bash
cd Fase-4-Pos-Tech-Fiap
cd Projeto_Mobile_Fiap
```

### Instalar dependências

```bash
npm install
npm install expo
npm install axios
npm install @react-navigation/native
npx expo install react-dom react-native-web
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npm install jwt-decode
npm install @expo/vector-icons
```

### Configurar API

No Windows, executar no terminal:

```bash
ipconfig
```

Copiar o **Endereço IPv4** e substituir no arquivo:

```
blog-mobile/src/api/api.ts
```

Exemplo:

```
http://192.168.0.10:4000
```

### Executar aplicação

```bash
npx expo start -c
```

A aplicação pode ser acessada via:

* Navegador (Web)
* Expo Go (QR Code)
* Emulador Android

---

### Credenciais de Acesso para Testes

#### Professores

| Usuário              | Senha     |
|----------------------|-----------|
| prof1                | senha123  |
| Professor Girafales  | senha123  |

#### Alunos

| Usuário        | Senha  |
|----------------|--------|
| aluno1         | 123654 |
| Peter Parker   | 123654 |


---

## Funcionalidades

### Autenticação e Perfis

* Sistema de autenticação via JWT.
* Perfis de usuário diferenciados: **Professor** e **Aluno**.
* O **Professor** possui permissões administrativas adicionais.

### Gerenciamento de Usuários (Professor)

* Professores podem **gerenciar perfis de outros professores e alunos**.
* É possível listar, criar, editar e remover usuários conforme as regras do sistema.

### Postagens

* Professores podem **criar, editar e excluir postagens**.
* As postagens ficam disponíveis para visualização pública.
* Listagem de posts com ordenação por data e busca por texto.

### Comentários

* **Todos os usuários (professores e alunos)** podem comentar nas postagens.
* **Professores** podem excluir **qualquer comentário**, independentemente do autor.
* **Alunos** podem excluir **apenas os próprios comentários**.

---

## Demonstração da Aplicação

Foi gravado um vídeo demonstrando o funcionamento completo da aplicação, incluindo autenticação, navegação, consumo da API e permissões por perfil de usuário.

📺 **Link para o vídeo de demonstração no YouTube:** [Clique aqui](https://youtu.be/CZi5rMJGcq0?si=vee4j1s3f6W1u9kN)

---

## Imagens da Aplicação

Abaixo estão algumas imagens que ilustram o funcionamento da aplicação mobile:

- Tela de inicial e de login
<img width="877" height="600" alt="image" src="https://github.com/user-attachments/assets/cc1b6eee-88b6-43ba-b294-fd148d7581e6" />
<img width="1359" height="747" alt="image" src="https://github.com/user-attachments/assets/e9f47b60-5769-4a60-b82e-3e780ea3d070" />

- Listagem de postagens
<img width="1360" height="746" alt="image" src="https://github.com/user-attachments/assets/da9ed9a1-6c92-484d-afe1-320c176bf83a" />

- Visualização de post
<img width="1360" height="850" alt="image" src="https://github.com/user-attachments/assets/2dbd0a6c-e230-43d0-bfff-2ffe060aa027" />

- Criação e exclusão de comentários
<img width="1315" height="582" alt="image" src="https://github.com/user-attachments/assets/18e0843e-6562-4b91-aaa0-e879f5849339" />

- Funcionalidade específica do perfil de professor - Criação de post
<img width="420" height="327" alt="image" src="https://github.com/user-attachments/assets/2c0000e8-a765-4cf5-820d-e02488ed0859" />

- Funcionalidade específica do perfil de professor - Listagem da edição de post e edição de post com botão de exclusão selecionado
<img width="1373" height="582" alt="image" src="https://github.com/user-attachments/assets/b3b981c4-1170-47d1-9562-2d0d862b20bb" />
<img width="582" height="710" alt="image" src="https://github.com/user-attachments/assets/6cff0d25-e75c-40c3-9b49-30a1e43e2cdb" />

- Funcionalidade específica do perfil de professor - Listagem do gerenciamento de professores, criação de um novo cadastro de professor e edição de professores
<img width="1368" height="624" alt="image" src="https://github.com/user-attachments/assets/3ecf78fa-84c9-42e6-a8fd-24838b52a8a1" />
<img width="551" height="379" alt="image" src="https://github.com/user-attachments/assets/3c7a9e14-f381-4e27-bae0-825b32bd1b67" />
<img width="571" height="401" alt="image" src="https://github.com/user-attachments/assets/f36865ee-2394-49a1-af8c-5b1d68acca9c" />

- Funcionalidade específica do perfil de professor - Listagem do gerenciamento de alunos, criação de um novo cadastro de aluno e edição de aluno
<img width="1370" height="838" alt="image" src="https://github.com/user-attachments/assets/29103b6f-83d1-4826-b040-2efa07daadbb" />
<img width="537" height="371" alt="image" src="https://github.com/user-attachments/assets/6ee5aaab-f92c-431a-aea5-fe6d4874e7ff" />
<img width="542" height="385" alt="image" src="https://github.com/user-attachments/assets/4ab3715e-e0cd-48db-8bf1-b6aef6976487" />

---

## Dificuldades Encontradas

Durante o desenvolvimento do projeto, algumas dificuldades foram identificadas e solucionadas ao longo do processo, contribuindo para o amadurecimento técnico da solução:
* Configuração de autenticação com JWT: ajustes foram necessários para garantir o correto fluxo de autenticação entre backend e aplicação mobile, especialmente no envio e validação do token nas requisições protegidas.
* Controle de permissões por perfil: a implementação das regras de autorização (professor versus aluno) exigiu atenção na definição de middlewares e validações no backend, garantindo segurança e coerência nas ações permitidas.
* Integração entre backend e aplicação mobile: foi necessário alinhar corretamente rotas, payloads e tratamento de erros para assegurar uma comunicação estável entre as camadas.
* Configuração de ambiente e rede: durante os testes em dispositivos físicos, houve a necessidade de configurar corretamente o endereço IP da máquina para permitir o acesso da aplicação mobile à API local.
Esses desafios foram superados por meio de análise, testes e ajustes incrementais, resultando em uma aplicação funcional e alinhada aos requisitos propostos.

---

## Considerações Finais

O projeto atende aos requisitos propostos no Tech Challenge da Fase 4, demonstrando integração entre múltiplas camadas da aplicação, autenticação segura e consumo de API em diferentes plataformas. O desenvolvimento priorizou organização, clareza de arquitetura e boas práticas de desenvolvimento.
