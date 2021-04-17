import { MailService } from './../mail/mail.service';
import { JwtService } from './../jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { User } from './entities/user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './users.service';

describe('UserService', () => {
    let service: UserService;

    const mockRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    }

    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    }

    const mockMailService = {
        sendVerificationEmail: jest.fn(),
    }
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: MailService,
                    useValue: mockMailService,
                }
            ],
        }).compile();
        service = module.get<UserService>(UserService);
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it.todo('createAccount');
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
})