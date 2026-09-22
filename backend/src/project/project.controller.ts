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
  Query,
  Headers,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectDto } from './dto/project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project with auto-translation (Admin Only)' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  create(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all architectural projects (Public Showcase)' })
  @ApiQuery({ name: 'locale', required: false, description: 'Locale language code (en or fr)' })
  findAll(
    @Query('locale') queryLocale?: string,
    @Headers('accept-language') headerLocale?: string,
  ) {
    const locale = queryLocale || headerLocale;
    return this.projectService.findAll(locale);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single project by ID' })
  @ApiQuery({ name: 'locale', required: false, description: 'Locale language code (en or fr)' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('locale') queryLocale?: string,
    @Headers('accept-language') headerLocale?: string,
  ) {
    const locale = queryLocale || headerLocale;
    return this.projectService.findOne(id, locale);
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