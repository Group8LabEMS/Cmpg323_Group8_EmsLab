using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        private readonly PasswordService _passwordService;
        
        public AuthController(AppDbContext context, JwtService jwtService, PasswordService passwordService)
        {
            _context = context;
            _jwtService = jwtService;
            _passwordService = passwordService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email == req.Username);

                if (user == null || !_passwordService.VerifyPassword(req.Password, user.Password))
                {
                    Serilog.Log.Warning($"Login failed for username: {req.Username}");
                    return Unauthorized();
                }



                var role = user.UserRoles.FirstOrDefault()?.Role.Name ?? "Student";
                
                var token = _jwtService.GenerateToken(user.UserId, user.Email, role);
                
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddHours(24)
                };
                
                Response.Cookies.Append("jwt", token, cookieOptions);
                
                Serilog.Log.Information($"Login successful for userId: {user.UserId}, role: {role}");
                return Ok(new { userId = user.UserId, role, message = "Login successful" });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, $"Exception during login for username: {req?.Username}");
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
            
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "User already exists" });
                }

                var user = new Models.UserModel
                {
                    SsoId = req.SsoId ?? Guid.NewGuid().ToString(),
                    DisplayName = req.DisplayName,
                    Email = req.Email,
                    Password = _passwordService.HashPassword(req.Password),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Student");
                if (role != null)
                {
                    var userRole = new Models.UserRoleModel { UserId = user.UserId, RoleId = role.RoleId };
                    _context.UserRoles.Add(userRole);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Registration successful", userId = user.UserId });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Exception during registration for email: {Email}", req?.Email);
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == req.UserId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                user.Password = _passwordService.HashPassword(req.NewPassword);
                await _context.SaveChangesAsync();

                Serilog.Log.Information($"Password reset for userId: {user.UserId} by admin");
                return Ok(new { message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, "Exception during password reset for userId: {UserId}", req?.UserId);
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            return Ok(new { userId, email, role });
        }
    }

    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }

    public class RegisterRequest
    {
        public string? SsoId { get; set; }
        public string DisplayName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class ResetPasswordRequest
    {
        public int UserId { get; set; }
        public string NewPassword { get; set; } = null!;
    }
}