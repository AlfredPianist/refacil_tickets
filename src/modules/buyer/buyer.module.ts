import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BuyerController } from "./buyer.controller";
import { Buyer } from "./buyer.entity";
import { BuyerService } from "./buyer.service";

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  providers: [BuyerService],
  controllers: [BuyerController],
})
export class BuyerModule {}
