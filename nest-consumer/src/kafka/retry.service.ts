import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  async retry<T>(
    fn: () => Promise<T>,
    retries: number = 5,
    delayMs: number = 1000,
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt < retries) {
          this.logger.warn(`Attempt ${attempt} failed. Retrying in ${delayMs}ms...`);
          await new Promise(res => setTimeout(res, delayMs));
        } else {
          this.logger.error(`Attempt ${attempt} failed. No more retries.`);
          throw error;
        }
      }
    }
  }
}
