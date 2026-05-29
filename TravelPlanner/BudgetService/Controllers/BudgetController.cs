using BudgetService.DTOs;
using Microsoft.AspNetCore.Mvc;


namespace BudgetService.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetBudgetSummary(decimal plannedBudget, decimal spent)
        {
            var result = new BudgetSummaryDto
            {
                PlannedBudget = plannedBudget,
                Spent = spent,
                Remaining = plannedBudget - spent
            };

            return Ok(result);
        }
    }
}
