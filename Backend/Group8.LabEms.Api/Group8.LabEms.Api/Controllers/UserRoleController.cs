using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserRoleController(AppDbContext context) => _context = context;

      
      
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRoleModel>>> GetUserRoles()
            => await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .ToListAsync();

     
        [HttpGet("{userId}/{roleId}")]
        public async Task<ActionResult<UserRoleModel>> GetUserRole(int userId, int roleId)
        {
            var userRole = await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);

            if (userRole == null)
            {
                return NotFound();
            }

            return userRole;
        }

     
        [HttpPost]
        public async Task<ActionResult<UserRoleModel>> CreateUserRole(UserRoleModel userRole)
        {
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserRole), new { userId = userRole.UserId, roleId = userRole.RoleId }, userRole);
        }

        
        [HttpPut("{userId}/{roleId}")]
        public async Task<IActionResult> UpdateUserRole(int userId, int roleId, UserRoleModel userRole)
        {
            if (userId != userRole.UserId || roleId != userRole.RoleId)
            {
                return BadRequest();
            }

            _context.Entry(userRole).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoleExists(userId, roleId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        [HttpDelete("{userId}/{roleId}")]
        public async Task<IActionResult> DeleteUserRole(int userId, int roleId)
        {
            var userRole = await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
            if (userRole == null)
            {
                return NotFound();
            }

            _context.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserRoleExists(int userId, int roleId)
        {
            return _context.UserRoles.Any(ur => ur.UserId == userId && ur.RoleId == roleId);
        }
    }
}
