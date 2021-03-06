import { MetricsChannels } from '@graphql-portal/types';
import IBaseResolverData from './base-resolver-data.interface';

export default interface IResolverDone extends IBaseResolverData {
  event: MetricsChannels.RESOLVER_DONE;
  result: any;
}
