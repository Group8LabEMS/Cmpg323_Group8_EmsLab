using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingStatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingStatusController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingStatusModel>>> GetBookingStatus()
            => await _context.BookingsStatus
                //.Include(x => x.Bookings)
                .ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingStatusModel>> GetBookingStatus(int id)
        {
            var bookingStatus = await _context.BookingsStatus.FindAsync(id);

            if (bookingStatus == null)
            {
                return NotFound();
            }

            return bookingStatus;
        }

        [HttpPost]
        public async Task<ActionResult<BookingStatusModel>> CreateBookingStatus(BookingStatusModel bookingStatus)
        {
            _context.BookingsStatus.Add(bookingStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBookingStatus), new { id = bookingStatus.BookingStatusId }, bookingStatus);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBookingStatus(int id, BookingStatusModel bookingStatus)
        {
            if (id != bookingStatus.BookingStatusId)
            {
                return BadRequest();
            }

            _context.Entry(bookingStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookingStatusExists(id))
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
        public async Task<IActionResult> DeleteBookingStatus(int id)
        {
            var bookingStatus = await _context.BookingsStatus.FindAsync(id);
            if (bookingStatus == null)
            {
                return NotFound();
            }

            _context.BookingsStatus.Remove(bookingStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookingStatusExists(int id)
        {
            return _context.BookingsStatus.Any(e => e.BookingStatusId == id);
        }

    }
}
