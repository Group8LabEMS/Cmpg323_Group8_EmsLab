using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingModel>>> GetBookingStatus()
            => await _context.Bookings

                .Include(x => x.Equipment)
                .Include(u => u.User)
                .Include(b => b.BookingStatus)
                .ToListAsync();


        [HttpGet("{id}")]
        public async Task<ActionResult<BookingModel>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Equipment)
                .Include(b => b.BookingStatus)
                .FirstOrDefaultAsync(b => b.BookingId == id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
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
            .Where(e => e.Availability != "Available")
            .AnyAsync();

            if (hasEquipmentConflict || hasBookingConflict)
            {
                return Conflict("The selected Equipment is not available or is already");
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
        public async Task<IActionResult> UpdateBooking(int id, BookingModel booking)
        {
            if (id != booking.BookingId)
            {
                return BadRequest();
            }

            _context.Entry(booking).State = EntityState.Modified;

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
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingExists(int id)
        {
            return _context.Bookings.Any(e => e.BookingId == id);
        }
    }
}

