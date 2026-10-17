using Application.Dtos;
using FluentValidation;

namespace Application.Validators
{
    public class ChatDtoValidator : AbstractValidator<ChatDto>
    {
        public ChatDtoValidator()
        {
            RuleFor(c => c.Message)
                .NotEmpty();

            RuleFor(c => c.ChatRoleId)
                .GreaterThan(0);
        }
    }
}
