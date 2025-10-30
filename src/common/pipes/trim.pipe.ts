import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (typeof value === 'object' && value !== null) {
      const trimmedValue = { ...value };
      for (const key in trimmedValue) {
        if (typeof trimmedValue[key] === 'string') {
          trimmedValue[key] = trimmedValue[key].trim();
        }
      }
      return trimmedValue;
    }
    
    return value;
  }
}
