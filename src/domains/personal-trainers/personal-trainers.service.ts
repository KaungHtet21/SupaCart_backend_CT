import { Injectable } from '@nestjs/common';
import { PersonalTrainerOperations } from './operations';
import { 
  CreatePersonalTrainerInput, 
  UpdatePersonalTrainerInput,
  CreatePersonalTrainingSessionInput,
  UpdatePersonalTrainingSessionInput 
} from './inputs';

@Injectable()
export class PersonalTrainersService {
  constructor(private personalTrainerOperations: PersonalTrainerOperations) {}

  // Personal Trainer methods
  async createPersonalTrainer(input: CreatePersonalTrainerInput) {
    return this.personalTrainerOperations.createPersonalTrainer(input);
  }

  async updatePersonalTrainer(id: string, input: UpdatePersonalTrainerInput) {
    return this.personalTrainerOperations.updatePersonalTrainer(id, input);
  }

  async deletePersonalTrainer(id: string) {
    return this.personalTrainerOperations.deletePersonalTrainer(id);
  }

  async getAllPersonalTrainers() {
    return this.personalTrainerOperations.getAllPersonalTrainers();
  }

  async getPersonalTrainerById(id: string) {
    return this.personalTrainerOperations.getPersonalTrainerById(id);
  }

  // Personal Training Session methods
  async createPersonalTrainingSession(userId: string, input: CreatePersonalTrainingSessionInput) {
    return this.personalTrainerOperations.createPersonalTrainingSession(userId, input);
  }

  async updatePersonalTrainingSession(id: string, input: UpdatePersonalTrainingSessionInput) {
    return this.personalTrainerOperations.updatePersonalTrainingSession(id, input);
  }

  async getUserTrainingSessions(userId: string) {
    return this.personalTrainerOperations.getUserTrainingSessions(userId);
  }

  async getAllTrainingSessions() {
    return this.personalTrainerOperations.getAllTrainingSessions();
  }

  async getTrainingSessionById(id: string) {
    return this.personalTrainerOperations.getTrainingSessionById(id);
  }

  async getTrainerSessions(trainerId: string) {
    return this.personalTrainerOperations.getTrainerSessions(trainerId);
  }
}
