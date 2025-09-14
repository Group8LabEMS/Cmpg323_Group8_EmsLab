using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Group8.LabEms.Api.Data;
using Microsoft.EntityFrameworkCore;
using Group8.LabEms.Api.Services.Interfaces;

namespace Group8.LabEms.Api.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly AppDbContext _context;
        
        public PermissionService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> UserHasPermissionAsync(string ssoId, string permission)
        {
            // With multiple joins using LINQ query syntax
            var results = await (
                from user in _context.Users
                join userRole in _context.UserRoles on user.UserId equals userRole.UserId
                join role in _context.Roles on userRole.RoleId equals role.RoleId
                where user.SsoId == ssoId && role.Name.Contains(permission)
                select new { UserId = user.UserId, RoleId = role.RoleId }
            ).CountAsync();

            return results > 0;
        }

        public async Task<bool> UserHasPermissionAsyncTest(int userId, string permission)
        {
            return true;
        }

        public bool IsValidUser(string username, string password)
        {
            // For demonstration purposes, we use hardcoded values.
            // In a real application, you would validate against a user store (e.g., database).
            return username == "admin" && password == "password";
        }
                
        
    }
}