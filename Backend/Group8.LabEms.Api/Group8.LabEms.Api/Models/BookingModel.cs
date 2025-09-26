using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Group8.LabEms.Api.Models
{
    [Table("booking")]
    public class BookingModel
    {
        [Key]
        [Column("booking_id")]
        public int BookingId { get; set; }

        [Column("user_id")]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public UserModel User { get; set; } = null!;

        [Column("equipment_id")]
        [ForeignKey(nameof(Equipment))]
        public int EquipmentId { get; set; }
        public EquipmentModel Equipment { get; set; } = null!;

        [ForeignKey(nameof(BookingStatus))]
        [Column("booking_status_id")]
        public int BookingStatusId { get; set; }
        public BookingStatusModel BookingStatus { get; set; } = null!;

        [Required]
        [Column("from_date")]
        public DateTime FromDate { get; set; }

        [Required]
        [Column("to_date")]
        public DateTime ToDate { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
    }
}