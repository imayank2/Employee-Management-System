using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeAPI.Data;
using EmployeeAPI.DTOs;
using EmployeeAPI.Models;

namespace EmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? department, [FromQuery] bool? isActive)
        {
            var query = _context.Employees.AsQueryable();
            if (!string.IsNullOrEmpty(department))
                query = query.Where(e => e.Department == department);
            if (isActive.HasValue)
                query = query.Where(e => e.IsActive == isActive.Value);

            var employees = await query.OrderByDescending(e => e.Id).ToListAsync();
            return Ok(employees);
        }

        // GET: api/employees/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var emp = await _context.Employees
                .Include(e => e.Attendances)
                .FirstOrDefaultAsync(e => e.Id == id);
            if (emp == null) return NotFound();
            return Ok(emp);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EmployeeCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var emp = new Employee
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Department = dto.Department,
                Position = dto.Position,
                Salary = dto.Salary,
                JoinDate = dto.JoinDate
            };
            _context.Employees.Add(emp);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = emp.Id }, emp);
        }

        // PUT: api/employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeUpdateDto dto)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();

            emp.FirstName = dto.FirstName;
            emp.LastName = dto.LastName;
            emp.Email = dto.Email;
            emp.Phone = dto.Phone;
            emp.Department = dto.Department;
            emp.Position = dto.Position;
            emp.Salary = dto.Salary;
            emp.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(emp);
        }

        // DELETE: api/employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            if (emp == null) return NotFound();

            _context.Employees.Remove(emp);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/employees/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> BulkDelete([FromBody] List<int> ids)
        {
            var employees = await _context.Employees.Where(e => ids.Contains(e.Id)).ToListAsync();
            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/employees/departments
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Employees
                .Select(e => e.Department)
                .Distinct()
                .ToListAsync();
            return Ok(departments);
        }

        // GET: api/employees/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _context.Employees.CountAsync();
            var active = await _context.Employees.CountAsync(e => e.IsActive);
            var deptCounts = await _context.Employees
                .GroupBy(e => e.Department)
                .Select(g => new { Department = g.Key, Count = g.Count() })
                .ToListAsync();
            var avgSalary = await _context.Employees.AverageAsync(e => (double)e.Salary);

            return Ok(new { total, active, inactive = total - active, deptCounts, avgSalary });
        }
    }
}
