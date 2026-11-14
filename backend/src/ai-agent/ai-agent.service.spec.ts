import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { AiAgentService } from './ai-agent.service';
import { UserService } from '../user/user.service';
import { AssetService } from '../asset/asset.service';

describe('AiAgentService', () => {
  let service: AiAgentService;
  const mailerService = { sendMail: jest.fn() };
  const userService = { findAll: jest.fn() };
  const assetService = { create: jest.fn() };
  const configService = { get: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    configService.get.mockReturnValue(undefined);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAgentService,
        { provide: MailerService, useValue: mailerService },
        { provide: UserService, useValue: userService },
        { provide: AssetService, useValue: assetService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AiAgentService>(AiAgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('skips AI routines when OPENAI_API_KEY is missing', async () => {
    await service.generateDailyIndustryTip();
    await service.handleProjectCompletedEvent({
      projectId: 'project-1',
      projectTitle: 'Test project',
      notes: 'Completed project notes',
    });

    expect(assetService.create).not.toHaveBeenCalled();
    expect(mailerService.sendMail).not.toHaveBeenCalled();
  });

  it('treats the dummy-key placeholder as unconfigured', async () => {
    configService.get.mockReturnValue('dummy-key');
    const module = await Test.createTestingModule({
      providers: [
        AiAgentService,
        { provide: MailerService, useValue: mailerService },
        { provide: UserService, useValue: userService },
        { provide: AssetService, useValue: assetService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get<AiAgentService>(AiAgentService);

    await service.generateDailyIndustryTip();

    expect(assetService.create).not.toHaveBeenCalled();
    expect(mailerService.sendMail).not.toHaveBeenCalled();
  });
});
