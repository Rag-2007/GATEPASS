import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ParentTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createToken(passId: string): Promise<string> {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

        await this.prisma.parentApprovalToken.upsert({
            where: { passId },
            update: { token, expiresAt, usedAt: null },
            create: { passId, token, expiresAt },
        });

        return token;
    }

    async consumeToken(token: string): Promise<{ passId: string } | null> {
        return await this.prisma.$transaction(async (tx) => {
            const found = await tx.parentApprovalToken.findUnique({ where: { token } });

            if (!found) return null;
            if (found.usedAt) return null;
            if (found.expiresAt < new Date()) return null;

            const result = await tx.parentApprovalToken.updateMany({
                where: { token, usedAt: null },
                data: { usedAt: new Date() },
            });

            if (result.count === 0) return null;

            return { passId: found.passId };
        });
    }
}
