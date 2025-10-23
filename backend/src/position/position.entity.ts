import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Position{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    position: string;

    @Column()
    location: string; //podemos mudar para link do maps depois

    @Column()
    salary: string;
    
    @Column()
    max_date_application: Date;

    @Column()
    post_date: Date;

    @Column()
    post_link: string;

    @Column("text",{ array: true })
    skills: string[];
}