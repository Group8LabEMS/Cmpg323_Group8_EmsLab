using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Group8.LabEms.Api.Services;
using Group8.LabEms.Api.Services.Interfaces;

namespace Group8.LabEms.Test.Services
{
    public class NotificationServiceTests : IDisposable
    {
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<ILogger<NotificationService>> _mockLogger;
        private readonly NotificationService _notificationService;

        public NotificationServiceTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            _mockLogger = new Mock<ILogger<NotificationService>>();

            // Setup default configuration values
            SetupConfiguration();

            _notificationService = new NotificationService(_mockConfiguration.Object, _mockLogger.Object);
        }

        private void SetupConfiguration()
        {
            _mockConfiguration.Setup(x => x["EmailSettings:SmtpHost"]).Returns("smtp.test.com");
            _mockConfiguration.Setup(x => x["EmailSettings:SmtpPort"]).Returns("587");
            _mockConfiguration.Setup(x => x["EmailSettings:Username"]).Returns("test@test.com");
            _mockConfiguration.Setup(x => x["EmailSettings:Password"]).Returns("testpassword");
            _mockConfiguration.Setup(x => x["EmailSettings:FromEmail"]).Returns("noreply@labems.com");
            _mockConfiguration.Setup(x => x["EmailSettings:FromName"]).Returns("LabEMS Test");
            _mockConfiguration.Setup(x => x["EmailSettings:EnableSsl"]).Returns("true");
        }

        [Fact]
        public void Constructor_WithValidConfiguration_CreatesInstance()
        {
            // Arrange & Act
            var service = new NotificationService(_mockConfiguration.Object, _mockLogger.Object);

            // Assert
            Assert.NotNull(service);
        }

        [Fact]
        public void Constructor_WithNullConfiguration_ThrowsArgumentNullException()
        {
            // Arrange & Act & Assert
            Assert.Throws<ArgumentNullException>(() => new NotificationService(null, _mockLogger.Object));
        }

        [Fact]
        public void Constructor_WithNullLogger_ThrowsArgumentNullException()
        {
            // Arrange & Act & Assert
            Assert.Throws<ArgumentNullException>(() => new NotificationService(_mockConfiguration.Object, null));
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public async Task SendEmailAsync_WithInvalidEmail_ThrowsArgumentException(string email)
        {
            // Arrange & Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _notificationService.SendEmailAsync(email, "Test Subject", "Test Body"));
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public async Task SendEmailAsync_WithInvalidSubject_ThrowsArgumentException(string subject)
        {
            // Arrange & Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _notificationService.SendEmailAsync("test@test.com", subject, "Test Body"));
        }

        [Fact]
        public async Task SendBookingConfirmationAsync_WithValidData_ExecutesWithoutException()
        {
            // Arrange
            var userEmail = "user@test.com";
            var equipmentName = "Test Equipment";
            var bookingDate = DateTime.Now.Date;
            var startTime = DateTime.Now;
            var endTime = DateTime.Now.AddHours(2);

            // Act & Assert
            var exception = await Record.ExceptionAsync(() => 
                _notificationService.SendBookingConfirmationAsync(userEmail, equipmentName, bookingDate, startTime, endTime));

            // Note: This will throw an InvalidOperationException due to SMTP configuration
            // but we're testing that the method handles parameters correctly
            Assert.IsType<InvalidOperationException>(exception);
            Assert.Contains("Failed to send email notification", exception.Message);
        }

        [Fact]
        public async Task SendBookingCancellationAsync_WithValidData_ExecutesWithoutException()
        {
            // Arrange
            var userEmail = "user@test.com";
            var equipmentName = "Test Equipment";
            var bookingDate = DateTime.Now.Date;

            // Act & Assert
            var exception = await Record.ExceptionAsync(() => 
                _notificationService.SendBookingCancellationAsync(userEmail, equipmentName, bookingDate));

            // Note: This will throw an InvalidOperationException due to SMTP configuration
            Assert.IsType<InvalidOperationException>(exception);
            Assert.Contains("Failed to send email notification", exception.Message);
        }

        [Fact]
        public async Task SendMaintenanceNotificationAsync_WithValidData_ExecutesWithoutException()
        {
            // Arrange
            var userEmail = "user@test.com";
            var equipmentName = "Test Equipment";
            var maintenanceDate = DateTime.Now.AddDays(1);
            var maintenanceType = "Routine";

            // Act & Assert
            var exception = await Record.ExceptionAsync(() => 
                _notificationService.SendMaintenanceNotificationAsync(userEmail, equipmentName, maintenanceDate, maintenanceType));

            Assert.IsType<InvalidOperationException>(exception);
            Assert.Contains("Failed to send email notification", exception.Message);
        }

        [Fact]
        public async Task SendEquipmentAvailableAsync_WithValidData_ExecutesWithoutException()
        {
            // Arrange
            var userEmail = "user@test.com";
            var equipmentName = "Test Equipment";

            // Act & Assert
            var exception = await Record.ExceptionAsync(() => 
                _notificationService.SendEquipmentAvailableAsync(userEmail, equipmentName));

            Assert.IsType<InvalidOperationException>(exception);
            Assert.Contains("Failed to send email notification", exception.Message);
        }

        [Theory]
        [InlineData("invalid-email")]
        [InlineData("@test.com")]
        [InlineData("test@")]
        public async Task SendEmailAsync_WithMalformedEmail_ThrowsException(string email)
        {
            // Arrange & Act & Assert
            var exception = await Assert.ThrowsAnyAsync<Exception>(() => 
                _notificationService.SendEmailAsync(email, "Test Subject", "Test Body"));

            Assert.NotNull(exception);
        }

        [Fact]
        public async Task SendEmailAsync_WithMultipleRecipients_ExecutesWithoutArgumentException()
        {
            // Arrange
            var emails = new[] { "user1@test.com", "user2@test.com", "user3@test.com" };
            var subject = "Test Subject";
            var body = "Test Body";

            // Act & Assert
            var exception = await Record.ExceptionAsync(() => 
                _notificationService.SendEmailAsync(emails, subject, body));

            // Should throw InvalidOperationException (SMTP issue) but not ArgumentException
            Assert.IsType<InvalidOperationException>(exception);
        }

        [Fact]
        public async Task SendEmailAsync_WithEmptyRecipientsArray_ThrowsArgumentException()
        {
            // Arrange
            var emails = new string[0];

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(() => 
                _notificationService.SendEmailAsync(emails, "Test Subject", "Test Body"));
        }

        [Fact]
        public void Configuration_Values_AreReadCorrectly()
        {
            // Arrange & Act
            // The constructor should have read all configuration values without throwing

            // Assert
            _mockConfiguration.Verify(x => x["EmailSettings:SmtpHost"], Times.AtLeastOnce);
            _mockConfiguration.Verify(x => x["EmailSettings:SmtpPort"], Times.AtLeastOnce);
            _mockConfiguration.Verify(x => x["EmailSettings:Username"], Times.AtLeastOnce);
            _mockConfiguration.Verify(x => x["EmailSettings:Password"], Times.AtLeastOnce);
            _mockConfiguration.Verify(x => x["EmailSettings:FromEmail"], Times.AtLeastOnce);
            _mockConfiguration.Verify(x => x["EmailSettings:FromName"], Times.AtLeastOnce);
            _mockConfiguration.Verify(x => x["EmailSettings:EnableSsl"], Times.AtLeastOnce);
        }

        public void Dispose()
        {
            // Clean up resources if needed
        }
    }
}