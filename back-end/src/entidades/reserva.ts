import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import DiretorEscola from "./diretor-escola";
import PeriodoVisita from "./periodo-visita";
export enum Horario {
  H08_09 = "08:00 - 09:00",
  H09_10 = "09:00 - 10:00",
  H10_11 = "10:00 - 11:00",
  H11_12 = "11:00 - 12:00",
  H12_13 = "12:00 - 13:00",
  H13_14 = "13:00 - 14:00",
  H14_15 = "14:00 - 15:00",
  H15_16 = "15:00 - 16:00",
  H16_17 = "16:00 - 17:00",
  H17_18 = "17:00 - 18:00",
}
@Entity()
export default class Reserva extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  necessidade_pcd: boolean;

  @Column()
  guia: String;

  @Column()
  n_alunos: number;

  @Column()
  horario: Horario;

  @ManyToOne(() => PeriodoVisita, (periodo_visita) => periodo_visita.reservas, {
    onDelete: "CASCADE",
  })
  periodo_visita: PeriodoVisita;
  @ManyToOne(() => DiretorEscola, (diretor_escola) => diretor_escola.reservas, {
    onDelete: "CASCADE",
  })
  diretor_escola: DiretorEscola;
}
