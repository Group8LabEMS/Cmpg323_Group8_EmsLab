using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EquipmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetEquipments()
        {
            var equipments = await _context.Equipments
                .Include(e => e.EquipmentType)
                .Include(e => e.EquipmentStatus)
                .Select(e => new {
                    e.EquipmentId,
                    e.Name,
                    e.EquipmentTypeId,
                    EquipmentType = new { e.EquipmentType.EquipmentTypeId, e.EquipmentType.Name, e.EquipmentType.Description },
                    e.EquipmentStatusId,
                    EquipmentStatus = new { e.EquipmentStatus.EquipmentStatusId, e.EquipmentStatus.Name, e.EquipmentStatus.Description },
                    e.Availability,
                    e.CreatedDate
                })
                .ToListAsync();
            return Ok(equipments);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetEquipment(int id)
        {
            var equipment = await _context.Equipments
                .Include(e => e.EquipmentType)
                .Include(e => e.EquipmentStatus)
                .Where(e => e.EquipmentId == id)
                .Select(e => new {
                    e.EquipmentId,
                    e.Name,
                    e.EquipmentTypeId,
                    EquipmentType = new { e.EquipmentType.EquipmentTypeId, e.EquipmentType.Name, e.EquipmentType.Description },
                    e.EquipmentStatusId,
                    EquipmentStatus = new { e.EquipmentStatus.EquipmentStatusId, e.EquipmentStatus.Name, e.EquipmentStatus.Description },
                    e.Availability,
                    e.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (equipment == null)
                return NotFound();

            return Ok(equipment);
        }

        
        [HttpPost]
        public async Task<ActionResult<EquipmentModel>> CreateEquipment([FromBody] EquipmentModel equipment)
        {
            if (!ModelState.IsValid)
            {
                // Log validation errors for debugging
                var errors = string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage));
                return BadRequest(new { message = "Validation failed", errors });
            }
            equipment.CreatedDate = DateTime.UtcNow; 
            _context.Equipments.Add(equipment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEquipment), new { id = equipment.EquipmentId }, equipment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, EquipmentModel equipment)
        {
            if (id != equipment.EquipmentId)
                return BadRequest();

            _context.Entry(equipment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")] 
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null)
                return NotFound();

            _context.Equipments.Remove(equipment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("maintenance")]
        public async Task<ActionResult<IEnumerable<object>>> GetMaintenanceEquipment()
        {
            var maintenanceEquipment = await _context.Equipments
                .Include(e => e.EquipmentType)
                .Include(e => e.EquipmentStatus)
                .Where(e => e.EquipmentStatus.Name == "Under Maintenance")
                .Select(e => new {
                    e.EquipmentId,
                    e.Name,
                    e.EquipmentTypeId,
                    EquipmentType = new { e.EquipmentType.EquipmentTypeId, e.EquipmentType.Name, e.EquipmentType.Description },
                    e.EquipmentStatusId,
                    EquipmentStatus = new { e.EquipmentStatus.EquipmentStatusId, e.EquipmentStatus.Name, e.EquipmentStatus.Description },
                    e.Availability,
                    e.CreatedDate
                })
                .ToListAsync();
            return Ok(maintenanceEquipment);
        }

        [HttpPut("{id}/maintenance/complete")]
        public async Task<IActionResult> CompleteMaintenance(int id)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null)
                return NotFound();

            var availableStatus = await _context.EquipmentStatuses
                .FirstOrDefaultAsync(s => s.Name == "Available");
            if (availableStatus == null)
                return BadRequest("Available status not found");

            equipment.EquipmentStatusId = availableStatus.EquipmentStatusId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquipmentExists(int id)
        {
            return _context.Equipments.Any(e => e.EquipmentId == id);
        }
    }
}
