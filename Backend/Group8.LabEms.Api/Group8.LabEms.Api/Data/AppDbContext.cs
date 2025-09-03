using Group8.LabEms.Api.Models;
using Group8.LabEms.Api.Models.Equipments;
using Group8.LabEms.Api.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        DbSet<UserModel> Users { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
    }
}
