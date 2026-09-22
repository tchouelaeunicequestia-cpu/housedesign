import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';

@ApiTags('appointments')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Book an appointment / rendezvous (Public)' })
  @ApiResponse({ status: 201, description: 'Appointment successfully booked.' })
  create(@Body() createDto: CreateAppointmentDto) {
    return this.appointmentService.create(createDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all appointments (Admin Only)' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment details by ID (Admin Only)' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment status (Admin Only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentService.updateStatus(id, updateDto.status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an appointment (Admin Only)' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
