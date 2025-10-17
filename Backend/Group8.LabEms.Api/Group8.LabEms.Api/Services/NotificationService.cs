using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Group8.LabEms.Api.Services.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;

namespace Group8.LabEms.Api.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<NotificationService> _logger;
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly string _fromName;
        private readonly bool _enableSsl;

        public NotificationService(IConfiguration configuration, ILogger<NotificationService> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            // Load email configuration from appsettings
            _smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
            _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            _smtpUsername = _configuration["EmailSettings:Username"] ?? "";
            _smtpPassword = _configuration["EmailSettings:Password"] ?? "";
            _fromEmail = _configuration["EmailSettings:FromEmail"] ?? "";
            _fromName = _configuration["EmailSettings:FromName"] ?? "LabEMS System";
            _enableSsl = bool.Parse(_configuration["EmailSettings:EnableSsl"] ?? "true");

            Console.WriteLine($"SMTP Host: {_smtpHost}, Port: {_smtpPort}, From: {_fromEmail}");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body, bool isHtml = false,byte[]? attachmentBytes = null, string? attachmentName = null)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
                throw new ArgumentException("Email address cannot be null or empty", nameof(toEmail));
            if (string.IsNullOrWhiteSpace(subject))
                throw new ArgumentException("Subject cannot be null or empty", nameof(subject));

            await SendEmailAsync(new[] { toEmail }, subject, body, isHtml);
        }

        public async Task SendEmailAsync(string[] toEmails, string subject, string body, bool isHtml = false , byte[]? attachmentBytes = null, string? attachmentName = null)
        {
            if (toEmails == null || toEmails.Length == 0)
                throw new ArgumentException("At least one email address must be provided", nameof(toEmails));
            if (string.IsNullOrWhiteSpace(subject))
                throw new ArgumentException("Subject cannot be null or empty", nameof(subject));

            try
            {
                using var client = new SmtpClient(_smtpHost, _smtpPort);
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                client.EnableSsl = _enableSsl;

                using var message = new MailMessage();
                message.From = new MailAddress(_fromEmail, _fromName);
                message.Subject = subject;
                message.Body = body;
                message.IsBodyHtml = isHtml;

                foreach (var email in toEmails)
                {
                    message.To.Add(email);
                }

                await client.SendMailAsync(message);
                _logger.LogInformation("Email sent successfully to {Recipients}", string.Join(", ", toEmails));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Recipients}", string.Join(", ", toEmails));
                throw new InvalidOperationException("Failed to send email notification", ex);
            }
        }

        public async Task SendBookingConfirmationAsync(string userEmail, string equipmentName, DateTime bookingDate, DateTime startTime, DateTime endTime)
        {
            var subject = "Booking Confirmation - LabEMS";
            var body = $@"
                <h2>Booking Confirmation</h2>
                <p>Dear User,</p>
                <p>Your booking has been confirmed with the following details:</p>
                <ul>
                    <li><strong>Equipment:</strong> {equipmentName}</li>
                    <li><strong>Date:</strong> {bookingDate:yyyy-MM-dd}</li>
                    <li><strong>Time:</strong> {startTime:HH:mm} - {endTime:HH:mm}</li>
                </ul>
                <p>Please ensure you return the equipment on time and in good condition.</p>
                <p>Best regards,<br/>LabEMS Team</p>
            ";
            var pdf = BookingPDF(equipmentName, bookingDate, startTime, endTime);
            await SendEmailAsync(userEmail, subject, body, true, pdf, "BookingConfirmation.pdf");
        }

        public async Task SendBookingCancellationAsync(string userEmail, string equipmentName, DateTime bookingDate)
        {
            var subject = "Booking Cancellation - LabEMS";
            var body = $@"
                <h2>Booking Cancellation</h2>
                <p>Dear User,</p>
                <p>Your booking has been cancelled:</p>
                <ul>
                    <li><strong>Equipment:</strong> {equipmentName}</li>
                    <li><strong>Date:</strong> {bookingDate:yyyy-MM-dd}</li>
                </ul>
                <p>If you have any questions, please contact the lab administrator.</p>
                <p>Best regards,<br/>LabEMS Team</p>
            ";

            await SendEmailAsync(userEmail, subject, body, true);
        }

        public async Task SendMaintenanceNotificationAsync(string userEmail, string equipmentName, DateTime maintenanceDate, string maintenanceType)
        {
            var subject = "Equipment Maintenance Notification - LabEMS";
            var body = $@"
                <h2>Maintenance Notification</h2>
                <p>Dear User,</p>
                <p>The following equipment is scheduled for maintenance:</p>
                <ul>
                    <li><strong>Equipment:</strong> {equipmentName}</li>
                    <li><strong>Maintenance Type:</strong> {maintenanceType}</li>
                    <li><strong>Scheduled Date:</strong> {maintenanceDate:yyyy-MM-dd}</li>
                </ul>
                <p>The equipment will be unavailable during this time. Please plan accordingly.</p>
                <p>Best regards,<br/>LabEMS Team</p>
            ";

            await SendEmailAsync(userEmail, subject, body, true);
        }

        public async Task SendEquipmentAvailableAsync(string userEmail, string equipmentName)
        {
            var subject = "Equipment Available - LabEMS";
            var body = $@"
                <h2>Equipment Now Available</h2>
                <p>Dear User,</p>
                <p>The equipment <strong>{equipmentName}</strong> is now available for booking.</p>
                <p>You can log into the LabEMS system to make a booking.</p>
                <p>Best regards,<br/>LabEMS Team</p>
            ";

            await SendEmailAsync(userEmail, subject, body, true);
        }

        public async Task SendWelcomeEmailAsync(string userEmail, string userName, string role)
        {
            var subject = "Welcome to LabEMS - Account Created";
            var body = $@"
                <h2>Welcome to LabEMS!</h2>
                <p>Dear {userName},</p>
                <p>Your account has been successfully created in the Laboratory Equipment Management System.</p>
                <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>
                    <h3>Account Details:</h3>
                    <ul>
                        <li><strong>Name:</strong> {userName}</li>
                        <li><strong>Email:</strong> {userEmail}</li>
                        <li><strong>Role:</strong> {role}</li>
                        <li><strong>Account Created:</strong> {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC</li>
                    </ul>
                </div>
                <p>You can now access the LabEMS system to:</p>
                <ul>
                    <li>Browse available equipment</li>
                    <li>Make equipment bookings</li>
                    <li>View your booking history</li>
                    <li>Manage your profile</li>
                </ul>
                <p>If you have any questions or need assistance, please contact your system administrator.</p>
                <p>Best regards,<br/>LabEMS Team</p>
            ";

            await SendEmailAsync(userEmail, subject, body, true);
        }

         private byte[] BookingPDF(string equipmentName, DateTime bookingDate, DateTime startTime, DateTime endTime)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));



                    page.Content()
                        .Column(col =>
                        {
                            col.Item().Text("LabEMS")
                            .FontSize(28)
                            .Bold()
                            .FontColor(Colors.Black)
                            .AlignCenter();

                            col.Item().Text("Your booking has been confirmed!").FontSize(14).AlignCenter();
                            col.Item().Text($"Equipment: {equipmentName}").FontSize(14).Bold();
                            col.Item().Text($"Date: {bookingDate:yyyy-MM-dd}").FontSize(14).Bold();
                            col.Item().Text($"Time: {startTime:HH:mm} - {endTime:HH:mm}").FontSize(14).Bold();
                            col.Item().PaddingTop(20).Text("Please ensure you return the equipment on time and in good condition.");
                        });
                        

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Generated on ");
                            x.Span(DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")).Bold();
                            x.Span(" UTC");
                        });
                });
            });
            QuestPDF.Settings.License = LicenseType.Community;
            return document.GeneratePdf();
        }
    }
}