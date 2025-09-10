using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<BookingStatusModel> BookingsStatus { get; set; }
        public DbSet<BookingModel> Bookings { get; set; }
        public DbSet<AuditLogModel> AuditLogs { get; set; }
        public DbSet<EquipmentModel> Equipments { get; set; }
        public DbSet<EquipmentTypeModel> EquipmentTypes { get; set; }
        public DbSet<EquipmentStatusModel> EquipmentStatuses { get; set; }
        public DbSet<MaintenanceModel> Maintenances { get; set; }
        public DbSet<MaintenanceTypeModel> MaintenanceTypes { get; set; }
        public DbSet<MaintenanceStatusModel> MaintenanceStatuses { get; set; }
        public DbSet<UserRoleModel> UserRoles { get; set; }
        public DbSet<RoleModel> Roles { get; set; }
    }
}
    