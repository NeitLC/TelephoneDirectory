using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TelephoneDirectory.Interfaces;
using TelephoneDirectory.Models;
using TelephoneDirectory.ViewModels;

namespace TelephoneDirectory.Controllers;

[ApiController]
[Route("[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ITokenProvider _tokenProvider;
    
    public AccountController(
        UserManager<User> userManager, 
        RoleManager<IdentityRole> roleManager,
        ITokenProvider tokenProvider)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _tokenProvider = tokenProvider;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var user = await _userManager.FindByNameAsync(loginModel.Username);

        if (user == null || !await _userManager.CheckPasswordAsync(user, loginModel.Password))
        {
            return Unauthorized();
        }

        var userRoles = await _userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>()
        {
            new(ClaimTypes.Name, user.UserName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        
        authClaims.AddRange(userRoles.Select(userRole => new Claim(ClaimTypes.Role, userRole)));

        var jwtToken = _tokenProvider.CreateToken(authClaims);
        var refreshToken = _tokenProvider.GenerateRefreshToken();

        var refreshTokenValidityInDays = _tokenProvider.GetRefreshTokenValidityInDays();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddDays(refreshTokenValidityInDays);

        await _userManager.UpdateAsync(user);

        return Ok(new
        {
            Token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
            RefreshToken = refreshToken,
            Expiration = jwtToken.ValidTo
        });
    }
    
    [HttpPost]
    [Authorize(Roles = "admin")]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        if (await _userManager.FindByNameAsync(registerModel.UserName) != null)
        {
            var userExistsResponse = new Response
            {
                Status = StatusCodes.Status400BadRequest.ToString(),
                Message = "User already exists!"
            };
            return StatusCode(StatusCodes.Status400BadRequest, userExistsResponse);
        }

        var user = new User
        {
            Email = registerModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = registerModel.UserName,
            PhoneNumber = registerModel.PhoneNumber
        };

        var result = await _userManager.CreateAsync(user, registerModel.Password);
        if (!result.Succeeded)
        {
            var registerFailedResponse = new Response
            {
                Status = "Error", 
                Message = "User creation failed! Please check user details and try again."
            };
            return StatusCode(StatusCodes.Status500InternalServerError, registerFailedResponse);
        }

        await AddToRole(user, registerModel.UserRole!);

        var successResponse = new Response {Status = "Success", Message = "User created successfully!"};
        return Ok(successResponse);
    }

    [HttpPost]
    [Route("refresh-token")]
    public async Task<IActionResult> RefreshToken(Token token)
    {
        var accessToken = token.AccessToken;
        var refreshToken = token.RefreshToken;

        var principal = _tokenProvider.GetPrincipalFromExpiredToken(accessToken);

        if (principal == null)
        {
            return BadRequest("Invalid access token or refresh token");
        }
        
#pragma warning disable CS8600 
#pragma warning disable CS8602
        var userName = principal.Identity.Name;
#pragma warning restore CS8602
#pragma warning restore CS8600

        var user = await _userManager.FindByNameAsync(userName);

        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
        {
            return BadRequest("Invalid access token or refresh token");
        }

        var newAccessToken = _tokenProvider.CreateToken(principal.Claims.ToList());
        var newRefreshToken = _tokenProvider.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);

        return new ObjectResult(new
        {
            accessToken = new JwtSecurityTokenHandler().WriteToken(newAccessToken),
            refreshToken = newRefreshToken
        });
    }
    
    [HttpPost]
    [Authorize]
    [Route("revoke/{userName}")]
    public async Task<IActionResult> Revoke(string userName)
    {
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return BadRequest("Invalid user name");
        }

        user.RefreshToken = null;
        await _userManager.UpdateAsync(user);
        
        return NoContent();
    }
    
    [HttpPost]
    [Authorize]
    [Route("revoke-all")]
    public async Task<IActionResult> RevokeAll()
    {
        var users = _userManager.Users.ToList();
        foreach (var user in users)
        {
            user.RefreshToken = null;
            await _userManager.UpdateAsync(user);
        }

        return NoContent();
    }

    [HttpGet]
    [Route("{userName}/in-role/{role}")]
    public async Task<IActionResult> IsInRole(string userName, string role)
    {
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null)
        {
            return BadRequest("Invalid user name");
        }
        
        var userRoles = await _userManager.GetRolesAsync(user);
        var isInRole = userRoles.Contains(role);
        return Ok(isInRole);
    }
    
    #region Helpers
    private async Task AddToRole(User user, string userRole)
    {
        if (!await _roleManager.RoleExistsAsync(userRole))
        {
            var role = new IdentityRole(userRole);
            await _roleManager.CreateAsync(role);
        }
        
        await _userManager.AddToRoleAsync(user, userRole);
    }
    #endregion
}