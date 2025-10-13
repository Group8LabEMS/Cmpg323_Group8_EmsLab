using Group8.LabEms.Api.Models;

namespace Group8.LabEms.Api.Services.Interfaces
{
    public interface IMaintenanceService
    {
    Task<IEnumerable<MaintenanceModel>> GetOverdueMaintenanceAsync();
    Task<IEnumerable<MaintenanceModel>> GetUpcomingMaintenanceAsync(int daysAhead);
    Task MarkNotificationSentAsync(int maintenanceId);
    Task MarkUpcomingNotificationSentAsync(int maintenanceId);
    Task CheckAndCreatePreventiveMaintenanceAsync();
    }
    
}