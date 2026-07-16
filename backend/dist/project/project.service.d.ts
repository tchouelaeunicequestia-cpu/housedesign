import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectDto } from './dto/project.dto';
export declare class ProjectService {
    private readonly projectRepository;
    constructor(projectRepository: Repository<Project>);
    create(projectDto: ProjectDto): Promise<Project>;
    findAll(): Promise<Project[]>;
}
