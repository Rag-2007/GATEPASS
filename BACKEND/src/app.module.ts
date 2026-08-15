import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HostelModule } from './hostel/hostel.module';
import { StudentModule } from './student/student.module';
import { PassesModule } from './passes/passes.module';
import { BlockedModule } from './blocked/blocked.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        HostelModule,
        StudentModule,
        PassesModule ,
        BlockedModule,
        PrismaModule
    ],
})
export class AppModule {}
