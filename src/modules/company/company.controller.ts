import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompany } from './dto/update-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('company')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findOne(@Request() req) {
    return this.companyService.findOne(req.user._id);
  }

  @Patch()
  update(@Request() req, @Body() updateCompanyDto: UpdateCompany) {
    return this.companyService.update(req.user._id, updateCompanyDto);
  }
}
