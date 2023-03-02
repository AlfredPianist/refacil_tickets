import { Body, Controller, Post, Session, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { AuthService } from "./auth.service";
import { CreateAdminDto } from "./dtos/create-admin.dto";

@Controller("auth")
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async createUser(@Body() adminDto: CreateAdminDto, @Session() session: any) {
    const { username, password } = adminDto;
    const admin = await this.authService.signup(username, password);
    session.adminId = admin.id;
    return admin;
  }

  @Post("signin")
  async signin(@Body() adminDto: CreateAdminDto, @Session() session: any) {
    const { username, password } = adminDto;
    const admin = await this.authService.signin(username, password);
    session.adminId = admin.id;
    return admin;
  }

  @Post("signout")
  @UseGuards(AuthGuard)
  async signout(@Session() session: any) {
    session.adminId = null;
  }
}
