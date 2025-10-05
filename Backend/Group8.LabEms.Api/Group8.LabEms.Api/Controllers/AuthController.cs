using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Group8.LabEms.Api.Models;
using Microsoft.AspNetCore.Identity;


namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuthController(AppDbContext context) => _context = context;
        private readonly PasswordHasher<UserModel> _passwordHasher = new PasswordHasher<UserModel>();


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
                Serilog.Log.Information($"Login successful for userId: {user.UserId}, role: {role}");
                return Ok(new { userId = user.UserId, role });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, $"Exception during login for username: {req?.Username}");
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

            if (!Regex.IsMatch(request.Email, emailPattern))
            {
                return BadRequest("Invalid email format.");
            }

            string[] allowedRoles = { "Student", "Admin", "LabManager", "LabTechnician" };
            
            if (!allowedRoles.Contains(request.Role))
                return BadRequest($"Invalid role. Allowed roles are: {string.Join(", ", allowedRoles)}");

            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required.");
            } // CHECK EXISTENCE BASED ON EMAIL, I.E. ENSURE THE EMAIL IS ALWAYS UNIQUE 
              // 
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest("User/Email already exists");

            var user = new UserModel
            {
                DisplayName = request.Email,
                Email = request.Email,
                Password = request.Password,
            };
            user.Password = _passwordHasher.HashPassword(user, request.Password);
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == request.Role);

            if (role == null)
            {
                role = new RoleModel { Name = request.Role };

                _context.Roles.Add(role);
                await _context.SaveChangesAsync();
            }
            //ASSIGN USER ROLES 
            user.UserRoles = new List<UserRoleModel>
            {
                new UserRoleModel{User = user,Role = role}

            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully");
        }
    }


}

    public class LoginRequest
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
    }
    public class RegisterRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
