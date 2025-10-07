using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentModel>>> GetEquipments()
            => await _context.Equipments
                .Include(e => e.EquipmentType)
                .Include(e => e.EquipmentStatus)
                .Include(e => e.Bookings)
                .Include(e => e.Maintenances)
                .ToListAsync();


        [HttpGet("{id}")]
        public async Task<ActionResult<EquipmentModel>> GetEquipment(int id)
        {
            var equipment = await _context.Equipments
                .Include(e => e.EquipmentType)
                .Include(e => e.EquipmentStatus)
                .Include(e => e.Bookings)
                .Include(e => e.Maintenances)
                .FirstOrDefaultAsync(e => e.EquipmentId == id);

            if (equipment == null)
                return NotFound();

            return equipment;
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

        private bool EquipmentExists(int id)
        {
            return _context.Equipments.Any(e => e.EquipmentId == id);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateEquipmentStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            var equipment = await _context.Equipments.FindAsync(id);
            if (equipment == null)
                return NotFound();

            // Lookup the status ID by status name
            var status = await _context.EquipmentStatuses.FirstOrDefaultAsync(s => s.Name == dto.Status);
            if (status == null)
                return BadRequest("Invalid status");

            equipment.EquipmentStatusId = status.EquipmentStatusId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

       
        public class StatusUpdateDto
        {
            public required string Status { get; set; }
        }

    }
}
