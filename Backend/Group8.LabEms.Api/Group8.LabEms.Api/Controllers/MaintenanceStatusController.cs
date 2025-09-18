using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceStatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaintenanceStatusController(AppDbContext context) => _context = context;

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceStatusModel>>> GetMaintenanceStatuses()
            => await _context.MaintenanceStatuses.ToListAsync();

        
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceStatusModel>> GetMaintenanceStatus(int id)
        {
            var maintenanceStatus = await _context.MaintenanceStatuses.FindAsync(id);

            if (maintenanceStatus == null)
                return NotFound();

            return maintenanceStatus;
        }

        [HttpPost]
        public async Task<ActionResult<MaintenanceStatusModel>> CreateMaintenanceStatus(MaintenanceStatusModel maintenanceStatus)
        {
            _context.MaintenanceStatuses.Add(maintenanceStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenanceStatus), new { id = maintenanceStatus.MaintenanceStatusId }, maintenanceStatus);
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenanceStatus(int id, MaintenanceStatusModel maintenanceStatus)
        {
            if (id != maintenanceStatus.MaintenanceStatusId)
                return BadRequest();

            _context.Entry(maintenanceStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceStatusExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenanceStatus(int id)
        {
            var maintenanceStatus = await _context.MaintenanceStatuses.FindAsync(id);
            if (maintenanceStatus == null)
                return NotFound();

            _context.MaintenanceStatuses.Remove(maintenanceStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceStatusExists(int id)
        {
            return _context.MaintenanceStatuses.Any(ms => ms.MaintenanceStatusId == id);
        }
    }
}
