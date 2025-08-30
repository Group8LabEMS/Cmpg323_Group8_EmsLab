namespace LabEMSApi.Models
{

    /*
        HOLD THE EQUIPMENT DETAILS AS PER ERD
        STATUS AND AVAILABILITY TO BE REVISITED 
        TO CHECK IF THEY CAN BE ENUMS OR BOOLEANS
    */
    public class Equipment
    {
        public int Id { get; set; }
        public String Name { get; set; }
        public String Type { get; set; }
        public String Status { get; set; }
        public String Availability { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.now;
    }
}