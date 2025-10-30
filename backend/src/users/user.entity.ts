import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  VOTER = 'voter',
  CANDIDATE = 'candidate', 
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true, name: 'first_name' })
  first_name?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true, name: 'last_name' })
  last_name?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VOTER
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
