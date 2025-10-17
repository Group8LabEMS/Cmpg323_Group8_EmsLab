using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Group8.LabEms.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context) => _context = context;

        [HttpGet("aggregates")]
        public async Task<ActionResult<object>> GetDashboardAggregates()
        {
            var totalUsers = await _context.Users.CountAsync();
            var activeBookings = await _context.Bookings
                .Where(b => b.BookingStatus.Name == "Approved")
                .CountAsync();

            var pendingBookings = await _context.Bookings
                .Where(b => b.BookingStatus.Name == "Pending")
                .CountAsync();

            var maintenanceEquipment = await _context.Equipments
                .Where(e => e.EquipmentStatus.Name == "Under Maintenance")
                .CountAsync();

            return Ok(new
            {
                totalUsers,
                activeBookings,
                pendingBookings,    
                maintenanceEquipment
            });
        }

        [HttpGet("bookings-per-month")]
        public async Task<ActionResult<object>> GetBookingsPerMonth()
        {
            var bookingsByMonth = await _context.Bookings
                .Where(b => b.CreatedDate >= DateTime.UtcNow.AddMonths(-4))
                .GroupBy(b => new { b.CreatedDate.Year, b.CreatedDate.Month })
                .Select(g => new {
                    month = g.Key.Month,
                    year = g.Key.Year,
                    count = g.Count()
                })
                .OrderBy(x => x.year).ThenBy(x => x.month)
                .ToListAsync();

            return Ok(bookingsByMonth);
        }

        [HttpGet("equipment-usage")]
        public async Task<ActionResult<object>> GetEquipmentUsage()
        {
            var equipmentUsage = await _context.Bookings
                .Include(b => b.Equipment)
                .GroupBy(b => b.Equipment.Name)
                .Select(g => new {
                    name = g.Key,
                    count = g.Count()
                })
                .OrderByDescending(x => x.count)
                .Take(10)
                .ToListAsync();

            return Ok(equipmentUsage);
        }
    }
}