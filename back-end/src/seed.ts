import "reflect-metadata";
import bcrypt from "bcrypt";
import md5 from "md5";
import { createConnection, getManager } from "typeorm";
import Usuário, { Perfil, Status, Cores } from "./entidades/usuário";
import DiretorAquario, { CertificacaoAmbiental } from "./entidades/diretor-aquario";
import DiretorEscola, { Turno } from "./entidades/diretor-escola";
import PeriodoVisita, { Categoria } from "./entidades/periodo-visita";
import Reserva, { Horario } from "./entidades/reserva";

const SALT = 10;

async function limparBanco(manager) {
  await manager.query("SET FOREIGN_KEY_CHECKS = 0");
  await manager.query("TRUNCATE TABLE reserva");
  await manager.query("TRUNCATE TABLE periodo_visita");
  await manager.query("TRUNCATE TABLE diretor_escola");
  await manager.query("TRUNCATE TABLE diretor_aquario");
  await manager.query("TRUNCATE TABLE usuário");
  await manager.query("SET FOREIGN_KEY_CHECKS = 1");
  console.log("Banco limpo.");
}

async function criarDiretorAquario(manager, dados: {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  questão: string;
  resposta: string;
  cor_tema: Cores;
  nome_aquario: string;
  anos_direção: number;
  certificacao_ambiental: CertificacaoAmbiental;
}) {
  const cpf_enc = md5(dados.cpf);
  const senha_enc = await bcrypt.hash(dados.senha, SALT);
  const resposta_enc = await bcrypt.hash(dados.resposta, SALT);
  const usuário = manager.create(Usuário, {
    cpf: cpf_enc,
    nome: dados.nome,
    perfil: Perfil.DIRETOR_AQUARIO,
    status: Status.ATIVO,
    email: dados.email,
    senha: senha_enc,
    questão: dados.questão,
    resposta: resposta_enc,
    cor_tema: dados.cor_tema,
  });
  await manager.save(usuário);
  const diretor = manager.create(DiretorAquario, {
    usuário,
    nome_aquario: dados.nome_aquario,
    anos_direção: dados.anos_direção,
    certificacao_ambiental: dados.certificacao_ambiental,
  });
  await manager.save(diretor);
  return diretor;
}

async function criarDiretorEscola(manager, dados: {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  questão: string;
  resposta: string;
  cor_tema: Cores;
  nome_escola: string;
  turno: Turno;
}) {
  const cpf_enc = md5(dados.cpf);
  const senha_enc = await bcrypt.hash(dados.senha, SALT);
  const resposta_enc = await bcrypt.hash(dados.resposta, SALT);
  const usuário = manager.create(Usuário, {
    cpf: cpf_enc,
    nome: dados.nome,
    perfil: Perfil.DIRETOR_ESCOLA,
    status: Status.ATIVO,
    email: dados.email,
    senha: senha_enc,
    questão: dados.questão,
    resposta: resposta_enc,
    cor_tema: dados.cor_tema,
  });
  await manager.save(usuário);
  const diretor = manager.create(DiretorEscola, {
    usuário,
    nome_escola: dados.nome_escola,
    turno: dados.turno,
  });
  await manager.save(diretor);
  return diretor;
}

const todosHorarios = Object.values(Horario);
const todasCores = Object.values(Cores);
const todasCerts = Object.values(CertificacaoAmbiental);
const todosTurnos = Object.values(Turno);

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

