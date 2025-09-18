using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentTypeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EquipmentTypeController(AppDbContext context) => _context = context;

        // GET: api/EquipmentType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentTypeModel>>> GetEquipmentTypes()
            => await _context.EquipmentTypes
                .Include(et => et.Equipments)
                .ToListAsync();

        // GET: api/EquipmentType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EquipmentTypeModel>> GetEquipmentType(int id)
        {
            var type = await _context.EquipmentTypes
                .Include(et => et.Equipments)
                .FirstOrDefaultAsync(et => et.EquipmentTypeId == id);

            if (type == null)
                return NotFound();

            return type;
        }

        // POST: api/EquipmentType
        [HttpPost]
        public async Task<ActionResult<EquipmentTypeModel>> CreateEquipmentType(EquipmentTypeModel type)
        {
            _context.EquipmentTypes.Add(type);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEquipmentType), new { id = type.EquipmentTypeId }, type);
        }

        // PUT: api/EquipmentType/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEquipmentType(int id, EquipmentTypeModel type)
        {
            if (id != type.EquipmentTypeId)
                return BadRequest();

            _context.Entry(type).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EquipmentTypeExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/EquipmentType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipmentType(int id)
        {
            var type = await _context.EquipmentTypes.FindAsync(id);
            if (type == null)
                return NotFound();

            _context.EquipmentTypes.Remove(type);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EquipmentTypeExists(int id)
        {
            return _context.EquipmentTypes.Any(e => e.EquipmentTypeId == id);
        }
    }
}
