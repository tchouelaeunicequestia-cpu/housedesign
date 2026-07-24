import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(projectDto: ProjectDto): Promise<Project> {
    const title = projectDto.title || projectDto.name || 'Untitled Project';
    const project = this.projectRepository.create({
      ...projectDto,
      title,
    });
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: number, projectDto: Partial<ProjectDto>): Promise<Project> {
    const project = await this.findOne(id);
    if (projectDto.name && !projectDto.title) {
      projectDto.title = projectDto.name;
    }
    Object.assign(project, projectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
    return { message: `Project #${id} deleted successfully` };
  }
}