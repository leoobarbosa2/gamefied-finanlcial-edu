import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getMe(user: {
        id: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        dailyGoalMins: number;
        streak: {
            currentStreak: number;
            longestStreak: number;
            lastActivityAt: Date | null;
        } | null;
    } | null>;
    update(user: {
        id: string;
    }, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        dailyGoalMins: number;
    }>;
    delete(user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
}
