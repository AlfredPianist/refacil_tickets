import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { Admin } from "./admin.entity";
import { AdminService } from "./admin.service";
import { AuthService } from "./auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, AuthService],
  controllers: [AdminController],
})
export class AdminModule {}
