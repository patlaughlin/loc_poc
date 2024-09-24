import { Injectable } from '@nestjs/common';
import {
  LocationClient,
  SearchPlaceIndexForTextCommand,
  SearchPlaceIndexForTextCommandInput,
} from '@aws-sdk/client-location';

@Injectable()
export class AwsLocationService {
  private client: LocationClient;
  private placeIndexName = 'MyPlaceIndex';

  constructor() {
    this.client = new LocationClient({ region: process.env.AWS_REGION });
  }

  async searchPlace(query: string): Promise<any> {
    const params: SearchPlaceIndexForTextCommandInput = {
      IndexName: this.placeIndexName,
      Text: query,
      FilterCountries: ['USA'],
      MaxResults: 5,
    };

    try {
      const command = new SearchPlaceIndexForTextCommand(params);
      const response = await this.client.send(command);
      return response.Results;
    } catch (error) {
      console.error('Error searching place:', error);
      throw error;
    }
  }

  async geocodeZipCode(zipCode: string): Promise<any> {
    const params: SearchPlaceIndexForTextCommandInput = {
      IndexName: this.placeIndexName,
      Text: zipCode,
      FilterCountries: ['USA'],
      MaxResults: 1,
    };

    try {
      const command = new SearchPlaceIndexForTextCommand(params);
      const response = await this.client.send(command);
      if (response.Results && response.Results.length > 0) {
        const place = response.Results[0].Place;
        return {
          latitude: place.Geometry.Point[1], // [longitude, latitude]
          longitude: place.Geometry.Point[0],
          label: place.Label,
        };
      } else {
        throw new Error('Zip code not found');
      }
    } catch (error) {
      console.error('Error geocoding zip code:', error);
      throw error;
    }
  }

}
