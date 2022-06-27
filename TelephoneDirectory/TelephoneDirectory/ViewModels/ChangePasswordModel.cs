using System.ComponentModel.DataAnnotations;

namespace TelephoneDirectory.ViewModels;

public class ChangePasswordModel
{
    [DataType(DataType.Password)]
    [StringLength(20, MinimumLength = 6)]
    public string? Password { get; set; }
    
    [DataType(DataType.Password)]
    [StringLength(20, MinimumLength = 6)]
    public string? NewPassword { get; set; }
    
    [Compare("Password")]
    public string? ConfirmPassword { get; set; }
}