using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeAPI.Data;
using EmployeeAPI.Models;

namespace EmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? employeeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var query = _context.Attendances.Include(a => a.Employee).AsQueryable();
            if (employeeId.HasValue) query = query.Where(a => a.EmployeeId == employeeId.Value);
            if (from.HasValue) query = query.Where(a => a.Date >= from.Value);
            if (to.HasValue) query = query.Where(a => a.Date <= to.Value);

            var result = await query.OrderByDescending(a => a.Date).ToListAsync();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Attendance attendance)
        {
            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();
            return Ok(attendance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Attendance updated)
        {
            var att = await _context.Attendances.FindAsync(id);
            if (att == null) return NotFound();
            att.Status = updated.Status;
            att.CheckIn = updated.CheckIn;
            att.CheckOut = updated.CheckOut;
            await _context.SaveChangesAsync();
            return Ok(att);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] DateTime? month)
        {
            var targetMonth = month ?? DateTime.UtcNow;
            var summary = await _context.Attendances
                .Where(a => a.Date.Month == targetMonth.Month && a.Date.Year == targetMonth.Year)
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();
            return Ok(summary);
        }
    }
}
