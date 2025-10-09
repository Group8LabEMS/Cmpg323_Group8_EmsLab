using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class BookingUpdateDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "BookingStatusId must be greater than 0")]
        public int BookingStatusId { get; set; }
    }
}