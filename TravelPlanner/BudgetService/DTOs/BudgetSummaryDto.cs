namespace BudgetService.DTOs
{
    public class BudgetSummaryDto
    {
        public decimal PlannedBudget { get; set; }
        public decimal Spent { get; set; }
        public decimal Remaining {  get; set; }

    }
}
