import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = {
  title: 'Gym Management System API',
  description: 'API documentation for Gym Management System',
  version: '1.0',
  tags: [
    { name: 'auth', description: 'Authentication endpoints' },
    { name: 'members', description: 'Member management endpoints' },
    { name: 'admin', description: 'Admin management endpoints' },
    { name: 'memberships', description: 'Membership management endpoints' },
    { name: 'checkin', description: 'Check-in endpoints' },
    { name: 'notifications', description: 'Notification endpoints' },
    { name: 'personal-trainers', description: 'Personal trainer endpoints' },
  ],
};

export const createSwaggerDocument = (app: any) => {
  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth()
    .addTag('auth', swaggerConfig.tags[0].description)
    .addTag('members', swaggerConfig.tags[1].description)
    .addTag('admin', swaggerConfig.tags[2].description)
    .addTag('memberships', swaggerConfig.tags[3].description)
    .addTag('checkin', swaggerConfig.tags[4].description)
    .addTag('notifications', swaggerConfig.tags[5].description)
    .addTag('personal-trainers', swaggerConfig.tags[6].description)
    .build();

  return SwaggerModule.createDocument(app, config);
};
