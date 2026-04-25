import { Controller } from '@nestjs/common';

@Controller({
	path: 'projects/:project-id/progress',
	version: '1',
})
export class ProjectProgressController {}
