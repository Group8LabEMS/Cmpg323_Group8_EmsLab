using Group8.LabEms.Api.DTO.Equipments;
using Group8.LabEms.Api.Models.Equipments;
namespace Group8.LabEms.Api.Profiles
{

    /*
        SINCE WE ARE USING DTOS TO PREVENT DIRECT DATA ACCESS
        THIS CLASS HELPS IN CONVERTING FROM DTO TO MODEL AND VICE VERSUS.
    */
    // public class MappingProfile : Profile
    // {
    //     public MappingProfile()
    //     {
    //         CreateMap<Equipment, EquipmentDTO>();
    //         CreateMap<EquipmentDTO, Equipment>();
    //     }

    // }
    public static class EquipmentMapper
    {
        public static Equipment MapToModel(EquipmentDTO equipmentDTO)
        {
            return new Equipment
            {
                Id = equipmentDTO.Id,
                Availability = equipmentDTO.Availability,
                EquipmentStatus = equipmentDTO.EquipmentStatus,
                EquipmentType = equipmentDTO.EquipmentType,
                Name = equipmentDTO.Name,
                CreatedAt = equipmentDTO.CreatedAt,
                EquipmentTypeId = equipmentDTO.EquipmentTypeId,
                EquipmentStatusId = equipmentDTO.EquipmentStatusId
            };
        }

        public static IEnumerable<EquipmentDTO> MapToDTOList(IEnumerable<Equipment> equipments)
        {
            return equipments.Select(e => new EquipmentDTO
            {
                Id = e.Id,
                Name = e.Name,
                EquipmentTypeId = e.EquipmentTypeId,
                EquipmentStatusId = e.EquipmentStatusId,
                Availability = e.Availability,
                CreatedAt = e.CreatedAt,
                EquipmentStatus = e.EquipmentStatus,
                EquipmentType = e.EquipmentType
            }).ToList();
        }

    }

}