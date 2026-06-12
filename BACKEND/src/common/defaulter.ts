import {Injectable} from '@nestjs/common';

@Injectable()
export class Defaulter {
    private readonly DEFAULTER_ATTEMPTS = 3;

    isDefaulter(attempts: number): boolean {
        return attempts >= this.DEFAULTER_ATTEMPTS;
    }
}
