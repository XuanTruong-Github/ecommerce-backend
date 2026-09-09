import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export type PaginationType = {
  page: number;
  limit: number;
  skip: number;
};

export const Pagination = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const page = Number(request.query.page) || 1;
  const limit = Number(request.query.limit) || 10;
  if (page < 1 || limit < 1) {
    throw new BadRequestException('Page and limit must be greater than 0');
  }
  const skip = (page - 1) * limit;
  return { page, limit, skip };
});
