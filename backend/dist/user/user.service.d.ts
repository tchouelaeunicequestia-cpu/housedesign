import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/user.dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    register(dto: RegisterUserDto): Promise<Omit<User, 'passwordHash'>>;
    findByUsername(username: string): Promise<User | null>;
}
