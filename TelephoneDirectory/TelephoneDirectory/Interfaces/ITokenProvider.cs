using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TelephoneDirectory.Interfaces;

public interface ITokenProvider
{
    public JwtSecurityToken CreateToken(IEnumerable<Claim> authClaims);
    public string GenerateRefreshToken();
    public int GetRefreshTokenValidityInDays();
    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token);
}