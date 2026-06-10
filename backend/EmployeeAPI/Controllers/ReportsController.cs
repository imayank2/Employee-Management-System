using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;
using iTextSharp.text;
using iTextSharp.text.pdf;
using EmployeeAPI.Data;

namespace EmployeeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/reports/employees/excel
        [HttpGet("employees/excel")]
        public async Task<IActionResult> EmployeesExcel()
        {
            var employees = await _context.Employees.ToListAsync();
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Employees");

            string[] headers = { "ID", "First Name", "Last Name", "Email", "Department", "Position", "Salary", "Join Date", "Status" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(1, i + 1).Value = headers[i];
                ws.Cell(1, i + 1).Style.Font.Bold = true;
                ws.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#4472C4");
                ws.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
            }

            for (int i = 0; i < employees.Count; i++)
            {
                var e = employees[i];
                ws.Cell(i + 2, 1).Value = e.Id;
                ws.Cell(i + 2, 2).Value = e.FirstName;
                ws.Cell(i + 2, 3).Value = e.LastName;
                ws.Cell(i + 2, 4).Value = e.Email;
                ws.Cell(i + 2, 5).Value = e.Department;
                ws.Cell(i + 2, 6).Value = e.Position;
                ws.Cell(i + 2, 7).Value = (double)e.Salary;
                ws.Cell(i + 2, 8).Value = e.JoinDate.ToString("yyyy-MM-dd");
                ws.Cell(i + 2, 9).Value = e.IsActive ? "Active" : "Inactive";
            }

            ws.Columns().AdjustToContents();
            using var ms = new MemoryStream();
            wb.SaveAs(ms);
            return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "employees.xlsx");
        }

        // GET: api/reports/employees/pdf
        [HttpGet("employees/pdf")]
        public async Task<IActionResult> EmployeesPdf()
        {
            var employees = await _context.Employees.ToListAsync();
            using var ms = new MemoryStream();
            var doc = new Document(PageSize.A4.Rotate(), 20, 20, 30, 30);
            PdfWriter.GetInstance(doc, ms);
            doc.Open();

            var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16);
            doc.Add(new Paragraph("Employee Directory Report", titleFont) { Alignment = Element.ALIGN_CENTER });
            doc.Add(new Paragraph($"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}", FontFactory.GetFont(FontFactory.HELVETICA, 10)) { Alignment = Element.ALIGN_CENTER });
            doc.Add(new Paragraph(" "));

            var table = new PdfPTable(8) { WidthPercentage = 100 };
            table.SetWidths(new float[] { 1, 2, 2, 3, 2, 2, 2, 1.5f });

            string[] headers = { "ID", "First Name", "Last Name", "Email", "Department", "Position", "Salary", "Status" };
            var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 9, new BaseColor(255, 255, 255)); // ← FIXED
            var headerBg = new BaseColor(68, 114, 196);
            foreach (var h in headers)
            {
                var cell = new PdfPCell(new Phrase(h, headerFont))
                {
                    BackgroundColor = headerBg,
                    HorizontalAlignment = Element.ALIGN_CENTER,
                    Padding = 6
                };
                table.AddCell(cell);
            }

            var cellFont = FontFactory.GetFont(FontFactory.HELVETICA, 8);
            bool alternate = false;
            foreach (var e in employees)
            {
                var bg = alternate ? new BaseColor(242, 242, 242) : new BaseColor(255, 255, 255); // ← FIXED
                foreach (var val in new[] { e.Id.ToString(), e.FirstName, e.LastName, e.Email, e.Department, e.Position, e.Salary.ToString("N2"), e.IsActive ? "Active" : "Inactive" })
                {
                    table.AddCell(new PdfPCell(new Phrase(val, cellFont)) { BackgroundColor = bg, Padding = 5 });
                }
                alternate = !alternate;
            }

            doc.Add(table);
            doc.Close();

            return File(ms.ToArray(), "application/pdf", "employees.pdf");
        }

        // GET: api/reports/attendance/excel
        [HttpGet("attendance/excel")]
        public async Task<IActionResult> AttendanceExcel()
        {
            var records = await _context.Attendances.Include(a => a.Employee).ToListAsync();
            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Attendance");

            string[] headers = { "Employee", "Department", "Date", "Check In", "Check Out", "Status" };
            for (int i = 0; i < headers.Length; i++)
            {
                ws.Cell(1, i + 1).Value = headers[i];
                ws.Cell(1, i + 1).Style.Font.Bold = true;
            }

            for (int i = 0; i < records.Count; i++)
            {
                var r = records[i];
                ws.Cell(i + 2, 1).Value = $"{r.Employee.FirstName} {r.Employee.LastName}";
                ws.Cell(i + 2, 2).Value = r.Employee.Department;
                ws.Cell(i + 2, 3).Value = r.Date.ToString("yyyy-MM-dd");
                ws.Cell(i + 2, 4).Value = r.CheckIn?.ToString() ?? "-";
                ws.Cell(i + 2, 5).Value = r.CheckOut?.ToString() ?? "-";
                ws.Cell(i + 2, 6).Value = r.Status;
            }

            ws.Columns().AdjustToContents();
            using var ms = new MemoryStream();
            wb.SaveAs(ms);
            return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "attendance.xlsx");
        }
    }
}