import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from '@lib/radarr-client/radarr-client.module-definition';
import { RadarrClientService } from '@lib/radarr-client/radarr-client.service';

@Module({
  providers: [RadarrClientService],
  exports: [RadarrClientService],
})
export class RadarrClientModule extends ConfigurableModuleClass {}
