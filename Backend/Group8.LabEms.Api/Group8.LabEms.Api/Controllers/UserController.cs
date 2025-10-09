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
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .ToListAsync();

            return users.Select(u => new UserResponseDto
            {
                UserId = u.UserId,
                SsoId = u.SsoId,
                DisplayName = u.DisplayName,
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                Role = u.UserRoles.FirstOrDefault()?.Role?.Name
            }).ToList();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return new UserResponseDto
            {
                UserId = user.UserId,
                SsoId = user.SsoId,
                DisplayName = user.DisplayName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Role = user.UserRoles.FirstOrDefault()?.Role?.Name
            };
        }

       
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(UserCreateUpdateDto userDto, [FromQuery] string role)
        {
            if (string.IsNullOrEmpty(userDto.Password))
            {
                return BadRequest("Password is required for new users");
            }

            var user = new UserModel
            {
                SsoId = userDto.SsoId,
                DisplayName = userDto.DisplayName,
                Email = userDto.Email,
                Password = _passwordService.HashPassword(userDto.Password),
                CreatedAt = DateTime.UtcNow
            };

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

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, new UserResponseDto
            {
                UserId = user.UserId,
                SsoId = user.SsoId,
                DisplayName = user.DisplayName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Role = roleEntity?.Name
            });
        }

   
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserCreateUpdateDto userDto)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) { return NotFound(); }

            existingUser.SsoId = userDto.SsoId;
            existingUser.DisplayName = userDto.DisplayName;
            existingUser.Email = userDto.Email;
            
            // Only update password if provided
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                existingUser.Password = _passwordService.HashPassword(userDto.Password);
            }

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
