using Group8.LabEms.Api.Models;
using Group8.LabEms.Api.Models.Equipments;

using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

       // DbSet<UserModel> Users { get; set; }     we'll add later 
        public DbSet<Equipment> equipment { get; set; }
        public DbSet<EquipmentStatus> equipment_status { get; set; }
        public DbSet<EquipmentType> equipment_type { get; set; }
    }
}
