using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TelephoneDirectory.Interfaces;

namespace TelephoneDirectory.Implementation;

public class TokenProvider : ITokenProvider
{
    private const string ValidIssuerParameter = "JWT:ValidIssuer";
    private const string ValidAudienceParameter = "JWT:ValidAudience";
    private const string SecretParameter = "JWT:Secret";
    private const string TokenValidityInMinutesParameter = "JWT:TokenValidityInMinutes";
    private const string RefreshTokenValidityInDaysParameter = "JWT:RefreshTokenValidityInDays";
    
    private readonly IConfiguration _configuration;

    public TokenProvider(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public JwtSecurityToken CreateToken(IEnumerable<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[SecretParameter]));
        var signingCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256);
        _ = int.TryParse(_configuration[TokenValidityInMinutesParameter], out var tokenValidityInMinutes);

        var token = new JwtSecurityToken(
            issuer: _configuration[ValidIssuerParameter],
            audience: _configuration[ValidAudienceParameter],
            expires: DateTime.Now.AddMinutes(tokenValidityInMinutes),
            claims: authClaims,
            signingCredentials: signingCredentials
        );

        return token;
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var randomNumberGenerator = RandomNumberGenerator.Create();
        randomNumberGenerator.GetBytes(randomNumber);
        string refreshToken = Convert.ToBase64String(randomNumber);
        return refreshToken;
    }

    public int GetRefreshTokenValidityInDays()
    {
        _ = int.TryParse(_configuration[RefreshTokenValidityInDaysParameter], out var refreshTokenValidityInDays);
        return refreshTokenValidityInDays;
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string? token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[SecretParameter])),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (!TokenValid(securityToken))
        {
            throw new SecurityTokenException("Invalid token");
        }

        return principal;
    }
    
    private bool TokenValid(SecurityToken securityToken)
    {
        return !(securityToken is not JwtSecurityToken jwtSecurityToken ||
                 !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                     StringComparison.InvariantCultureIgnoreCase));
    }
}