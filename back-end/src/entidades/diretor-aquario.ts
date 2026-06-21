import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Usuário from "./usuário";
import PeriodoVisita from "./periodo-visita";

export enum CertificacaoAmbiental {
  NAO_POSSUI = "Não Possui",
  ESTADUAL = "Certificação Estadual",
  NACIONAL = "Certificação Nacional",
  INTERNACIONAL = "Certificação Internacional",
}

@Entity()
export default class DiretorAquario extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome_aquario: string;

  @Column()
  anos_direção: number;

  @Column({ type: "enum", enum: CertificacaoAmbiental })
  certificacao_ambiental: CertificacaoAmbiental;

  @OneToMany(
    () => PeriodoVisita,
    (periodo_visita) => periodo_visita.diretor_aquario,
  )
  periodo_visita: PeriodoVisita[];

  @OneToOne(() => Usuário, (usuário) => usuário.diretor_aquario, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
