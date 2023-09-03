import { RadarrClientService } from '@app/radarr-client/radarr-client.service';
import { Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './radarr-client.module-definition';

@Module({
  providers: [RadarrClientService],
  exports: [RadarrClientService],
})
export class RadarrClientModule extends ConfigurableModuleClass {}
