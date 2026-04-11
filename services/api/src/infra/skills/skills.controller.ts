import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller({
	path: 'skills',
	version: '1',
})
export class SkillsController {
	constructor() {}

	@Get(':id')
	async findById() {}

	@Post()
	async create() {}

	@Patch(':id')
	async update() {}

	@Delete(':id')
	async remove() {}

	@Get('prerequisite-graph')
	async getPrerequisiteGraph() {}

	@Get(':id/prerequisities')
	async listPrerequisities() {}

	@Get(':id/next-steps')
	async listNextSteps() {}

	@Post('next-steps')
	async addNextStep() {}

	@Get(':id/children')
	async listChildren() {}

	@Post('children')
	async addChild() {}
}
