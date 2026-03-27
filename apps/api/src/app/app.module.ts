import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { HealthController } from './health.controller';
import { InfrastructureModule } from './infrastructure.module';

@Module({
  imports: [InfrastructureModule, AuthModule, FilesModule],
  controllers: [HealthController],
})
export class AppModule {}
