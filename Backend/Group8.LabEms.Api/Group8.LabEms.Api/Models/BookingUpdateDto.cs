using System.ComponentModel.DataAnnotations;

namespace Group8.LabEms.Api.Models
{
    public class BookingUpdateDto
    {
        public int? BookingStatusId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}