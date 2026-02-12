using TrainingTracker.Core.Interfaces;
using TrainingTracker.Core.Models;
using TrainingTracker.Domain.Models;

namespace TrainingTracker.Core.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResult> RegisterAsync(string email, string password, CancellationToken ct = default)
    {
        if (await _userRepository.EmailExistsAsync(email, ct))
            throw new Exception("Email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = _passwordHasher.Hash(password)
        };

        await _userRepository.AddAsync(user, ct);

        var refreshTokenValue = _jwtService.GenerateRefreshToken();
        await _userRepository.AddRefreshTokenAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAtUtc = _jwtService.GetRefreshTokenExpiryUtc()
        }, ct);

        await _userRepository.SaveChangesAsync(ct);


        return new AuthResult
        {
            AccessToken = _jwtService.GenerateAccessToken(user),
            RefreshToken = refreshTokenValue
        };
    }

    public async Task<AuthResult?> LoginAsync(string email, string password, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByEmailAsync(email, ct);
        if (user == null)
            return null;

        if (!_passwordHasher.Verify(password, user.PasswordHash))
            return null;

        var refreshTokenValue = _jwtService.GenerateRefreshToken();

        await _userRepository.AddRefreshTokenAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAtUtc = _jwtService.GetRefreshTokenExpiryUtc()
        }, ct);

        await _userRepository.SaveChangesAsync(ct);


        return new AuthResult
        {
            AccessToken = _jwtService.GenerateAccessToken(user),
            RefreshToken = refreshTokenValue
        };
    }

    public async Task<AuthResult?> RefreshAsync(string refreshToken, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(refreshToken, ct);
        if (user == null)
            return null;

        var token = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
        if (token == null || !token.IsActive)
            return null;

        token.RevokedAtUtc = DateTime.UtcNow;

        var newRefreshTokenValue = _jwtService.GenerateRefreshToken();

        await _userRepository.AddRefreshTokenAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = newRefreshTokenValue,
            ExpiresAtUtc = _jwtService.GetRefreshTokenExpiryUtc()
        }, ct);

        await _userRepository.SaveChangesAsync(ct);


        return new AuthResult
        {
            AccessToken = _jwtService.GenerateAccessToken(user),
            RefreshToken = newRefreshTokenValue
        };
    }

}
