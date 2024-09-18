import { Module } from '@nestjs/common';
import { AwsLocationService } from './aws-location/aws-location.service';
import { PlacesController } from './places/places.controller';

@Module({
  imports: [],
  controllers: [PlacesController],
  providers: [AwsLocationService],
})
export class AppModule {}
