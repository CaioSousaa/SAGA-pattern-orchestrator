### Descrição do Projeto

Antes de falar de micro-serviços, é importante entender a arquitetura monolítica. Nesse modelo tradicional, todo o sistema roda como um único bloco, onde as funções estão interligadas e mudanças em uma parte podem afetar o todo.

Já os micro-serviços seguem outra lógica: o sistema é dividido em partes menores e independentes, geralmente separadas por domínios da aplicação. Cada serviço tem seu próprio banco de dados e é responsável por uma função específica. Eles se comunicam entre si por meio de interfaces bem definidas. Como são independentes, fica muito mais fácil atualizar, escalar ou implantar apenas o que for necessário, sem afetar o restante do sistema.

Então, nesse contexto, surgem duas propriedades importantes: a virtualização e a compensação de dados.
Para lidar bem com esses pontos, optei por usar o Pattern de Orquestração. Nesse modelo, os micro-serviços que participam de um determinado fluxo (SAGA) não precisam saber a ordem em que as mensagens são enviadas. Essa responsabilidade fica com um outro serviço específico, que orquestra todo o processo.

---

### Tecnologias utilizadas no projeto

- NodeJs
- NestJS
- Prisma
- Docker e docker-compose
- PostgreSQL
- Typescript
- Kafka
- Entre outros

---

### Arquitetura

Para a implementação do projeto utilizei Nodejs em conjunto com o framewok Nestjs, Prisma como ORM para o banco de dados, no qual utilizei para persistir os dados o PostgreSQL, todo o projeto foi implementado utilizando Typescript. Utilizei também o Kafka para fazer o sistema de troca de mensagens entre os micro-serviços.

A arquitetura dos micro-serviços seguem a mesma estrutura, então a arquitetura focada dento da pasta src:

<pre style="overflow-x: auto; max-width: 1000px; white-space: pre;">
src/
│── app/
│   ├── app.module.ts                           # Arquivo principal do NestJS, onde os módulos da aplicação são configurados
│
│── core/                                       # Núcleo da aplicação (regras e contratos)
│   ├── config/
│   │   ├── kafka.ts                            # Configuração do Kafka para mensageria
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── entitie.ts                      # Representa as entidades do domínio (ex: Cliente, Pedido, Produto)
│   │   ├── dtos/
│   │   │   ├── dtos.ts                         # Objetos de transferência de dados (entrada/saída de dados)
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── prismaClient.ts                 # Instância e configuração do cliente Prisma (ORM)
│
│── infra/                                      # Implementações concretas (infraestrutura)
│   ├── prisma/
│   │   ├── repositories/
│   │   │   ├── ClientPrismaRepository.ts       # Implementação do repositório para cada entidade usando Prisma
│── usecases/                                   # Casos de uso (regras de aplicação)
│   ├── ports/                                  # Interfaces (contratos) para entrada/saída da aplicação
│   ├── usecase.service.ts                      # Caso de uso
</pre>

---

### Como rodar o projeto em sua máquina:

No momento que fiz essa aplicação estou usando o Node na versão _22.15.0_ e Typescript na _5.7.3_.

### Passo a passo:

- Primeiramente, clone o projeto com o comando `git clone https://github.com/CaioSousaa/SAGA-pattern-orchestrator.git`
- Entre em cada diretorio de cada micro-serviço e rode o comando `yarn` no terminal para baixar as dependências
- Dentro de cada micro-serviço crie um arquivo `.env` e defina variáveis de ambiente, e após isso rode o comando `docker-compose up -d` para rodar o container Docker com o banco de dados respectivo
- Após isso, va para a raiz do projeto e rode `docker-compose up -d` para para rodar o container Docker com o zookeper e o kafka
