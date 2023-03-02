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

  async findAdminByUsername(username: string): Promise<Admin> {
    return this.adminRepository.findOneBy({ username });
  }

  async createAdmin(attrs: Partial<Admin>): Promise<Admin> {
    const admin = this.adminRepository.create(attrs);
    return this.adminRepository.save(admin);
  }

  async updateAdmin(id: string, attrs: Partial<Admin>): Promise<Admin> {
    const admin = await this.adminRepository.preload({
      id,
      ...attrs,
    });
    if (admin === undefined) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return this.adminRepository.save(admin);
  }

  async deleteAdmin(username: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ username });
    if (admin === null) {
      throw new NotFoundException(`Admin not found`);
    }
    return this.adminRepository.remove(admin);
  }
}
