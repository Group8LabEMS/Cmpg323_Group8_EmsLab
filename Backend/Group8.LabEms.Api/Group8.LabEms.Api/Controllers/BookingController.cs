using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingController(AppDbContext context) => _context = context;

      

        // GET BOOKINGS with pagination
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingModel>>> GetBookings(
            [FromQuery] string status = null,
            [FromQuery] string displayName = null,
            [FromQuery] string equipmentName = null,
            [FromQuery] string sortBy = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            //INCLUDE RELATED ENTITIES
            var query = _context.Bookings
            .Include(b => b.BookingStatus)
            .Include(b => b.Equipment)
            .Include(b => b.User)
            .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(b =>b.BookingStatus != null && b.BookingStatus.Name == status);
            }

            if (!string.IsNullOrEmpty(displayName))
            {
                query = query.Where(b => b.User != null && b.User.DisplayName == displayName);
            }

             if (!string.IsNullOrEmpty(equipmentName))
            {
                query = query.Where(b => b.Equipment != null && b.Equipment.Name == equipmentName);
            }

            //IMPLEMENT SORTING
            if (!string.IsNullOrEmpty(sortBy) || page > 1)
            {
                query = sortBy?.ToLower() switch
                {
                    "date" => query.OrderBy(b => b.CreatedDate),
                    "displayName" => query.OrderBy(b => b.User.DisplayName),
                    "equipmentName" => query.OrderBy(b => b.Equipment.Name),
                    _ => query.OrderBy(b => b.CreatedDate)
                };

            }

            var bookingsCount = await query.CountAsync();
            var bookings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { bookingsCount, bookings});
            
        }


        //GET BOOKINGS WITH OPTIONAL STATUS FILTER
        [HttpGet("status")]
        public async Task<ActionResult<IEnumerable<BookingModel>>> GetBookingsByStatus([FromQuery] string status = null)
        {
            var query = _context.Bookings
            .Include(b => b.BookingStatus)
            .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(b => b.BookingStatus.Name == status);
            }

            var bookings = await query.ToListAsync();
            return Ok(bookings);
        }
                
        
        //GET HISTORICAL BOOKINGS
        //THIS IS GOOD FOR THE DASHBOARD
        [HttpGet("historical")]
        public async Task<ActionResult> GetHistoricalBookings([FromQuery] DateTime? fromDate = null)
        {
            var historicalStatuses = new[] { "Completed", "Cancelled", "Approved", "Rejected" };

            var query = _context.Bookings
                .Include(b => b.BookingStatus)
                .Where(b => historicalStatuses.Contains(b.BookingStatus.Name));

                 // IF THE FROM DATE IS  PROVIDED, FILTER BY IT
            if (fromDate.HasValue)
            {
              query = query.Where(b => b.CreatedDate >= fromDate.Value);
            }
            var bookings = await query.ToListAsync();
                
            return Ok(bookings);
        }
        
    

        // FILTERING BY DATES

        [HttpGet("date-range")]
        public async Task<ActionResult<IEnumerable<BookingModel>>> GetBookingsInDateRange([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            
            IQueryable<BookingModel> query = _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Equipment)
                .Include(b => b.BookingStatus);
            
            // If user is not admin, filter to only their bookings
            if (currentUserRole != "Admin")
            {
                query = query.Where(b => b.UserId == currentUserId);
            }
            
            var bookings = await query
                .Select(b => new {
                    b.BookingId,
                    b.UserId,
                    User = b.User == null ? null : new { b.User.UserId, b.User.DisplayName, b.User.Email },
                    b.EquipmentId,
                    Equipment = b.Equipment == null ? null : new { b.Equipment.EquipmentId, b.Equipment.Name },
                    b.BookingStatusId,
                    BookingStatus = b.BookingStatus == null ? null : new { b.BookingStatus.BookingStatusId, b.BookingStatus.Name, b.BookingStatus.Description },
                    b.FromDate,
                    b.ToDate,
                    b.Notes,
                    b.CreatedDate
                })
                .ToListAsync();
            return Ok(bookings);
        }


        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<BookingModel>>> GetBooking()
        //     => await _context.Bookings

        //         .Include(x => x.Equipment)
        //         .Include(u => u.User)
        //         .Include(b => b.BookingStatus)
        //         .ToListAsync();


        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Equipment)
                .Include(b => b.BookingStatus)
                .Where(b => b.BookingId == id)
                .Select(b => new {
                    b.BookingId,
                    b.UserId,
                    User = b.User == null ? null : new { b.User.UserId, b.User.DisplayName, b.User.Email },
                    b.EquipmentId,
                    Equipment = b.Equipment == null ? null : new { b.Equipment.EquipmentId, b.Equipment.Name },
                    b.BookingStatusId,
                    BookingStatus = b.BookingStatus == null ? null : new { b.BookingStatus.BookingStatusId, b.BookingStatus.Name, b.BookingStatus.Description },
                    b.FromDate,
                    b.ToDate,
                    b.Notes,
                    b.CreatedDate
                })
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return NotFound();
            }

            return Ok(booking);
        }


        [HttpPost]
        public async Task<ActionResult<BookingModel>> CreateBooking(BookingModel booking)
        {
            booking.CreatedDate = DateTime.UtcNow;

            // Fetch and assign navigation properties from DB using IDs, allow nulls
            booking.User = booking.UserId != 0 ? await _context.Users.FindAsync(booking.UserId) : null;
            booking.Equipment = booking.EquipmentId != 0 ? await _context.Equipments.FindAsync(booking.EquipmentId) : null;
            booking.BookingStatus = booking.BookingStatusId != 0 ? await _context.BookingsStatus.FindAsync(booking.BookingStatusId) : null;

            if (booking.User == null || booking.Equipment == null || booking.BookingStatus == null)
            {
                var debugMsg = $"Booking debug: userId={booking.UserId} (found={booking.User != null}), equipmentId={booking.EquipmentId} (found={booking.Equipment != null}), bookingStatusId={booking.BookingStatusId} (found={booking.BookingStatus != null})";
                Serilog.Log.Error(debugMsg);
                return BadRequest("Invalid User, Equipment, or BookingStatus ID. " + debugMsg);
            }

            //CHECK FOR CONFLICTS
            var hasBookingConflict = await _context.Bookings
            .Where(b => b.EquipmentId == booking.EquipmentId)
            .Where(b =>b.BookingStatus.Name == "Approved" || b.BookingStatus.Name == "Pending")
            .Where(b => b.BookingId != booking.BookingId) 
            .Where(b => b.FromDate < booking.ToDate && b.ToDate > booking.FromDate)
            .AnyAsync();
            

            var hasEquipmentConflict = await _context.Equipments
            .Where(e => e.EquipmentStatus.Name != "Available")
            // .Where(e => e.Location != "Available")
            .AnyAsync();

            if (hasEquipmentConflict || hasBookingConflict)
            {
                return Conflict("The selected Equipment is not available or is already booked");
            }

            if (booking.FromDate < DateTime.UtcNow)
                return BadRequest("From date must must not be in the past");

            if (booking.FromDate >= booking.ToDate)
                return BadRequest("From date must not be after start date"); 


            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.BookingId }, booking);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, BookingUpdateDto updateDto)
        {
            if (!ModelState.IsValid) { return BadRequest(ModelState); }

            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            // Authorization check: only booking owner or admin can update
            if (currentUserRole != "Admin" && booking.UserId != currentUserId)
            {
                return Forbid("You can only update your own bookings");
            }

            // Update booking status if provided
            if (updateDto.BookingStatusId.HasValue)
            {
                var statusExists = await _context.BookingsStatus.AnyAsync(s => s.BookingStatusId == updateDto.BookingStatusId.Value);
                if (!statusExists) { return BadRequest("Invalid BookingStatusId"); }
                booking.BookingStatusId = updateDto.BookingStatusId.Value;
            }

            // Update dates if provided
            if (updateDto.FromDate.HasValue)
            {
                booking.FromDate = updateDto.FromDate.Value;
            }
            if (updateDto.ToDate.HasValue)
            {
                booking.ToDate = updateDto.ToDate.Value;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var currentUserRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            // Authorization check: only booking owner or admin can delete
            if (currentUserRole != "Admin" && booking.UserId != currentUserId)
            {
                return Forbid("You can only delete your own bookings");
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("user/{userId}/calendar")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserBookingDates(int userId)
        {
            var bookingDates = await _context.Bookings
                .Where(b => b.UserId == userId)
                .Select(b => new {
                    Date = b.FromDate.Date,
                    IsPast = b.FromDate.Date < DateTime.UtcNow.Date
                })
                .Distinct()
                .ToListAsync();
            return Ok(bookingDates);
        }

        [HttpGet("user/{userId}/upcoming")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserUpcomingBookings(int userId)
        {
            var upcomingBookings = await _context.Bookings
                .Include(b => b.Equipment)
                .Where(b => b.UserId == userId && b.FromDate >= DateTime.UtcNow)
                .OrderBy(b => b.FromDate)
                .Select(b => new {
                    b.BookingId,
                    EquipmentName = b.Equipment != null ? b.Equipment.Name : null,
                    b.FromDate,
                    b.ToDate
                })
                .ToListAsync();
            return Ok(upcomingBookings);
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.BookingId == id);
        }
    }
}

