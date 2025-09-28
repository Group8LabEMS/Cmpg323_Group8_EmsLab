using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Group8.LabEms.Api.Models.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Group8.LabEms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtSettings _jwtSettings;
        private readonly PasswordHasher<UserModel> _passwordHasher = new PasswordHasher<UserModel>();
        public AuthController(AppDbContext context, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings.Value;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.DisplayName == request.Email && u.Password == request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid Credentials");
            }

            // verify hash
            var result = _passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized("Invalid credentials");
            }

            var roles = user.UserRoles.Select(ur => ur.Role).ToList();
            var token = GenerateJwtToken(user, roles);

            //save token in a cookie
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes)
            });

            return Ok(new { token });

        }

        private string GenerateJwtToken(UserModel user, List<RoleModel> roles)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.DisplayName)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.Name)));
            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);

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
            }

            //  CHECK EXISTENCE BASED ON EMAIL, I.E. ENSURE THE EMAIL IS ALWAYS UNIQUE
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
                role = new RoleModel
                {
                    Name = request.Role
                };


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

    public enum ValidRoles
    {
        Admin, Student, LabManager, LabTechnician
    }
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = null!;
    }
}