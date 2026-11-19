import { Test, TestingModule } from '@nestjs/testing';
import { AiAgentService } from './ai-agent.service';
import { AiContentService } from '../ai-content/ai-content.service';
import { AiTextService } from '../ai-content/ai-text.service';

describe('AiAgentService', () => {
  let service: AiAgentService;
  const content = { generateWeeklyContent: jest.fn(), generateProjectStory: jest.fn() };
  const ai = { isEnabled: false };

  const build = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAgentService,
        { provide: AiContentService, useValue: content },
        { provide: AiTextService, useValue: ai },
      ],
    }).compile();
    service = module.get<AiAgentService>(AiAgentService);
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    ai.isEnabled = false;
    await build();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('skips the AI routines when no AI key is configured', async () => {
    await service.runWeeklyRoutine();
    await service.handleProjectCompletedEvent({
      projectId: '1',
      projectTitle: 'Test project',
      notes: 'Completed project notes',
    });

    expect(content.generateWeeklyContent).not.toHaveBeenCalled();
    expect(content.generateProjectStory).not.toHaveBeenCalled();
  });

  it('writes a draft story when a project is completed and the AI is configured', async () => {
    ai.isEnabled = true;
    await service.handleProjectCompletedEvent({ projectId: '7', projectTitle: 'Villa', notes: 'Done' });
    expect(content.generateProjectStory).toHaveBeenCalledWith(7);
  });

  it('does not crash when the AI fails', async () => {
    ai.isEnabled = true;
    content.generateProjectStory.mockRejectedValue(new Error('boom'));
    await expect(
      service.handleProjectCompletedEvent({ projectId: '7', projectTitle: 'Villa', notes: 'Done' }),
    ).resolves.toBeUndefined();
  });
});
