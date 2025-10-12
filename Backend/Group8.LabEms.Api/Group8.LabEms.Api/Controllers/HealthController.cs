using Microsoft.AspNetCore.Mvc;

namespace Group8.LabEms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get() { return Ok(new { status = "Healthy" }); }
    }
}
