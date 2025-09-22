using Microsoft.AspNetCore.Mvc;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Group8.LabEms.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuditLogController(AppDbContext context) => _context = context;

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLogModel>>> GetAuditLogs()
            => await _context.AuditLogs
                .Include(a => a.User)
                .ToListAsync();

      
        [HttpGet("{id}")]
        public async Task<ActionResult<AuditLogModel>> GetAuditLog(int id)
        {
            var auditLog = await _context.AuditLogs
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AuditLogId == id);

            if (auditLog == null)
                return NotFound();

            return auditLog;
        }

        
        [HttpPost]
        public async Task<ActionResult<AuditLogModel>> CreateAuditLog(AuditLogModel auditLog)
        {
            auditLog.TimeStamp = DateTime.UtcNow; // auto set timestamp
            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuditLog), new { id = auditLog.AuditLogId }, auditLog);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuditLog(int id, AuditLogModel auditLog)
        {
            if (id != auditLog.AuditLogId)
                return BadRequest();

            _context.Entry(auditLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuditLogExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/AuditLog/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuditLog(int id)
        {
            var auditLog = await _context.AuditLogs.FindAsync(id);
            if (auditLog == null)
                return NotFound();

            _context.AuditLogs.Remove(auditLog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuditLogExists(int id)
        {
            return _context.AuditLogs.Any(a => a.AuditLogId == id);
        }
    }
}
