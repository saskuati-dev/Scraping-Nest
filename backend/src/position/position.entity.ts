import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;

  @Column()
  location: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  salary?: string;


  @Column({ type: 'timestamp with time zone' })
  post_date: Date;

  @Column({ unique: true })
  post_link: string;

  @Column('text', { array: true, nullable: true })
  skills?: string[];

  @Column('jsonb')
  rawPayload: any;
  
  @Column({ nullable: true })
  source: string;
}