async function main() {
  const conn = await createConnection();
  const manager = getManager();

  await limparBanco(manager);

  // ─── Dados fixos: 2 de cada ───────────────────────────────────────────────

  const aquariosFixos = [
    {
      cpf: "111.111.111-11", nome: "Carlos Mendes", email: "carlos@aquamundo.com",
      senha: "Senha@123", questão: "Nome do seu primeiro animal de estimação?", resposta: "bolinha",
      cor_tema: Cores.AZUL, nome_aquario: "AquaMundo", anos_direção: 8,
      certificacao_ambiental: CertificacaoAmbiental.NACIONAL,
    },
    {
      cpf: "222.222.222-22", nome: "Fernanda Lima", email: "fernanda@oceanovivo.com",
      senha: "Senha@456", questão: "Cidade onde você nasceu?", resposta: "recife",
      cor_tema: Cores.VERDE_AZULADO, nome_aquario: "Oceano Vivo", anos_direção: 5,
      certificacao_ambiental: CertificacaoAmbiental.INTERNACIONAL,
    },
  ];

  const escolasFixas = [
    {
      cpf: "333.333.333-33", nome: "Ana Paula Souza", email: "ana@escolaestadual.com",
      senha: "Senha@789", questão: "Nome da rua onde você cresceu?", resposta: "das flores",
      cor_tema: Cores.ROSA, nome_escola: "Escola Estadual Barão do Rio Branco", turno: Turno.MATUTINO,
    },
    {
      cpf: "444.444.444-44", nome: "Roberto Alves", email: "roberto@colegiofederal.com",
      senha: "Senha@000", questão: "Qual era o apelido da sua mãe?", resposta: "dinda",
      cor_tema: Cores.LARANJA, nome_escola: "Colégio Federal Dom Pedro II", turno: Turno.VESPERTINO,
    },
  ];

  // ─── Dados extras: 15 de cada ────────────────────────────────────────────

  const nomesAquario = [
    { nome: "Ricardo Barros",    aquario: "Aquário do Atlântico",      cert: CertificacaoAmbiental.ESTADUAL },
    { nome: "Patrícia Nunes",    aquario: "Mundo Aquático",             cert: CertificacaoAmbiental.NACIONAL },
    { nome: "Gustavo Peixoto",   aquario: "Mar Profundo",               cert: CertificacaoAmbiental.INTERNACIONAL },
    { nome: "Juliana Castro",    aquario: "Vida Marinha",               cert: CertificacaoAmbiental.NAO_POSSUI },
    { nome: "Marcelo Teixeira",  aquario: "Aquário Tropical",           cert: CertificacaoAmbiental.ESTADUAL },
    { nome: "Beatriz Oliveira",  aquario: "Recifes & Cia",              cert: CertificacaoAmbiental.NACIONAL },
    { nome: "Eduardo Fonseca",   aquario: "Aquário Nacional",           cert: CertificacaoAmbiental.INTERNACIONAL },
    { nome: "Camila Rocha",      aquario: "Jardim Aquático",            cert: CertificacaoAmbiental.ESTADUAL },
    { nome: "Felipe Martins",    aquario: "Aquário da Amazônia",        cert: CertificacaoAmbiental.NACIONAL },
    { nome: "Larissa Gomes",     aquario: "Oceano Azul",                cert: CertificacaoAmbiental.INTERNACIONAL },
    { nome: "Thiago Carvalho",   aquario: "Aquário Pantanal",           cert: CertificacaoAmbiental.ESTADUAL },
    { nome: "Renata Pereira",    aquario: "Mar de Dentro",              cert: CertificacaoAmbiental.NAO_POSSUI },
    { nome: "Vinícius Almeida",  aquario: "Aquário Cerrado",            cert: CertificacaoAmbiental.NACIONAL },
    { nome: "Daniela Ribeiro",   aquario: "Aquário São Francisco",      cert: CertificacaoAmbiental.ESTADUAL },
    { nome: "Rafael Correia",    aquario: "Aquário da Costa Verde",     cert: CertificacaoAmbiental.INTERNACIONAL },
  ];

  const nomesEscola = [
    { nome: "Silvana Mota",      escola: "Escola Mun. João XXIII",          turno: Turno.MATUTINO },
    { nome: "Cláudio Ferreira",  escola: "EMEF Monteiro Lobato",            turno: Turno.VESPERTINO },
    { nome: "Andreia Lima",      escola: "Escola Est. Tiradentes",          turno: Turno.NOTURNO },
    { nome: "Bruno Nascimento",  escola: "Colégio Estadual Santos Dumont",  turno: Turno.MATUTINO },
    { nome: "Tatiana Souza",     escola: "EMEF Rui Barbosa",                turno: Turno.VESPERTINO },
    { nome: "Leandro Cunha",     escola: "Escola Mun. Anchieta",            turno: Turno.MATUTINO },
    { nome: "Priscila Dias",     escola: "Colégio Estadual Oswaldo Cruz",   turno: Turno.NOTURNO },
    { nome: "Rodrigo Macedo",    escola: "EMEF Getúlio Vargas",             turno: Turno.MATUTINO },
    { nome: "Aline Cardoso",     escola: "Escola Est. Castro Alves",        turno: Turno.VESPERTINO },
    { nome: "Fábio Monteiro",    escola: "Colégio Mun. José de Alencar",    turno: Turno.MATUTINO },
    { nome: "Cristiane Batista", escola: "EMEF Dom Bosco",                  turno: Turno.VESPERTINO },
    { nome: "Alexandre Cruz",    escola: "Escola Est. Zumbi dos Palmares",  turno: Turno.NOTURNO },
    { nome: "Mariana Lopes",     escola: "EMEF Machado de Assis",           turno: Turno.MATUTINO },
    { nome: "Henrique Araújo",   escola: "Escola Mun. Cora Coralina",       turno: Turno.VESPERTINO },
    { nome: "Vanessa Moreira",   escola: "Colégio Estadual Cecília Meireles", turno: Turno.MATUTINO },
  ];

  const titulosPeriodo = [
    "Biomas Aquáticos Brasileiros", "Espécies em Extinção", "Ecossistemas de Mangue",
    "Fauna do Rio Amazonas", "Corais e Esponjas", "Tartarugas Marinhas",
    "Peixes da Caatinga", "Arraias e Tubarões", "Vida no Fundo do Mar",
    "Anfíbios e Répteis Aquáticos",
  ];

  const guias = [
    "João Ferreira", "Maria Santos", "Pedro Costa", "Luisa Ramos",
    "Tiago Moura", "Cíntia Borges", "André Pinto", "Solange Reis",
  ];

  // ─── Criar diretores de aquário ──────────────────────────────────────────

  console.log("Criando diretores de aquário...");
  const diretoresAquario: DiretorAquario[] = [];

  for (const d of aquariosFixos) {
    diretoresAquario.push(await criarDiretorAquario(manager, d));
  }

  for (let i = 0; i < 15; i++) {
    const d = nomesAquario[i];
    const cpf = `${String(i + 5).padStart(3, "0")}.${String(i + 5).padStart(3, "0")}.${String(i + 5).padStart(3, "0")}-${String(i + 5).padStart(2, "0")}`;
    diretoresAquario.push(await criarDiretorAquario(manager, {
      cpf,
      nome: d.nome,
      email: `aquario${i + 3}@aquario.com`,
      senha: `Aqua@${String(i + 3).padStart(3, "0")}`,
      questão: "Nome da sua cidade natal?",
      resposta: `cidade${i}`,
      cor_tema: pick(todasCores, i),
      nome_aquario: d.aquario,
      anos_direção: (i % 20) + 1,
      certificacao_ambiental: d.cert,
    }));
  }

  // ─── Criar diretores de escola ───────────────────────────────────────────

  console.log("Criando diretores de escola...");
  const diretoresEscola: DiretorEscola[] = [];

  for (const d of escolasFixas) {
    diretoresEscola.push(await criarDiretorEscola(manager, d));
  }

  for (let i = 0; i < 15; i++) {
    const d = nomesEscola[i];
    const cpf = `${String(i + 50).padStart(3, "0")}.${String(i + 50).padStart(3, "0")}.${String(i + 50).padStart(3, "0")}-${String(i + 50).padStart(2, "0")}`;
    diretoresEscola.push(await criarDiretorEscola(manager, {
      cpf,
      nome: d.nome,
      email: `escola${i + 3}@escola.com`,
      senha: `Escola@${String(i + 3).padStart(3, "0")}`,
      questão: "Nome do seu animal favorito?",
      resposta: `animal${i}`,
      cor_tema: pick(todasCores, i + 5),
      nome_escola: d.escola,
      turno: d.turno,
    }));
  }

  // ─── Criar períodos de visita (2 por diretor de aquário) ─────────────────

  console.log("Criando períodos de visita...");
  const periodosVisita: PeriodoVisita[] = [];

  for (let i = 0; i < diretoresAquario.length; i++) {
    const dir = diretoresAquario[i];
    const nomeDir = i < aquariosFixos.length
      ? aquariosFixos[i].nome
      : nomesAquario[i - aquariosFixos.length].nome;

    for (let j = 0; j < 2; j++) {
      const tituloIdx = (i * 2 + j) % titulosPeriodo.length;
      const mes = 7 + Math.floor((i * 2 + j) % 6);
      const dia = 1 + ((i * 7 + j * 13) % 27);
      const pv = manager.create(PeriodoVisita, {
        título: titulosPeriodo[tituloIdx],
        categoria: (i + j) % 2 === 0 ? Categoria.SALGADA : Categoria.DOCE,
        nome_responsavel: nomeDir,
        inclui_transporte: (i + j) % 2 === 0,
        numero_tanques: 2 + ((i + j) % 8),
        date: `2026-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
        diretor_aquario: dir,
      });
      await manager.save(pv);
      periodosVisita.push(pv);
    }
  }

  // ─── Criar reservas (1 por diretor de escola, para períodos distintos) ───

  console.log("Criando reservas...");

  for (let i = 0; i < diretoresEscola.length; i++) {
    const dir = diretoresEscola[i];
    const pv = periodosVisita[i % periodosVisita.length];
    const reserva = manager.create(Reserva, {
      necessidade_pcd: i % 3 === 0,
      guia: guias[i % guias.length],
      n_alunos: 20 + (i * 3 % 30),
      horario: pick(todosHorarios, i),
      diretor_escola: dir,
      periodo_visita: pv,
    });
    await manager.save(reserva);
  }

  console.log("\n=== Seed concluído ===");
  console.log(`Diretores de Aquário: ${diretoresAquario.length} registros`);
  console.log(`Diretores de Escola:  ${diretoresEscola.length} registros`);
  console.log(`Períodos de Visita:   ${periodosVisita.length} registros`);
  console.log(`Reservas:             ${diretoresEscola.length} registros`);
  console.log("\nAcessos fixos:");
  console.log("  111.111.111-11 / Senha@123  (Carlos Mendes - AquaMundo)");
  console.log("  222.222.222-22 / Senha@456  (Fernanda Lima - Oceano Vivo)");
  console.log("  333.333.333-33 / Senha@789  (Ana Paula Souza - Escola Estadual)");
  console.log("  444.444.444-44 / Senha@000  (Roberto Alves - Colégio Federal)");

  await conn.close();
}

main().catch((err) => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
