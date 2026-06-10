using System.ComponentModel.DataAnnotations;

namespace EmployeeAPI.DTOs
{
    public class EmployeeCreateDto
    {
        [Required] public string FirstName { get; set; } = "";
        [Required] public string LastName { get; set; } = "";
        [Required, EmailAddress] public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        [Required] public string Department { get; set; } = "";
        [Required] public string Position { get; set; } = "";
        public decimal Salary { get; set; }
        public DateTime JoinDate { get; set; } = DateTime.UtcNow;
    }

    public class EmployeeUpdateDto
    {
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Department { get; set; } = "";
        public string Position { get; set; } = "";
        public decimal Salary { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class LoginDto
    {
        [Required] public string Username { get; set; } = "";
        [Required] public string Password { get; set; } = "";
    }
}
