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
                return BadRequest("Invalid User, Equipment, or BookingStatus ID.");
            }

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

