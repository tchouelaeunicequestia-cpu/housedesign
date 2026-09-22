import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '../appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  appointmentDate!: string;

  @IsString()
  @IsOptional()
  serviceType?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status!: AppointmentStatus;
}
