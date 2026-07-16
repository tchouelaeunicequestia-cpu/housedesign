import { ProjectService } from './project.service';
import { ProjectDto } from './dto/project.dto';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(projectDto: ProjectDto): Promise<import("./project.entity").Project>;
    findAll(): Promise<import("./project.entity").Project[]>;
}
