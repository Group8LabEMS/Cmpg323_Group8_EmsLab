using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Group8.LabEms.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MaintenanceService> _logger;

        public MaintenanceService(AppDbContext context, ILogger<MaintenanceService> logger)
        {
            _logger = logger;
            _context = context;
        }

        public async Task CheckAndCreatePreventiveMaintenanceAsync()
        {
              var today = DateTime.UtcNow.Date;

            var equipmentDueForMaintenance = await _context.Equipments
                .Where(e => e.EquipmentStatus.Name == "Available" || e.EquipmentStatus.Name == "In Use")
                .Where(e => e.Maintenances
                    .OrderByDescending(m => m.CompletedAt)
                    .Select(m => m.CompletedAt)
                    .FirstOrDefault() != null &&
                    e.Maintenances
                        .OrderByDescending(m => m.CompletedAt)
                        .Select(m => m.CompletedAt)
                        .FirstOrDefault().Value.AddDays(7) <= today)
                .ToListAsync();

            foreach (var equip in equipmentDueForMaintenance)
            {
                var maintenance = new MaintenanceModel
                {
                    EquipmentId = equip.EquipmentId,
                    ScheduledFor = DateTime.UtcNow.Date.AddDays(7),

                };
                _context.Maintenances.Add(maintenance);
                _logger.LogInformation("Created a preventative maintenance for equipment {EquipmentId}", equip.EquipmentId);
            }

            await _context.SaveChangesAsync();

        }

        public async Task<IEnumerable<MaintenanceModel>> GetOverdueMaintenanceAsync()
        {
            var overdue = await _context.Maintenances
            .Include(m => m.Equipment)
            .Include(m => m.StartedAt < DateTime.UtcNow.Date)
            .Where(m => m.MaintenanceStatus.Name == "Scheduled")
            .ToListAsync();
            return overdue;
        }

        public async Task<IEnumerable<MaintenanceModel>> GetUpcomingMaintenanceAsync(int daysAhead)
        {
            var startDate = DateTime.UtcNow.Date;
            var endDate = startDate.AddDays(daysAhead);

            var upcoming = await _context.Maintenances
            .Include(m => m.Equipment)
            .Include(m => m.MaintenanceStatus.Name == "Scheduled")
            .Where(m => m.ScheduledFor >= startDate && m.ScheduledFor <= endDate)
            .ToListAsync();

            return upcoming; 
        }

        public Task MarkNotificationSentAsync(int maintenanceId)
        {
            throw new NotImplementedException();
        }

        public Task MarkUpcomingNotificationSentAsync(int maintenanceId)
        {
            throw new NotImplementedException();
        }
    }
}