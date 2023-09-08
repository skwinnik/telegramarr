import { Test, TestingModule } from '@nestjs/testing';

import { RadarrClientService } from '@lib/radarr-client/radarr-client.service';

describe('RadarrClientService', () => {
  let service: RadarrClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadarrClientService],
    }).compile();

    service = module.get<RadarrClientService>(RadarrClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
