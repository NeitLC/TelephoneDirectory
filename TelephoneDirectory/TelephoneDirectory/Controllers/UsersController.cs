using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TelephoneDirectory.Models;
using TelephoneDirectory.ViewModels;

namespace TelephoneDirectory.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private RoleManager<IdentityRole> _roleManager;
    
    public UsersController(
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    [HttpGet]
    // [Authorize(Roles = "admin")]
    public IActionResult GetUsers()
    {
        var users = _userManager.Users;
        
        if (users == null)
        {
            return BadRequest("Failed to get users");
        }

        var viewUsers = users.Select(u => new UserModel
        {
            Id = u.Id,
            Email = u.Email,
            UserName = u.UserName,
            PhoneNumber = u.PhoneNumber,
            Role = _userManager.GetRolesAsync(u).Result.Count > 0 ? _userManager.GetRolesAsync(u).Result[0] : ""
        });

        return Ok(viewUsers);
    }

    [HttpDelete]
    [Authorize(Roles = "admin")]
    [Route("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var userToDelete = await _userManager.FindByIdAsync(id);
        if (userToDelete == null)
        {
            return BadRequest("Invalid user id");
        }

        var result = await _userManager.DeleteAsync(userToDelete);
        if (!result.Succeeded)
        {
            return BadRequest("Failed to delete user");
        }
        
        var successResponse = new Response {Status = "Success", Message = "User deleted successfully!"};
        return Ok(successResponse);
    }

}