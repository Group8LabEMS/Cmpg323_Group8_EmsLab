using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //composite key for user role model
            modelBuilder.Entity<UserRoleModel>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRoleModel>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRoleModel>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<BookingStatusModel>()
            .HasIndex(b => b.Name)
            .IsUnique();

            modelBuilder.Entity<EquipmentStatusModel>()
            .HasIndex(b => b.Name)
            .IsUnique();

            modelBuilder.Entity<EquipmentTypeModel>()
            .HasIndex(b => b.Name)
            .IsUnique();

            modelBuilder.Entity<MaintenanceTypeModel>()
            .HasIndex(b => b.Name)
            .IsUnique();

            modelBuilder.Entity<MaintenanceStatusModel>()
            .HasIndex(b => b.Name)
            .IsUnique();

            modelBuilder.Entity<AuditLogModel>()
                .HasOne(a => a.User)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<BookingModel>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

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
    