using Application.Dtos;
using FluentValidation;

namespace Application.Validators
{
    public class AgentRequestDtoValidator : AbstractValidator<AgentRequestDto>
    {
        public AgentRequestDtoValidator()
        {
            RuleFor(a => a.Message)
                .NotEmpty();

            RuleFor(a => a.InventoryId)
                .NotEmpty();
        }
    }
}
