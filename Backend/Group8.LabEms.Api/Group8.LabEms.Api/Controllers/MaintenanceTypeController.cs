using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceTypeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MaintenanceTypeController(AppDbContext context) => _context = context;

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceTypeModel>>> GetMaintenanceTypes()
            => await _context.MaintenanceTypes.ToListAsync();


        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceTypeModel>> GetMaintenanceType(int id)
        {
            var maintenanceType = await _context.MaintenanceTypes.FindAsync(id);

            if (maintenanceType == null)
                return NotFound();

            return maintenanceType;
        }

        
        [HttpPost]
        public async Task<ActionResult<MaintenanceTypeModel>> CreateMaintenanceType(MaintenanceTypeModel maintenanceType)
        {
            _context.MaintenanceTypes.Add(maintenanceType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMaintenanceType), new { id = maintenanceType.MaintenanceTypeId }, maintenanceType);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaintenanceType(int id, MaintenanceTypeModel maintenanceType)
        {
            if (id != maintenanceType.MaintenanceTypeId)
                return BadRequest();

            _context.Entry(maintenanceType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceTypeExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenanceType(int id)
        {
            var maintenanceType = await _context.MaintenanceTypes.FindAsync(id);
            if (maintenanceType == null)
                return NotFound();

            _context.MaintenanceTypes.Remove(maintenanceType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceTypeExists(int id)
        {
            return _context.MaintenanceTypes.Any(mt => mt.MaintenanceTypeId == id);
        }
    }
}
