using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuthController(AppDbContext context) => _context = context;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Email == req.Username && u.Password == req.Password);

            if (user == null)
                return Unauthorized();

            var role = user.UserRoles.FirstOrDefault()?.Role.Name ?? "Student";
            return Ok(new { userId = user.UserId, role });
        }
    }

    public class LoginRequest
    {
    public string? Username { get; set; }
    public string? Password { get; set; }
    }
}