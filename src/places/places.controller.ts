import { BadRequestException, Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { AwsLocationService } from '../aws-location/aws-location.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly awsLocationService: AwsLocationService) {
  }

  @Get('autocomplete')
  async autocomplete(@Query('q') query: string) {
    if (!query || query.length < 3) {
      return [];
    }
    try {
      const results = await this.awsLocationService.searchPlace(query);
      return results.map((result: { Place: any }) => {
        const place = result.Place;
        return {
          label: place.Label,
          city: place.Municipality,
          state: place.Region,
          country: place.Country,
          coordinates: {
            latitude: place.Geometry.Point[1], // [longitude, latitude]
            longitude: place.Geometry.Point[0],
          },
        };
      });
    } catch (error) {
      console.error('Error in autocomplete:', error);
      throw error;
    }
  }

  @Get('geocode')
  async geocode(@Query('zipCode') zipCode: string) {
    if (!zipCode) {
      throw new BadRequestException('Zip code is required');
    }
    try {
      return await this.awsLocationService.geocodeZipCode(zipCode);
    } catch (error) {
      console.error('Error in geocode:', error);
      throw new NotFoundException('Location not found');
    }
  }
}
