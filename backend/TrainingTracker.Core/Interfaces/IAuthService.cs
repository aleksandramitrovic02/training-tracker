using TrainingTracker.Core.Models;

namespace TrainingTracker.Core.Interfaces;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(string email, string password, CancellationToken ct = default);
    Task<AuthResult?> LoginAsync(string email, string password, CancellationToken ct = default);
    Task<AuthResult?> RefreshAsync(string refreshToken, CancellationToken ct = default);
    Task<bool> LogoutAsync(string refreshToken, CancellationToken ct = default);
}
