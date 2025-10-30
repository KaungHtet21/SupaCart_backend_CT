import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  Request 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PersonalTrainersService } from './personal-trainers.service';
import { 
  CreatePersonalTrainerDto, 
  UpdatePersonalTrainerDto,
  CreatePersonalTrainingSessionDto,
  UpdatePersonalTrainingSessionDto,
  PersonalTrainerResponseDto,
  PersonalTrainingSessionResponseDto
} from './dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('personal-trainers')
@Controller('personal-trainers')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PersonalTrainersController {
  constructor(private personalTrainersService: PersonalTrainersService) {}

  // Personal Trainer endpoints
  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new personal trainer (Admin only)' })
  @ApiResponse({ status: 201, description: 'Personal trainer created successfully', type: PersonalTrainerResponseDto })
  async createPersonalTrainer(@Body() createTrainerDto: CreatePersonalTrainerDto) {
    return this.personalTrainersService.createPersonalTrainer(createTrainerDto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a personal trainer (Admin only)' })
  @ApiResponse({ status: 200, description: 'Personal trainer updated successfully', type: PersonalTrainerResponseDto })
  async updatePersonalTrainer(
    @Param('id') id: string,
    @Body() updateTrainerDto: UpdatePersonalTrainerDto,
  ) {
    return this.personalTrainersService.updatePersonalTrainer(id, updateTrainerDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a personal trainer (Admin only)' })
  @ApiResponse({ status: 200, description: 'Personal trainer deleted successfully' })
  async deletePersonalTrainer(@Param('id') id: string) {
    return this.personalTrainersService.deletePersonalTrainer(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active personal trainers' })
  @ApiResponse({ status: 200, description: 'Personal trainers retrieved successfully', type: [PersonalTrainerResponseDto] })
  async getAllPersonalTrainers() {
    return this.personalTrainersService.getAllPersonalTrainers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a personal trainer by ID' })
  @ApiResponse({ status: 200, description: 'Personal trainer retrieved successfully', type: PersonalTrainerResponseDto })
  async getPersonalTrainerById(@Param('id') id: string) {
    return this.personalTrainersService.getPersonalTrainerById(id);
  }

  // Personal Training Session endpoints
  @Post('sessions')
  @ApiOperation({ summary: 'Book a personal training session' })
  @ApiResponse({ status: 201, description: 'Training session booked successfully', type: PersonalTrainingSessionResponseDto })
  async createPersonalTrainingSession(
    @Request() req,
    @Body() createSessionDto: CreatePersonalTrainingSessionDto,
  ) {
    return this.personalTrainersService.createPersonalTrainingSession(req.user.sub, createSessionDto);
  }

  @Put('sessions/:id')
  @ApiOperation({ summary: 'Update a personal training session' })
  @ApiResponse({ status: 200, description: 'Training session updated successfully', type: PersonalTrainingSessionResponseDto })
  async updatePersonalTrainingSession(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdatePersonalTrainingSessionDto,
  ) {
    return this.personalTrainersService.updatePersonalTrainingSession(id, updateSessionDto);
  }

  @Get('sessions/my')
  @ApiOperation({ summary: 'Get current user training sessions' })
  @ApiResponse({ status: 200, description: 'User training sessions retrieved successfully', type: [PersonalTrainingSessionResponseDto] })
  async getUserTrainingSessions(@Request() req) {
    return this.personalTrainersService.getUserTrainingSessions(req.user.sub);
  }

  @Get('sessions')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all training sessions (Admin only)' })
  @ApiResponse({ status: 200, description: 'All training sessions retrieved successfully', type: [PersonalTrainingSessionResponseDto] })
  async getAllTrainingSessions() {
    return this.personalTrainersService.getAllTrainingSessions();
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get a training session by ID' })
  @ApiResponse({ status: 200, description: 'Training session retrieved successfully', type: PersonalTrainingSessionResponseDto })
  async getTrainingSessionById(@Param('id') id: string) {
    return this.personalTrainersService.getTrainingSessionById(id);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get sessions for a specific trainer' })
  @ApiResponse({ status: 200, description: 'Trainer sessions retrieved successfully', type: [PersonalTrainingSessionResponseDto] })
  async getTrainerSessions(@Param('id') trainerId: string) {
    return this.personalTrainersService.getTrainerSessions(trainerId);
  }
}
