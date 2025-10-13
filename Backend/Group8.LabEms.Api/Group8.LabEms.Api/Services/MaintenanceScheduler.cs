using Group8.LabEms.Api.Services.Interfaces;

namespace Group8.LabEms.Api.Services
{
    public class MaintenanceScheduler:IHostedService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MaintenanceScheduler> _logger;
        private Timer _timer;

        public MaintenanceScheduler(IServiceProvider serviceProvider, ILogger<MaintenanceScheduler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(CheckMaintenanceSchedule, null, TimeSpan.Zero, TimeSpan.FromHours(24));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Dispose();
            return Task.CompletedTask;
        }

        private async void CheckMaintenanceSchedule(object? state)
        {
            try
            {
                var scope = _serviceProvider.CreateScope();
                var maintenanceService = scope.ServiceProvider.GetRequiredService<IMaintenanceService>();
                var emailService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                await maintenanceService.CheckAndCreatePreventiveMaintenanceAsync();
                 

            }
            catch (System.Exception ex)
            {
                
                    _logger.LogError(ex, "Error checking maintenance schedule");
            }
        }
    }
    
}