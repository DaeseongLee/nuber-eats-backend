import { User } from './user.entity';
import { BeforeInsert, Column, JoinColumn, OneToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity } from 'typeorm';
import { InputType, ObjectType, Field } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
    @Field(type => String)
    @Column()
    code: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode(): void {
        this.code = uuidv4();
    }
}