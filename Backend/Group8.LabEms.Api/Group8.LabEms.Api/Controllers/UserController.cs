using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Group8.LabEms.Api.Services.Interfaces;
using Group8.LabEms.Api.Services;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly PasswordService _passwordService;

        public UserController(AppDbContext context, INotificationService notificationService, PasswordService passwordService)
        {
            _context = context;
            _notificationService = notificationService;
            _passwordService = passwordService;
        }

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetUsers()
            => await _context.Users
                .Include(u => u.UserRoles)
                .Include(u => u.Bookings)
                .Include(u => u.AuditLogs)
                .ToListAsync();

        
        [HttpGet("{id}")]
        public async Task<ActionResult<UserModel>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .Include(u => u.Bookings)
                .Include(u => u.AuditLogs)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

       
        [HttpPost]
        public async Task<ActionResult<UserModel>> CreateUser(UserModel user, [FromQuery] string role)
        {
            user.Password = _passwordService.HashPassword(user.Password);
            user.CreatedAt = DateTime.UtcNow;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Assign role
            var roleEntity = await _context.Roles.FirstOrDefaultAsync(r => r.Name == role);
            if (roleEntity != null)
            {
                var userRole = new UserRoleModel { UserId = user.UserId, RoleId = roleEntity.RoleId };
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();
            }

            // Send welcome email notification
            try
            {
                await _notificationService.SendWelcomeEmailAsync(
                    user.Email,
                    user.DisplayName,
                    roleEntity?.Name ?? "User"
                );
            }
            catch (Exception ex)
            {
                Serilog.Log.Warning(ex, "Failed to send welcome email for user {UserId}", user.UserId);
                // Don't fail user creation if email fails
            }

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

   
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserModel user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) { return NotFound(); }

            existingUser.SsoId = user.SsoId;
            existingUser.DisplayName = user.DisplayName;
            existingUser.Email = user.Email;
            // Password updates should be handled through the reset-password endpoint

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(u => u.UserId == id);
        }
    }
}
