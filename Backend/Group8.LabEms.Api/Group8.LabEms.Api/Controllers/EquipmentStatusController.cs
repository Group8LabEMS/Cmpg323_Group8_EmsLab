using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentStatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentStatusController(AppDbContext context) => _context = context;

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentStatusModel>>> GetEquipmentStatuses()
            => await _context.EquipmentStatuses
                .Include(es => es.Equipments)
                .ToListAsync();

        
        [HttpGet("{id}")]
        public async Task<ActionResult<EquipmentStatusModel>> GetEquipmentStatus(int id)
        {
            var status = await _context.EquipmentStatuses
                .Include(es => es.Equipments)
                .FirstOrDefaultAsync(es => es.EquipmentStatusId == id);

            if (status == null)
                return NotFound();

            return status;
        }

        
        [HttpPost]
        public async Task<ActionResult<EquipmentStatusModel>> CreateEquipmentStatus(EquipmentStatusModel status)
        {
            _context.EquipmentStatuses.Add(status);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEquipmentStatus), new { id = status.EquipmentStatusId }, status);
        }

       
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipmentStatus(int id, EquipmentStatusModel status)
        {
            if (id != status.EquipmentStatusId)
                return BadRequest();

            _context.Entry(status).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentStatusExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipmentStatus(int id)
        {
            var status = await _context.EquipmentStatuses.FindAsync(id);
            if (status == null)
                return NotFound();

            _context.EquipmentStatuses.Remove(status);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquipmentStatusExists(int id)
        {
            return _context.EquipmentStatuses.Any(e => e.EquipmentStatusId == id);
        }
    }
}
