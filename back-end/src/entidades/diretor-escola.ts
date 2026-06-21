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
import Reserva from "./reserva";
export enum Turno {
  NOTURNO = "noturno",
  VESPERTINO = "vespertino",
  MATUTINO = "matutino",
}
@Entity()
export default class DiretorEscola extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome_escola: string;

  @Column({ type: "enum", enum: Turno })
  turno: Turno;

  @OneToMany(() => Reserva, (reserva) => reserva.diretor_escola)
  reservas: Reserva[];

  @OneToOne(() => Usuário, (usuário) => usuário.diretor_escola, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  usuário: Usuário;
}
