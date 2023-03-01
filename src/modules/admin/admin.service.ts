import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./admin.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) {}

  async showAdmin(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (admin === null) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return admin;
  }

  async createAdmin(attrs: Partial<Admin>): Promise<Admin> {
    const admin = this.adminRepository.create(attrs);
    return this.adminRepository.save(admin);
  }

  async updateAdmin(id: number, attrs: Partial<Admin>): Promise<Admin> {
    const admin = await this.adminRepository.preload({
      id,
      ...attrs,
    });
    if (admin === undefined) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return this.adminRepository.save(admin);
  }

  async deleteAdmin(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (admin === null) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return this.adminRepository.remove(admin);
  }
}
