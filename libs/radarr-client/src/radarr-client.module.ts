import { Module } from '@nestjs/common';

import { RadarrClientService } from '@lib/radarr-client/radarr-client.service';

import { ConfigurableModuleClass } from './radarr-client.module-definition';

@Module({
  providers: [RadarrClientService],
  exports: [RadarrClientService],
})
export class RadarrClientModule extends ConfigurableModuleClass {}
