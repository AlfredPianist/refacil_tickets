import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Admin } from "./modules/admin/admin.entity";
import { AdminModule } from "./modules/admin/admin.module";
import { Buyer } from "./modules/buyer/buyer.entity";
import { BuyerModule } from "./modules/buyer/buyer.module";
import { Event } from "./modules/event/event.entity";
import { EventModule } from "./modules/event/event.module";
import { Ticket } from "./modules/ticket/ticket.entity";
import { TicketModule } from "./modules/ticket/ticket.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "postgres",
      database: "tickets",
      entities: [Admin, Buyer, Event, Ticket],
      synchronize: true,
      logging: true
    }),
    AdminModule,
    BuyerModule,
    EventModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
