import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(registerUserDto: RegisterUserDto): Promise<Omit<import("./user.entity").User, "passwordHash">>;
}
