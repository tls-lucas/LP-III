# LP-III — Sistema Web de Gerenciamento de Visitas a Aquários

Este repositório contém o desenvolvimento de um projeto acadêmico realizado ao longo do semestre, com foco no aprofundamento dos conceitos de Programação Orientada a Objetos (POO) e no desenvolvimento de aplicações web full stack, dando continuidade ao sistema iniciado no projeto [LP-II](https://github.com/tls-lucas/LP-II), agora migrado para uma arquitetura cliente-servidor.

O sistema permite que diretores de aquário cadastrem períodos de visita e que diretores de escola realizem reservas para suas turmas, com autenticação e recuperação de acesso por usuário.

## Objetivos

- Aplicar na prática os princípios de POO: encapsulamento, herança, polimorfismo e abstração, agora em um contexto de back-end e front-end desacoplados.
- Modelar entidades de domínio (usuário, diretor de aquário, diretor de escola, período de visita e reserva) e seus relacionamentos com um ORM.
- Construir uma API REST autenticada com tokens (JWT) e consumi-la a partir de uma interface web em React.
- Trabalhar com versionamento e colaboração em equipe.
- Explorar boas práticas de desenvolvimento em TypeScript/JavaScript.

## Tecnologias utilizadas

- **Back-end:** Node.js, TypeScript, Express, TypeORM, MySQL
- **Front-end:** React
- **Autenticação:** JWT, bcrypt
- **Versionamento:** Git/GitHub

## Estrutura do projeto

```
back-end/    API REST (entidades, serviços, rotas e middlewares)
front-end/   Interface web em React
```

O projeto foi desenvolvido em etapas, com entregas parciais ao longo do semestre, refletindo a evolução dos aprendizados e da implementação.
