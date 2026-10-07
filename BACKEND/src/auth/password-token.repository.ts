import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class PasswordTokenRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createToken(userId: string): Promise<string> {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

        await this.prisma.passwordResetToken.create({
            data: { userId, token, expiresAt },
        });

        return token;
    }

    async consumeToken(token: string): Promise<{ userId: string } | null> {
        return await this.prisma.$transaction(async (tx) => {
            const found = await tx.passwordResetToken.findUnique({ where: { token } });

            if (!found) return null;
            if (found.usedAt) return null;
            if (found.expiresAt < new Date()) return null;

            const result = await tx.passwordResetToken.updateMany({
                where: { token, usedAt: null },
                data: { usedAt: new Date() },
            });

            if (result.count === 0) return null;

            return { userId: found.userId };
        });
    }
}
