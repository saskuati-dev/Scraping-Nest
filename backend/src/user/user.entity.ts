import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    is_adm: boolean;

     @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    

}