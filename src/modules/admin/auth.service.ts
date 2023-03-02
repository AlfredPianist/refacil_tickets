import { BadRequestException, Injectable } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly adminService: AdminService) {}

  async signup(username: string, password: string) {
    const admin = await this.adminService.findAdminByUsername(username);
    if (admin !== null) {
      throw new BadRequestException("Username taken");
    }

    const salt = randomBytes(8).toString("hex");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const encryptedPassword = `${salt}.${hash.toString("hex")}`;

    const newAdmin = this.adminService.createAdmin({
      username,
      password: encryptedPassword,
    });

    return newAdmin;
  }

  async signin(username: string, password: string) {
    const admin = await this.adminService.findAdminByUsername(username);
    if (admin === null) {
      throw new BadRequestException("User not found");
    }

    const [salt, storedHash] = admin.password.split(".");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString("hex") !== storedHash) {
      throw new BadRequestException("Password incorrect");
    }

    return admin;
  }
}
