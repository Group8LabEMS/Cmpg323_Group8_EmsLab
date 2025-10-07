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
        
        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                    .FirstOrDefaultAsync(u => u.Email == req.Username && u.Password == req.Password);

                if (user == null)
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
}