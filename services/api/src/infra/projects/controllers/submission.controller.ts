import { Controller } from '@nestjs/common';

@Controller({
	path: 'projects/:project-id/submissions',
	version: '1',
})
export class ProjectSubmissionController {}
