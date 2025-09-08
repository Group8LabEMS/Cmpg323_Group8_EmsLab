using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaintenanceController(AppDbContext context) => _context = context;

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceModel>>> GetMaintenances()
            => await _context.Maintenances
                .Include(m => m.Equipment)
                .Include(m => m.MaintenanceType)
                .Include(m => m.MaintenanceStatus)
                .ToListAsync();

        
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceModel>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances
                .Include(m => m.Equipment)
                .Include(m => m.MaintenanceType)
                .Include(m => m.MaintenanceStatus)
                .FirstOrDefaultAsync(m => m.MaintenanceId == id);

            if (maintenance == null)
                return NotFound();

            return maintenance;
        }

       
        [HttpPost]
        public async Task<ActionResult<MaintenanceModel>> CreateMaintenance(MaintenanceModel maintenance)
        {
            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenance), new { id = maintenance.MaintenanceId }, maintenance);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenance(int id, MaintenanceModel maintenance)
        {
            if (id != maintenance.MaintenanceId)
                return BadRequest();

            _context.Entry(maintenance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null)
                return NotFound();

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceExists(int id)
        {
            return _context.Maintenances.Any(m => m.MaintenanceId == id);
        }
    }
}
