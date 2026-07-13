import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './dto/project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('projects')
@ApiBearerAuth() // Adds the Authorize padlock icon to this controller in Swagger
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // Restricts project creation to logged-in admins
  @ApiOperation({ summary: 'Create a new project (Admin Only)' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  create(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all architectural projects (Public Showcase)' })
  @ApiResponse({ status: 200, description: 'Return all architectural projects.' })
  findAll() {
    return this.projectService.findAll();
  }
}