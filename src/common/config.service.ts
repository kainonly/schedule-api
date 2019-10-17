import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class ConfigService {
  private file: string;
  private config: any;

  constructor(target: string) {
    const directory = join(target, 'data');
    if (!existsSync(directory)) {
      mkdirSync(directory);
    }
    this.file = join(directory, 'config.json');
    if (!existsSync(this.file)) {
      writeFileSync(this.file, JSON.stringify({}));
    } else {
      this.config = JSON.parse(readFileSync(this.file).toString());
    }
  }

  /**
   * Get config data
   */
  get() {
    return this.config;
  }

  /**
   * Set config data
   * @param data
   */
  set(data: any) {
    writeFileSync(this.file, JSON.stringify(data));
    this.config = data;
  }
}
