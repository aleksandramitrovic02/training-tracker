using TrainingTracker.Domain.Models;

namespace TrainingTracker.Core.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    DateTime GetRefreshTokenExpiryUtc();
}
