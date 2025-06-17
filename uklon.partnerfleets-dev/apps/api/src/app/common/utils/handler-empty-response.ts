import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const handleEmptyResponse =
  (res: Response) =>
  <T>(data: T): void => {
    if (data === null) {
      res.status(HttpStatus.NO_CONTENT).send();
    } else {
      res.status(HttpStatus.OK).json(data);
    }
  };
