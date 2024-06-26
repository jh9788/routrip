import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./places.model";
import { RouteDays } from "./routeDays.model";

@Entity()
export class DaySeq {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne((type) => RouteDays, { onDelete: "CASCADE" })
  routeDay!: RouteDays;

  @Column({ type: "integer" })
  seq!: number;

  @ManyToOne(() => Places, { eager: true })
  place!: Places;
}
