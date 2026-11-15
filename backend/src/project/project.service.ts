import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectDto } from './dto/project.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(projectDto: ProjectDto): Promise<Project> {
    const rawTitle = projectDto.title || projectDto.name || 'Untitled Project';
    const rawDescription = projectDto.description || '';

    const project = this.projectRepository.create({
      ...projectDto,
      title: rawTitle,
      description: rawDescription,
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
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const previousStatus = project.status;

    if (projectDto.name && !projectDto.title) {
      projectDto.title = projectDto.name;
    }

    Object.assign(project, projectDto);
    const updatedProject = await this.projectRepository.save(project);

    // Check if status changed to COMPLETED
    if (projectDto.status && projectDto.status.toUpperCase() === 'COMPLETED' && previousStatus?.toUpperCase() !== 'COMPLETED') {
      this.eventEmitter.emit('project.completed', {
        projectId: id.toString(),
        projectTitle: updatedProject.title,
        notes: updatedProject.description,
      });
    }

    return updatedProject;
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.projectRepository.remove(project);
    return { message: `Project #${id} deleted successfully` };
  }
}