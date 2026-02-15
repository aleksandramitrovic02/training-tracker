using Microsoft.AspNetCore.Mvc;
using TrainingTracker.Api.DTOs.Auth;
using TrainingTracker.Core.Interfaces;

namespace TrainingTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterRequestDto request, CancellationToken ct)
    {
        try
        {
            var result = await _authService.RegisterAsync(request.Email, request.Password, ct);
            return Ok(new AuthResponseDto { AccessToken = result.AccessToken, RefreshToken = result.RefreshToken });
        }
        catch (Exception ex)
        {
            
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request, CancellationToken ct)
    {
        var result = await _authService.LoginAsync(request.Email, request.Password, ct);
        if (result == null) return Unauthorized(new { message = "Invalid email or password." });
        return Ok(new AuthResponseDto { AccessToken = result.AccessToken, RefreshToken = result.RefreshToken });
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> Refresh([FromBody] RefreshRequestDto request, CancellationToken ct)
    {
        var result = await _authService.RefreshAsync(request.RefreshToken, ct);
        if (result == null) return Unauthorized(new { message = "Invalid refresh token." });

        return Ok(new AuthResponseDto { AccessToken = result.AccessToken, RefreshToken = result.RefreshToken });
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request, CancellationToken ct)
    {
        var ok = await _authService.LogoutAsync(request.RefreshToken, ct);
        if (!ok) return Unauthorized(new { message = "Invalid refresh token." });

        return NoContent();
    }


}
