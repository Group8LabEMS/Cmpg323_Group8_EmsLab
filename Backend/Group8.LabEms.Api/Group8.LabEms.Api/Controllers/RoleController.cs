using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context) => _context = context;

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleModel>>> GetRoles()
            => await _context.Roles
                .Include(r => r.UserRoles)
                .ToListAsync();

        
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleModel>> GetRole(int id)
        {
            var role = await _context.Roles
                .Include(r => r.UserRoles)
                .FirstOrDefaultAsync(r => r.RoleId == id);

            if (role == null)
                return NotFound();

            return role;
        }

        
        [HttpPost]
        public async Task<ActionResult<RoleModel>> CreateRole(RoleModel role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = role.RoleId }, role);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, RoleModel role)
        {
            if (id != role.RoleId)
                return BadRequest();

            _context.Entry(role).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
                return NotFound();

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoleExists(int id)
        {
            return _context.Roles.Any(r => r.RoleId == id);
        }
    }
}
