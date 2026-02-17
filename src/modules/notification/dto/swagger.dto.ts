import { ApiProperty } from '@nestjs/swagger';

export class RegisterPushTokenRequestSwaggerDto {
  @ApiProperty({ example: 'fCMDeviceTokenExample1234567890' })
  token: string;

  @ApiProperty({ example: 'web' })
  platform: string;
}

export class RemovePushTokenRequestSwaggerDto {
  @ApiProperty({ example: 'fCMDeviceTokenExample1234567890' })
  token: string;
}

export class PushTokenActionResponseSwaggerDto {
  @ApiProperty({ example: true })
  success: boolean;
}
