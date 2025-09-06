using System.ComponentModel.DataAnnotations;
using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.DTO.EquipmentStatus;


namespace Group8.LabEms.Api.DTO.EquipmentType
{
    /*
        Inherit all the properties from the Equipment status.
        All the fields are the same.
    */
    public class EquipmentTypeDTO : EquipmentStatusDTO;
    public class AddEquipmentTypeDTO : AddEquipmentStatusDTO;
    public class UpdateEquipmentTypeDTO : UpdateEquipmentStatusDTO;
    public class DeleteEquipmentType : DeleteEquipmentStatusDTO;
}