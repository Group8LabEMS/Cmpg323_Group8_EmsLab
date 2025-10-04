using System.Threading.Tasks;

namespace Group8.LabEms.Api.Services.Interfaces
{
    public interface INotificationService
    {
        Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false);
        Task SendEmailAsync(string[] toEmails, string subject, string body, bool isHtml = false);
        Task SendBookingConfirmationAsync(string userEmail, string equipmentName, DateTime bookingDate, DateTime startTime, DateTime endTime);
        Task SendBookingCancellationAsync(string userEmail, string equipmentName, DateTime bookingDate);
        Task SendMaintenanceNotificationAsync(string userEmail, string equipmentName, DateTime maintenanceDate, string maintenanceType);
        Task SendEquipmentAvailableAsync(string userEmail, string equipmentName);
        Task SendWelcomeEmailAsync(string userEmail, string userName, string role);
    }
}