import { Roles } from '@/infra/auth/decorators';
import { UserRole } from '@/infra/auth/enums';
import { JwtGuard } from '@/infra/auth/jwt.guard';
import { RoleGuard } from '@/infra/auth/role.guard';
import {
	Controller,
	Delete,
	NotImplementedException,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';

@UseGuards(JwtGuard, RoleGuard)
@Controller({
	path: 'admin/projects',
	version: '1',
})
export class ProjectAdminController {
	constructor() {}

	@Roles([UserRole.ADMIN])
	@Post()
	async create() {
		throw new NotImplementedException();
	}

	@Roles([UserRole.ADMIN])
	@Patch(':id')
	async update() {
		throw new NotImplementedException();
	}

	@Roles([UserRole.ADMIN])
	@Delete(':id')
	async remove() {
		throw new NotImplementedException();
	}
}
