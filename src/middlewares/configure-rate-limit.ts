import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerOptions: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // 60 seconds
      limit: 50, // 50 requests
      name: 'default',
      blockDuration: 60000, // 60 seconds
      skipIf: (context) => {
        const request = context.switchToHttp().getRequest();
        return request.headers['x-no-throttle'] === 'true';
      },
    },
  ],
};
