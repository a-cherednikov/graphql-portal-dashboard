import { Args, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../../common/decorators';
import RolesEnum from '../../common/enum/roles.enum';
import MetricService from './metric.service';

@Resolver('Metric')
export default class MetricResolver {
  public constructor(private readonly metricService: MetricService) {}

  @Query()
  @Roles([RolesEnum.USER, RolesEnum.ADMIN])
  public metrics(
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number,
    @Args('scale') scale: 'day' | 'week' | 'month' | 'hour'
  ): Promise<any> {
    return this.metricService.aggregateMetrics(startDate, endDate, scale);
  }
}
