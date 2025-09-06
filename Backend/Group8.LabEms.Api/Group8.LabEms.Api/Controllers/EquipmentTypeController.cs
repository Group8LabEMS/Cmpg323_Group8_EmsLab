using Group8.LabEms.Api.DTO.EquipmentType;
using Group8.LabEms.Api.Models.Equipments;
using Group8.LabEms.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Group8.LabEms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EquipmentTypeController : ControllerBase
    {
        private readonly IEquipmentTypeService _service;
        public EquipmentTypeController(IEquipmentTypeService service)
        {
            _service = service;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EquipmentTypeDTO>> UpdateType(int id, [FromBody] UpdateEquipmentTypeDTO dto)
        {
            try
            {
                var equipmentType = await _service.UpdateEquipmentType(id, dto);
                return Ok(equipmentType);

            }
            catch (Exception ex)
            {

                return StatusCode(500,
            new
            {
                message = "An error occurred while updating equipment type",
                error = ex.Message
            });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipmentType(int id)
        {
            try
            {
                var type = await _service.DeleteEquipmentType(id);
                if (!type) return NotFound($"Type with id {id} does not exist");

                return NoContent();
            }
            catch (Exception ex)
            {

                return StatusCode(500,
             new
             {
                 message = "An error occurred while deleting equipment type",
                 error = ex.Message
             });
            }
        }

        [HttpPost]
        public async Task<ActionResult<EquipmentTypeDTO>> AddEquipmentStatus([FromBody] AddEquipmentTypeDTO dto)
        {
            try
            {
                var type = await _service.AddEquipmentType(dto);
                return CreatedAtAction(nameof(GetEquipmentTypeById), new { id = type.Id }, type);
            }
            catch (Exception ex)
            {

                return StatusCode(500,
               new
               {
                   message = "An error occurred while adding new type",
                   error = ex.Message
               });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EquipmentTypeDTO>> GetEquipmentTypeById(int id)
        {
            try
            {
                var type = await _service.GetEquipmentTypeById(id);
                if (type == null) return NotFound("Type with that id does not exist");
                return Ok(type);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                new
                {
                    message = "An error occurred while retrieving status",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EquipmentTypeDTO>>> GetAllEquipmentStatus()
        {
            try
            {
                var type = await _service.GetAllEquipmentType();
                return Ok(type);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving available equipment types", error = ex.Message });

            }
        }


    }

}