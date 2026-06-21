import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import DiretorAquario from "./diretor-aquario";
import Reserva from "./reserva";

export enum Categoria {
  DOCE = "agua_doce",
  SALGADA = "agua_salgada",
}

@Entity()
export default class PeriodoVisita extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  título: string;

  @Column({ type: "enum", enum: Categoria })
  categoria: Categoria;

  @Column()
  nome_responsavel: string;

  @Column()
  inclui_transporte: boolean;

  @Column()
  numero_tanques: number;

  @Column({ type: "date" })
  date: string;

  @ManyToOne(
    () => DiretorAquario,
    (diretor_aquario) => diretor_aquario.periodo_visita,
    {
      onDelete: "CASCADE",
    },
  )
  diretor_aquario: DiretorAquario;
  @OneToMany(() => Reserva, (reservas) => reservas.periodo_visita)
  reservas: Reserva[];
}
