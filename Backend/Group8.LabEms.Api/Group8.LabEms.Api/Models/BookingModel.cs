using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
    public UserModel? User { get; set; }

    [Column("equipment_id")]
    [ForeignKey(nameof(Equipment))]
    public int EquipmentId { get; set; }
    public EquipmentModel? Equipment { get; set; }

    [ForeignKey(nameof(BookingStatus))]
    [Column("booking_status_id")]
    public int BookingStatusId { get; set; }
    public BookingStatusModel? BookingStatus { get; set; }

        [Required]
        [Column("from_date")]
        public DateTime FromDate { get; set; }

        [Required]
        [Column("to_date")]
        public DateTime ToDate { get; set; }

        [Column("notes")]
        [StringLength(300,ErrorMessage ="entry too long")]
        public string? Notes { get; set; }

        [Required]
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }

        public bool IsValid(out string err)
        {
            err = string.Empty;
            if (ToDate <= FromDate) err = "End Date must be after start date";
            if (BookingStatusId == 0) err = "Booking Status is required";
            return string.IsNullOrEmpty(err);
        }
    }
}