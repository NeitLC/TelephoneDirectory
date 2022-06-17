using System.ComponentModel.DataAnnotations;

namespace TelephoneDirectory.ViewModels;

public class LoginModel
{
    [Required]
    public string? Username { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [MinLength(6)]
    public string? Password { get; set; }
}