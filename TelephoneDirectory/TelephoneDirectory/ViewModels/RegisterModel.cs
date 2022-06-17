using System.ComponentModel.DataAnnotations;

namespace TelephoneDirectory.ViewModels;

public class RegisterModel
{
    [Required]
    public string? UserName { get; set; }
    
    [StringLength(20, MinimumLength = 6)]
    [DataType(DataType.Password)]
    public string? Password { get; set; }
    
    [Compare("Password")]
    public string? ConfirmPassword { get; set; }
    
    [Required]
    [DataType(DataType.EmailAddress)]
    public string? Email { get; set; }
    
    public string? PhoneNumber { get; set; }
    
    public string? UserRole { get; set; }
}