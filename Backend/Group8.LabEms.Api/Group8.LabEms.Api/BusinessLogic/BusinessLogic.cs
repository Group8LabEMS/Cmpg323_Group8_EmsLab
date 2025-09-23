using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Data.Enums;
using Group8.LabEms.Api.Models;
using System.Linq;

namespace Group8.LabEms.Api.BusinessLogic
{
    /*
        SOME METHODS TO IMPROVE VALIDATIONS AND 
        ENHANCE THE OVERALL BUSINESS LOGIC OF THE APPLICATION

    */
    public class BusinessLogic
    {
        private readonly AppDbContext _context;

        public BusinessLogic(AppDbContext context)
        {
            _context = context;
        }

        //CHECKS WHETHER THE EQUIPMENT IS BOOKABLE
        public bool CanBookEquipment(int EquipmentId)    
        {
            var latestMaintenance = _context
                .Maintenances
                .Where(m => m.EquipmentId == EquipmentId)
                .OrderByDescending(m => m.ScheduledFor)
                .FirstOrDefault();

            if (latestMaintenance == null || 
                latestMaintenance.MaintenanceType.Name != "Completed") return false;

            return true;               
        }

        // Checks if a new booking conflicts with existing bookings for the same equipment
        public bool HasBookingConflict(int equipmentId, DateTime fromDate, DateTime toDate)
        {
            return _context.Bookings.Any(b =>
                b.EquipmentId == equipmentId &&
                b.BookingStatus.name != "Cancelled" &&
                ((fromDate < b.ToDate && toDate > b.FromDate))
            );
        }

        // Checks if a user has a specific role
        public bool UserHasRole(int userId, string roleName)
        {
            return _context.UserRoles.Any(ur =>
                ur.UserId == userId &&
                ur.Role.Name == roleName
            );
        }

        // Prevent scheduling maintenance during active bookings
        public bool CanScheduleMaintenance(int equipmentId, DateTime scheduledFor, DateTime? completedAt = null)
        {
            // Check for any active bookings overlapping with the maintenance window
            return !_context.Bookings.Any(b =>
                b.EquipmentId == equipmentId &&
                b.BookingStatus.name != "Cancelled" &&
                ((scheduledFor < b.ToDate && (completedAt ?? scheduledFor) > b.FromDate))
            );
        }

        //when will equipment be available?
        //After being booked
        //after being maintained
        public DateTime WhenWillEquipmentBeAvailable(int EquipmentId) 
        {
            // Get the latest completed booking for this equipment
            var latestBooking = _context.Bookings
                .Where(b => b.EquipmentId == EquipmentId && b.BookingStatus.name == "Completed")
                .OrderByDescending(b => b.ToDate)
                .FirstOrDefault();

            // Get the latest completed maintenance for this equipment
            var latestMaintenance = _context.Maintenances
                .Where(m => m.EquipmentId == EquipmentId && m.MaintenanceStatus.Name == "Completed")
                .OrderByDescending(m => m.CompletedAt)
                .FirstOrDefault();

            DateTime? bookingEnd = latestBooking?.ToDate;
            DateTime? maintenanceEnd = latestMaintenance?.CompletedAt;

            // Find the earliest future time when equipment is available
            DateTime now = DateTime.UtcNow;
            var futureTimes = new List<DateTime>();
            if (bookingEnd.HasValue && bookingEnd.Value >= now)
                futureTimes.Add(bookingEnd.Value);
            if (maintenanceEnd.HasValue && maintenanceEnd.Value >= now)
                futureTimes.Add(maintenanceEnd.Value);

            if (futureTimes.Count == 0)
                return now; // Equipment is available now

            return futureTimes.Min();
        }
    }
}