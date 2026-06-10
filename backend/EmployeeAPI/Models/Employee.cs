using System.ComponentModel.DataAnnotations;

namespace EmployeeAPI.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string FirstName { get; set; } = "";

        [Required]
        public string LastName { get; set; } = "";

        [Required, EmailAddress]
        public string Email { get; set; } = "";

        public string Phone { get; set; } = "";

        [Required]
        public string Department { get; set; } = "";

        [Required]
        public string Position { get; set; } = "";

        public decimal Salary { get; set; }

        public DateTime JoinDate { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    }
}
