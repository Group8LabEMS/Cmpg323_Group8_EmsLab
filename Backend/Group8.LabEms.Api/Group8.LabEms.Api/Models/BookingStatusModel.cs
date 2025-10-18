using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("booking_status")]
    public class BookingStatusModel
    {
        [Key]
        [Column("booking_status_id")]
        public int BookingStatusId { get; set; }

        [Required]
        [Column("name")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public required string Name { get; set; }

        [Column("description")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string? Description { get; set; }

        public ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();

    }
}