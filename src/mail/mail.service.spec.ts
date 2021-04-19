import { CONFIG_OPTIONS } from './../common/common.constant';
import { Test } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';


describe('MailService', () => {
    let service: MailService;

    beforeEach(async () => {
        let module = await Test.createTestingModule({
            providers: [MailService, {
                provide: CONFIG_OPTIONS,
                useValue: {
                    domain: 'test-apiKey',
                    apiKey: 'test-domain',
                    fromEmail: 'test-fromEmail',
                },
            },
            ],
        }).compile();
        service = module.get<MailService>(MailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('sendVerificationEmail', () => {
        it('should call sendEmail', () => {
            const sendVerificationEmailArgs = {
                email: 'email',
                code: 'code',
            };
            jest.spyOn(service, 'sendEmail').mockImplementation(async () => { });
            service.sendVerificationEmail(
                sendVerificationEmailArgs.email,
                sendVerificationEmailArgs.code,
            );
            expect(service.sendEmail).toHaveBeenCalledTimes(1);
            expect(service.sendEmail).toHaveBeenCalledWith(
                'Verify Your Email',
                'verify-email',
                [
                    { key: 'code', value: sendVerificationEmailArgs.code },
                    { key: 'username', value: sendVerificationEmailArgs.email },
                ],
            );
        });
    });
    it.todo('sendVerifificaionEmail');
});