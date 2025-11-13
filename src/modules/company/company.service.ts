import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCompany } from './dto/update-company.dto';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './entities/company.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findOne(userId: Types.ObjectId) {
    let company = await this.companyModel.findOne({ userId });

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async update(userId: Types.ObjectId, updateCompanyDto: UpdateCompany) {
    const company = await this.companyModel.findOne({ userId });

    if (!company) {
      const company = new this.companyModel({
        userId,
        ...updateCompanyDto,
      });
      await company.save();
      return company;
    }

    return this.companyModel.findByIdAndUpdate(company._id, updateCompanyDto);
  }
}
