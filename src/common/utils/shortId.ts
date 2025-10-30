import { nanoid } from 'nanoid';

export const generateShortId = (length: number = 8): string => {
  return nanoid(length);
};

export const generateMemberId = (): string => {
  return `MEM-${nanoid(8).toUpperCase()}`;
};

export const generateCheckInId = (): string => {
  return `CHK-${nanoid(8).toUpperCase()}`;
};
