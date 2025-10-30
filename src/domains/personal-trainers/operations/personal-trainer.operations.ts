import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { 
  CreatePersonalTrainerInput, 
  UpdatePersonalTrainerInput,
  CreatePersonalTrainingSessionInput,
  UpdatePersonalTrainingSessionInput 
} from '../inputs';

@Injectable()
export class PersonalTrainerOperations {
  constructor(private prisma: PrismaService) {}

  async createPersonalTrainer(input: CreatePersonalTrainerInput) {
    // Check if trainer with email already exists
    const existingTrainer = await this.prisma.personalTrainer.findUnique({
      where: { email: input.email },
    });

    if (existingTrainer) {
      throw new BadRequestException('Trainer with this email already exists');
    }

    return this.prisma.personalTrainer.create({
      data: input,
    });
  }

  async updatePersonalTrainer(id: string, input: UpdatePersonalTrainerInput) {
    const trainer = await this.prisma.personalTrainer.findUnique({
      where: { id },
    });

    if (!trainer) {
      throw new NotFoundException('Personal trainer not found');
    }

    return this.prisma.personalTrainer.update({
      where: { id },
      data: input,
    });
  }

  async deletePersonalTrainer(id: string) {
    const trainer = await this.prisma.personalTrainer.findUnique({
      where: { id },
    });

    if (!trainer) {
      throw new NotFoundException('Personal trainer not found');
    }

    return this.prisma.personalTrainer.delete({
      where: { id },
    });
  }

  async getAllPersonalTrainers() {
    return this.prisma.personalTrainer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPersonalTrainerById(id: string) {
    const trainer = await this.prisma.personalTrainer.findUnique({
      where: { id },
    });

    if (!trainer) {
      throw new NotFoundException('Personal trainer not found');
    }

    return trainer;
  }

  async createPersonalTrainingSession(userId: string, input: CreatePersonalTrainingSessionInput) {
    // Verify trainer exists
    const trainer = await this.prisma.personalTrainer.findUnique({
      where: { id: input.trainerId },
    });

    if (!trainer) {
      throw new NotFoundException('Personal trainer not found');
    }

    // Calculate price based on duration and hourly rate
    const price = (input.duration / 60) * trainer.hourlyRate;

    return this.prisma.personalTrainingSession.create({
      data: {
        userId,
        trainerId: input.trainerId,
        sessionDate: new Date(input.sessionDate),
        duration: input.duration,
        price,
        notes: input.notes,
      },
      include: { user: true, trainer: true },
    });
  }

  async updatePersonalTrainingSession(id: string, input: UpdatePersonalTrainingSessionInput) {
    const session = await this.prisma.personalTrainingSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Personal training session not found');
    }

    const updateData: any = { ...input };
    
    if (input.sessionDate) {
      updateData.sessionDate = new Date(input.sessionDate);
    }

    return this.prisma.personalTrainingSession.update({
      where: { id },
      data: updateData,
      include: { user: true, trainer: true },
    });
  }

  async getUserTrainingSessions(userId: string) {
    return this.prisma.personalTrainingSession.findMany({
      where: { userId },
      include: { trainer: true },
      orderBy: { sessionDate: 'desc' },
    });
  }

  async getAllTrainingSessions() {
    return this.prisma.personalTrainingSession.findMany({
      include: { user: true, trainer: true },
      orderBy: { sessionDate: 'desc' },
    });
  }

  async getTrainingSessionById(id: string) {
    const session = await this.prisma.personalTrainingSession.findUnique({
      where: { id },
      include: { user: true, trainer: true },
    });

    if (!session) {
      throw new NotFoundException('Personal training session not found');
    }

    return session;
  }

  async getTrainerSessions(trainerId: string) {
    return this.prisma.personalTrainingSession.findMany({
      where: { trainerId },
      include: { user: true },
      orderBy: { sessionDate: 'desc' },
    });
  }
}
