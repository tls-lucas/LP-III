import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import DiretorEscola from "./diretor-escola";
import DiretorAquario from "./diretor-aquario";
export enum Perfil {
  DIRETOR_AQUARIO = "diretor_aquario",
  DIRETOR_ESCOLA = "diretor_escola",
}
export enum Status {
  PENDENTE = "pendente",
  ATIVO = "ativo",
}
export enum Cores {
  AMARELO = "yellow",
  ANIL = "indigo",
  AZUL = "blue",
  AZUL_PISCINA = "cyan",
  CINZA_ESCURO = "bluegray",
  LARANJA = "orange",
  ROSA = "pink",
  ROXO = "purple",
  VERDE = "green",
  VERDE_AZULADO = "teal",
}
@Entity()
export default class Usuário extends BaseEntity {
  @PrimaryColumn()
  cpf: string;
  @Column({ type: "enum", enum: Perfil })
  perfil: Perfil;
  @Column({ type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;
  @Column()
  nome: string;
  @Column()
  email: string;
  @Column()
  senha: string;
  @Column()
  questão: string;
  @Column()
  resposta: string;
  @Column({ type: "enum", enum: Cores })
  cor_tema: string;
  @OneToOne(() => DiretorAquario, (diretor_aquario) => diretor_aquario.usuário)
  diretor_aquario: DiretorAquario;
  @OneToOne(() => DiretorEscola, (diretor_escola) => diretor_escola.usuário)
  diretor_escola: DiretorEscola;
  @CreateDateColumn()
  data_criação: Date;
}
