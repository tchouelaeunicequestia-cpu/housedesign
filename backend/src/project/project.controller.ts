import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './dto/project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project (Admin Only)' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  create(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all architectural projects (Public Showcase)' })
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing project (Admin Only)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() projectDto: Partial<ProjectDto>,
  ) {
    return this.projectService.update(id, projectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project (Admin Only)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }
}