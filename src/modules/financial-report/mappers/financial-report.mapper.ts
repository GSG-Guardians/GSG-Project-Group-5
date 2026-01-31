import { FinancialInsight as FinancialInsightEntity } from '../../../../database/entities/financial-insight.entities';
import { FinancialInsight } from '../dto/response.dto';

export function toFinancialInsightResponse(
  insight: FinancialInsightEntity,
): FinancialInsight {
  return {
    type: insight.insight_type,
    title: insight.title,
    message: insight.message,
    isRead: insight.is_read,
  };
}
