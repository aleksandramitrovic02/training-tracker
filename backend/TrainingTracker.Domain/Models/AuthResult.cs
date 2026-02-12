namespace TrainingTracker.Core.Models;

public class AuthResult
{
    public string AccessToken { get; set; } = default!;
    public string RefreshToken { get; set; } = default!;
}
